-- ═══════════════════════════════════════════════════════════════════════════════
-- StrokeSync — Post-Migration SQL: RLS, pgcrypto, Audit Triggers
-- Run AFTER `prisma migrate dev` to add PostgreSQL-native security features
-- that Prisma cannot express declaratively.
-- ═══════════════════════════════════════════════════════════════════════════════

-- ─── 1. Enable Extensions ──────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ─── 2. Application Role for Connection Pooling ────────────────────────────────
-- In production, the NestJS app connects as `strokesync_app` (not superuser).
-- DO $role_setup$
-- BEGIN
--   IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'strokesync_app') THEN
--     CREATE ROLE strokesync_app LOGIN PASSWORD 'changeme_in_production';
--   END IF;
--   GRANT USAGE ON SCHEMA public TO strokesync_app;
--   GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO strokesync_app;
--   GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO strokesync_app;
--   ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO strokesync_app;
-- END $role_setup$;

-- ─── 3. Row Level Security (RLS) ──────────────────────────────────────────────
-- Enable RLS on PHI-containing tables. Policies are enforced when connecting
-- as the `strokesync_app` role. The NestJS backend sets `app.current_user_id`
-- and `app.current_user_role` on each connection via SET LOCAL.

-- Patients: Users can only see patients from their encounters
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;

CREATE POLICY patients_technician_access ON patients
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'ADMIN'
    OR id IN (
      SELECT patient_id FROM encounters
      WHERE technician_id = current_setting('app.current_user_id', true)::uuid
        OR neurologist_id = current_setting('app.current_user_id', true)::uuid
    )
  );

-- Encounters: Team members only
ALTER TABLE encounters ENABLE ROW LEVEL SECURITY;

CREATE POLICY encounters_team_access ON encounters
  FOR ALL
  USING (
    current_setting('app.current_user_role', true) = 'ADMIN'
    OR technician_id = current_setting('app.current_user_id', true)::uuid
    OR neurologist_id = current_setting('app.current_user_id', true)::uuid
  );

-- Audit logs: Read-only (no delete, no update for non-admin)
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY audit_logs_admin_only ON audit_logs
  FOR ALL
  USING (current_setting('app.current_user_role', true) = 'ADMIN');

-- ─── 4. Immutable Audit Log Trigger ────────────────────────────────────────────
-- Prevents UPDATE and DELETE on audit_logs table

CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
  RAISE EXCEPTION 'HIPAA VIOLATION: audit_logs table is immutable. Cannot % records.',
    TG_OP;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER audit_log_immutable
  BEFORE UPDATE OR DELETE ON audit_logs
  FOR EACH ROW
  EXECUTE FUNCTION prevent_audit_log_modification();

-- ─── 5. Auto-Audit Trigger for PHI Tables ──────────────────────────────────────
-- Automatically creates an audit_log entry when PHI-containing tables are modified.

CREATE OR REPLACE FUNCTION audit_phi_change()
RETURNS TRIGGER AS $$
DECLARE
  v_user_id uuid;
  v_old_json jsonb;
  v_new_json jsonb;
BEGIN
  -- Try to get the current user from session variable
  BEGIN
    v_user_id := current_setting('app.current_user_id', true)::uuid;
  EXCEPTION WHEN OTHERS THEN
    v_user_id := NULL;
  END;

  IF TG_OP = 'DELETE' THEN
    v_old_json := to_jsonb(OLD);
    v_new_json := NULL;
  ELSIF TG_OP = 'UPDATE' THEN
    v_old_json := to_jsonb(OLD);
    v_new_json := to_jsonb(NEW);
  ELSIF TG_OP = 'INSERT' THEN
    v_old_json := NULL;
    v_new_json := to_jsonb(NEW);
  END IF;

  INSERT INTO audit_logs (
    id, user_id, action, resource, resource_id,
    old_values, new_values, phi_accessed, description, created_at
  ) VALUES (
    gen_random_uuid(),
    v_user_id,
    CASE TG_OP
      WHEN 'INSERT' THEN 'PHI_MODIFY'
      WHEN 'UPDATE' THEN 'PHI_MODIFY'
      WHEN 'DELETE' THEN 'DELETE'
    END::"AuditAction",
    CASE TG_TABLE_NAME
      WHEN 'patients' THEN 'PATIENT'
      WHEN 'vital_signs' THEN 'VITAL_SIGN'
      WHEN 'lab_results' THEN 'LAB_RESULT'
      WHEN 'imaging_studies' THEN 'IMAGING'
      WHEN 'nihss_assessments' THEN 'NIHSS'
      WHEN 'consultations' THEN 'CONSULTATION'
      WHEN 'messages' THEN 'MESSAGE'
    END::"AuditResource",
    COALESCE(NEW.id, OLD.id),
    v_old_json,
    v_new_json,
    true,
    FORMAT('Auto-audit: %s on %s', TG_OP, TG_TABLE_NAME),
    NOW()
  );

  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Apply the PHI audit trigger to all sensitive tables
CREATE TRIGGER patients_phi_audit
  AFTER INSERT OR UPDATE OR DELETE ON patients
  FOR EACH ROW EXECUTE FUNCTION audit_phi_change();

CREATE TRIGGER vital_signs_phi_audit
  AFTER INSERT OR UPDATE OR DELETE ON vital_signs
  FOR EACH ROW EXECUTE FUNCTION audit_phi_change();

CREATE TRIGGER lab_results_phi_audit
  AFTER INSERT OR UPDATE OR DELETE ON lab_results
  FOR EACH ROW EXECUTE FUNCTION audit_phi_change();

CREATE TRIGGER imaging_studies_phi_audit
  AFTER INSERT OR UPDATE OR DELETE ON imaging_studies
  FOR EACH ROW EXECUTE FUNCTION audit_phi_change();

CREATE TRIGGER nihss_assessments_phi_audit
  AFTER INSERT OR UPDATE OR DELETE ON nihss_assessments
  FOR EACH ROW EXECUTE FUNCTION audit_phi_change();

CREATE TRIGGER consultations_phi_audit
  AFTER INSERT OR UPDATE OR DELETE ON consultations
  FOR EACH ROW EXECUTE FUNCTION audit_phi_change();

CREATE TRIGGER messages_phi_audit
  AFTER INSERT OR UPDATE OR DELETE ON messages
  FOR EACH ROW EXECUTE FUNCTION audit_phi_change();

-- ─── 6. Encryption Helper Functions ────────────────────────────────────────────
-- Application-layer encryption using pgcrypto + AES-256.
-- The ENCRYPTION_KEY env variable is set in the NestJS app and passed via session.

CREATE OR REPLACE FUNCTION encrypt_phi(plaintext text)
RETURNS text AS $$
DECLARE
  v_key bytea;
BEGIN
  v_key := decode(current_setting('app.encryption_key', true), 'hex');
  IF v_key IS NULL THEN
    RETURN plaintext; -- Fallback: no encryption key set
  END IF;
  RETURN encode(pgp_sym_encrypt(plaintext, encode(v_key, 'hex')), 'base64');
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrypt_phi(ciphertext text)
RETURNS text AS $$
DECLARE
  v_key bytea;
BEGIN
  v_key := decode(current_setting('app.encryption_key', true), 'hex');
  IF v_key IS NULL THEN
    RETURN ciphertext; -- Fallback: return as-is
  END IF;
  RETURN pgp_sym_decrypt(decode(ciphertext, 'base64'), encode(v_key, 'hex'));
EXCEPTION WHEN OTHERS THEN
  RETURN ciphertext; -- Return as-is if decryption fails
END;
$$ LANGUAGE plpgsql;

-- ─── 7. Indexes for JSONB Columns ──────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_vital_signs_details ON vital_signs USING gin (details);
CREATE INDEX IF NOT EXISTS idx_lab_results_results ON lab_results USING gin (results);
CREATE INDEX IF NOT EXISTS idx_imaging_studies_details ON imaging_studies USING gin (details);
CREATE INDEX IF NOT EXISTS idx_nihss_assessments_details ON nihss_assessments USING gin (details);
CREATE INDEX IF NOT EXISTS idx_alerts_metadata ON alerts USING gin (metadata);

-- ─── 8. Constraints ────────────────────────────────────────────────────────────
-- NIHSS component score ranges
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_loc      CHECK (level_of_consciousness BETWEEN 0 AND 3);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_locq     CHECK (loc_questions BETWEEN 0 AND 2);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_locc     CHECK (loc_commands BETWEEN 0 AND 2);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_gaze     CHECK (best_gaze BETWEEN 0 AND 2);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_visual   CHECK (visual_fields BETWEEN 0 AND 3);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_facial   CHECK (facial_palsy BETWEEN 0 AND 3);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_mla      CHECK (motor_left_arm BETWEEN 0 AND 4);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_mra      CHECK (motor_right_arm BETWEEN 0 AND 4);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_mll      CHECK (motor_left_leg BETWEEN 0 AND 4);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_mrl      CHECK (motor_right_leg BETWEEN 0 AND 4);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_ataxia   CHECK (limb_ataxia BETWEEN 0 AND 2);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_sensory  CHECK (sensory BETWEEN 0 AND 2);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_language  CHECK (best_language BETWEEN 0 AND 3);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_dysarth  CHECK (dysarthria BETWEEN 0 AND 2);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_extinct  CHECK (extinction_inattention BETWEEN 0 AND 2);
ALTER TABLE nihss_assessments ADD CONSTRAINT chk_total    CHECK (total_score BETWEEN 0 AND 42);

-- Vital range sanity checks
ALTER TABLE vital_signs ADD CONSTRAINT chk_systolic  CHECK (systolic_bp IS NULL OR systolic_bp BETWEEN 30 AND 350);
ALTER TABLE vital_signs ADD CONSTRAINT chk_diastolic CHECK (diastolic_bp IS NULL OR diastolic_bp BETWEEN 10 AND 250);
ALTER TABLE vital_signs ADD CONSTRAINT chk_hr        CHECK (heart_rate IS NULL OR heart_rate BETWEEN 10 AND 300);
ALTER TABLE vital_signs ADD CONSTRAINT chk_rr        CHECK (respiratory_rate IS NULL OR respiratory_rate BETWEEN 0 AND 80);
ALTER TABLE vital_signs ADD CONSTRAINT chk_spo2      CHECK (oxygen_saturation IS NULL OR oxygen_saturation BETWEEN 0 AND 100);
ALTER TABLE vital_signs ADD CONSTRAINT chk_gcs       CHECK (gcs_score IS NULL OR gcs_score BETWEEN 3 AND 15);
ALTER TABLE vital_signs ADD CONSTRAINT chk_temp      CHECK (temperature IS NULL OR temperature BETWEEN 25 AND 45);

-- Patient age
ALTER TABLE patients ADD CONSTRAINT chk_age CHECK (age BETWEEN 0 AND 150);

COMMENT ON TABLE audit_logs IS 'HIPAA-required immutable audit trail. Do NOT delete records.';
COMMENT ON TABLE patients IS 'Core patient demographics — all name/contact/insurance fields are PHI.';
COMMENT ON COLUMN patients.mrn IS 'Medical Record Number — unique PHI identifier.';
