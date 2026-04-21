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

export interface LabResult {
  id: string;
  encounterId: string;
  patientId: string;
  orderedById: string;
  testType: LabTestType;
  testName: string;
  status: LabResultStatus;
  results?: LabResultValue[];
  specimenCollectedAt?: Date;
  resultedAt?: Date;
  isSimulated: boolean;
  notes?: string;
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
}

export interface UpdateLabResultDto {
  status?: LabResultStatus;
  resultedAt?: string;
  notes?: string;
  results?: Omit<LabResultValue, 'id' | 'labResultId'>[];
}
