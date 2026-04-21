// ─── Consultation Domain Types ─────────────────────────────

export enum ConsultationStatus {
  REQUESTED = 'REQUESTED',
  ACCEPTED = 'ACCEPTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Consultation {
  id: string;
  encounterId: string;
  patientId: string;
  neurologistId: string;
  technicianId: string;
  status: ConsultationStatus;
  requestedAt: Date;
  acceptedAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  clinicalImpression?: string;
  recommendations?: string;
  diagnosis?: string;
  diagnosisCode?: string; // ICD-10
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateConsultationDto {
  encounterId: string;
  patientId: string;
  neurologistId?: string;
}

export interface UpdateConsultationDto {
  status?: ConsultationStatus;
  clinicalImpression?: string;
  recommendations?: string;
  diagnosis?: string;
  diagnosisCode?: string;
}

// ─── Treatment Orders ──────────────────────────────────────

export enum OrderType {
  MEDICATION = 'MEDICATION',
  PROCEDURE = 'PROCEDURE',
  IMAGING = 'IMAGING',
  LAB = 'LAB',
  CONSULT = 'CONSULT',
  TRANSFER = 'TRANSFER',
  OTHER = 'OTHER',
}

export enum OrderStatus {
  DRAFT = 'DRAFT',
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum OrderPriority {
  ROUTINE = 'ROUTINE',
  URGENT = 'URGENT',
  STAT = 'STAT',
  EMERGENCY = 'EMERGENCY',
}

export interface TreatmentOrder {
  id: string;
  consultationId: string;
  encounterId: string;
  patientId: string;
  orderedById: string;
  orderType: OrderType;
  status: OrderStatus;
  priority: OrderPriority;
  orderDescription: string;

  // Medication-specific
  medicationName?: string;
  dosage?: string;
  route?: string;
  frequency?: string;
  duration?: string;

  // Transfer-specific
  transferDestination?: string;
  transferUnit?: string;

  executedById?: string;
  executedAt?: Date;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTreatmentOrderDto {
  consultationId: string;
  encounterId: string;
  patientId: string;
  orderType: OrderType;
  priority?: OrderPriority;
  orderDescription: string;
  medicationName?: string;
  dosage?: string;
  route?: string;
  frequency?: string;
  duration?: string;
  transferDestination?: string;
  transferUnit?: string;
  notes?: string;
}

export interface UpdateTreatmentOrderDto {
  status?: OrderStatus;
  executedById?: string;
  executedAt?: string;
  notes?: string;
}

// ─── Messages ──────────────────────────────────────────────

export enum MessageType {
  TEXT = 'TEXT',
  AUDIO = 'AUDIO',
  IMAGE = 'IMAGE',
  SYSTEM = 'SYSTEM',
}

export interface Message {
  id: string;
  consultationId: string;
  senderId: string;
  messageType: MessageType;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
  isRead: boolean;
  readAt?: Date;
  createdAt: Date;
}

export interface CreateMessageDto {
  consultationId: string;
  messageType: MessageType;
  content: string;
  audioUrl?: string;
  imageUrl?: string;
}
