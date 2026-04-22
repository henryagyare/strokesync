// ─── Lab Results Domain Types ──────────────────────────────

export enum LabTestType {
  CBC = 'CBC',
  BMP = 'BMP',
  CMP = 'CMP',
  COAGULATION = 'COAGULATION',
  TROPONIN = 'TROPONIN',
  LIPID_PANEL = 'LIPID_PANEL',
  BLOOD_GLUCOSE = 'BLOOD_GLUCOSE',
  OTHER = 'OTHER',
}

export enum LabResultStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

/**
 * Single component within a lab result's JSONB `results` field.
 * Example: { name: 'INR', value: '2.1', unit: '', range: '0.8-1.2', abnormal: true, critical: true }
 */
export interface LabResultComponent {
  name: string;
  value: string;
  unit: string;
  range: string;
  abnormal: boolean;
  critical: boolean;
}

/**
 * JSONB `results` field — structured array of lab components.
 * Stored as PostgreSQL JSONB, indexed with GIN.
 */
export interface LabResultsJson {
  components: LabResultComponent[];
  [key: string]: unknown;
}

export interface LabResult {
  id: string;
  encounterId: string;
  patientId: string;
  orderedById: string;
  testType: LabTestType;
  testName: string;
  status: LabResultStatus;
  specimenCollectedAt?: Date;
  resultedAt?: Date;
  isSimulated: boolean;
  notes?: string;

  // JSONB results (flexible)
  results?: LabResultsJson;

  // Relational result values (structured)
  resultValues?: LabResultValue[];

  createdAt: Date;
  updatedAt: Date;
}

export interface LabResultValue {
  id: string;
  labResultId: string;
  componentName: string;
  value: string;
  unit: string;
  referenceRange: string;
  isAbnormal: boolean;
  isCritical: boolean;
}

export interface CreateLabResultDto {
  encounterId: string;
  patientId: string;
  testType: LabTestType;
  testName: string;
  isSimulated?: boolean;
  notes?: string;
  results?: LabResultsJson;
}

export interface UpdateLabResultDto {
  status?: LabResultStatus;
  resultedAt?: string;
  notes?: string;
  results?: LabResultsJson;
  resultValues?: Omit<LabResultValue, 'id' | 'labResultId'>[];
}
