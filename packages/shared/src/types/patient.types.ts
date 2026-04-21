// ─── Patient Domain Types ──────────────────────────────────

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
  OTHER = 'OTHER',
  UNKNOWN = 'UNKNOWN',
}

export enum PatientStatus {
  INTAKE = 'INTAKE',
  IN_TRANSIT = 'IN_TRANSIT',
  CONSULTATION_PENDING = 'CONSULTATION_PENDING',
  CONSULTATION_ACTIVE = 'CONSULTATION_ACTIVE',
  TREATMENT_ORDERED = 'TREATMENT_ORDERED',
  TRANSFERRED = 'TRANSFERRED',
  DISCHARGED = 'DISCHARGED',
}

export interface Patient {
  id: string;
  mrn: string; // Medical Record Number
  firstName: string;
  lastName: string;
  dateOfBirth: Date;
  gender: Gender;
  age: number;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  status: PatientStatus;
  chiefComplaint?: string;
  symptomOnsetTime?: Date;
  lastKnownWellTime?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePatientDto {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  chiefComplaint?: string;
  symptomOnsetTime?: string;
  lastKnownWellTime?: string;
}

export interface UpdatePatientDto extends Partial<CreatePatientDto> {
  status?: PatientStatus;
}

export interface MedicalHistory {
  id: string;
  patientId: string;
  condition: string;
  diagnosedDate?: Date;
  status: 'ACTIVE' | 'RESOLVED' | 'CHRONIC';
  notes?: string;
  createdAt: Date;
}

export interface Medication {
  id: string;
  patientId: string;
  name: string;
  dosage: string;
  frequency: string;
  route: string;
  startDate?: Date;
  endDate?: Date;
  prescribedBy?: string;
  isActive: boolean;
  createdAt: Date;
}

export interface Allergy {
  id: string;
  patientId: string;
  allergen: string;
  reaction: string;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'LIFE_THREATENING';
  createdAt: Date;
}
