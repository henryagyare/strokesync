// ─── Vitals Domain Types ───────────────────────────────────

/**
 * JSONB `details` field — extensible vitals data that varies per assessment.
 * Stored as PostgreSQL JSONB, indexed with GIN.
 */
export interface VitalSignDetails {
  // Pupil assessment
  pupilLeft?: string;
  pupilRight?: string;

  // Pain & skin
  painScale?: number;
  skinColor?: string;
  diaphoresis?: boolean;
  capillaryRefill?: string;

  // Respiratory extras
  oxygenDevice?: string;

  // Neuro extras
  nausea?: boolean;
  vomiting?: boolean;
  headacheSeverity?: string;

  // Open-ended
  notes?: string;
  [key: string]: unknown;
}

export interface VitalSign {
  id: string;
  encounterId: string;
  patientId: string;
  recordedById: string;

  // Blood Pressure
  systolicBP?: number;
  diastolicBP?: number;

  // Heart
  heartRate?: number;
  heartRhythm?: string;

  // Respiratory
  respiratoryRate?: number;
  oxygenSaturation?: number;
  supplementalO2: boolean;
  o2FlowRate?: number;

  // Other
  temperature?: number;
  temperatureUnit: 'C' | 'F';
  bloodGlucose?: number;
  gcsScore?: number;

  // JSONB details
  details?: VitalSignDetails;

  // Metadata
  recordedAt: Date;
  deviceSource?: string;
  notes?: string;
  createdAt: Date;
}

export interface CreateVitalSignDto {
  encounterId: string;
  patientId: string;
  systolicBP?: number;
  diastolicBP?: number;
  heartRate?: number;
  heartRhythm?: string;
  respiratoryRate?: number;
  oxygenSaturation?: number;
  supplementalO2?: boolean;
  o2FlowRate?: number;
  temperature?: number;
  temperatureUnit?: 'C' | 'F';
  bloodGlucose?: number;
  gcsScore?: number;
  details?: VitalSignDetails;
  deviceSource?: string;
  notes?: string;
}
