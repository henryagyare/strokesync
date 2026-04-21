// ─── Alert Domain Types ────────────────────────────────────

export enum AlertType {
  CRITICAL_VITAL = 'CRITICAL_VITAL',
  CRITICAL_LAB = 'CRITICAL_LAB',
  CRITICAL_IMAGING = 'CRITICAL_IMAGING',
  NIHSS_CHANGE = 'NIHSS_CHANGE',
  CONSULTATION_REQUEST = 'CONSULTATION_REQUEST',
  ORDER_UPDATE = 'ORDER_UPDATE',
  PATIENT_STATUS_CHANGE = 'PATIENT_STATUS_CHANGE',
  SYSTEM = 'SYSTEM',
}

export enum AlertSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  CRITICAL = 'CRITICAL',
  EMERGENCY = 'EMERGENCY',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  EXPIRED = 'EXPIRED',
}

export interface Alert {
  id: string;
  encounterId?: string;
  patientId?: string;
  recipientId: string;
  senderId?: string;
  alertType: AlertType;
  severity: AlertSeverity;
  status: AlertStatus;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  acknowledgedAt?: Date;
  resolvedAt?: Date;
  expiresAt?: Date;
  createdAt: Date;
}

export interface CreateAlertDto {
  encounterId?: string;
  patientId?: string;
  recipientId: string;
  alertType: AlertType;
  severity: AlertSeverity;
  title: string;
  message: string;
  metadata?: Record<string, unknown>;
  expiresAt?: string;
}
