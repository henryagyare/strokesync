// ─── Vitals Domain Types ───────────────────────────────────

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
  supplementalO2?: boolean;
  o2FlowRate?: number;

  // Other
  temperature?: number;
  temperatureUnit?: 'C' | 'F';
  bloodGlucose?: number;
  gcsScore?: number;

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
  deviceSource?: string;
  notes?: string;
}
