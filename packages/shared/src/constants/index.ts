// ─── StrokeSync Constants ──────────────────────────────────

export const APP_NAME = 'StrokeSync';
export const APP_VERSION = '1.0.0';

// ─── Time Windows (stroke treatment) ──────────────────────
export const STROKE_TIME_WINDOWS = {
  /** tPA eligibility window from symptom onset (4.5 hours) */
  TPA_WINDOW_MS: 4.5 * 60 * 60 * 1000,
  /** Thrombectomy window from symptom onset (24 hours) */
  THROMBECTOMY_WINDOW_MS: 24 * 60 * 60 * 1000,
  /** Door-to-needle target (60 minutes) */
  DOOR_TO_NEEDLE_TARGET_MS: 60 * 60 * 1000,
  /** Door-to-CT target (25 minutes) */
  DOOR_TO_CT_TARGET_MS: 25 * 60 * 1000,
} as const;

// ─── Vital Sign Ranges ────────────────────────────────────
export const VITAL_RANGES = {
  systolicBP: { low: 90, high: 180, criticalLow: 70, criticalHigh: 220, unit: 'mmHg' },
  diastolicBP: { low: 60, high: 110, criticalLow: 40, criticalHigh: 130, unit: 'mmHg' },
  heartRate: { low: 60, high: 100, criticalLow: 40, criticalHigh: 150, unit: 'bpm' },
  respiratoryRate: { low: 12, high: 20, criticalLow: 8, criticalHigh: 30, unit: '/min' },
  oxygenSaturation: { low: 95, high: 100, criticalLow: 88, criticalHigh: 100, unit: '%' },
  temperature: { low: 36.1, high: 37.2, criticalLow: 35.0, criticalHigh: 40.0, unit: '°C' },
  bloodGlucose: { low: 70, high: 140, criticalLow: 40, criticalHigh: 400, unit: 'mg/dL' },
} as const;

// ─── Pagination Defaults ──────────────────────────────────
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT: 100,
} as const;

// ─── API Routes ───────────────────────────────────────────
export const API_ROUTES = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    REFRESH: '/auth/refresh',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
  },
  USERS: '/users',
  PATIENTS: '/patients',
  ENCOUNTERS: '/encounters',
  VITALS: '/vitals',
  LABS: '/labs',
  IMAGING: '/imaging',
  NIHSS: '/nihss',
  CONSULTATIONS: '/consultations',
  ORDERS: '/orders',
  MESSAGES: '/messages',
  ALERTS: '/alerts',
  AUDIT: '/audit',
} as const;

// ─── HIPAA PHI Fields (for column-level protection) ──────
export const PHI_FIELDS = [
  'firstName',
  'lastName',
  'dateOfBirth',
  'phoneNumber',
  'address',
  'emergencyContactName',
  'emergencyContactPhone',
  'insuranceProvider',
  'insurancePolicyNumber',
  'mrn',
  'email',
] as const;

export type PHIField = (typeof PHI_FIELDS)[number];
