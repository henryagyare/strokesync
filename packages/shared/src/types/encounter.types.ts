// ─── Encounter Domain Types ────────────────────────────────

export enum EncounterStatus {
  ACTIVE = 'ACTIVE',
  PENDING_REVIEW = 'PENDING_REVIEW',
  IN_REVIEW = 'IN_REVIEW',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum EncounterPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface Encounter {
  id: string;
  patientId: string;
  technicianId: string;
  neurologistId?: string;
  status: EncounterStatus;
  priority: EncounterPriority;
  msuUnitId?: string;
  msuLocation?: string;
  dispatchTime?: Date;
  arrivalTime?: Date;
  sceneDepartureTime?: Date;
  hospitalArrivalTime?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateEncounterDto {
  patientId: string;
  priority?: EncounterPriority;
  msuUnitId?: string;
  msuLocation?: string;
  notes?: string;
}

export interface UpdateEncounterDto {
  neurologistId?: string;
  status?: EncounterStatus;
  priority?: EncounterPriority;
  msuLocation?: string;
  dispatchTime?: string;
  arrivalTime?: string;
  sceneDepartureTime?: string;
  hospitalArrivalTime?: string;
  notes?: string;
}
