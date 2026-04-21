// ─── Audit Log Types (HIPAA Compliance) ────────────────────

export enum AuditAction {
  CREATE = 'CREATE',
  READ = 'READ',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LOGIN = 'LOGIN',
  LOGOUT = 'LOGOUT',
  LOGIN_FAILED = 'LOGIN_FAILED',
  EXPORT = 'EXPORT',
  PRINT = 'PRINT',
  ACCESS_DENIED = 'ACCESS_DENIED',
  PHI_ACCESS = 'PHI_ACCESS',
  PHI_MODIFY = 'PHI_MODIFY',
}

export enum AuditResource {
  USER = 'USER',
  PATIENT = 'PATIENT',
  ENCOUNTER = 'ENCOUNTER',
  VITAL_SIGN = 'VITAL_SIGN',
  LAB_RESULT = 'LAB_RESULT',
  IMAGING = 'IMAGING',
  NIHSS = 'NIHSS',
  CONSULTATION = 'CONSULTATION',
  TREATMENT_ORDER = 'TREATMENT_ORDER',
  MESSAGE = 'MESSAGE',
  ALERT = 'ALERT',
  AUTH = 'AUTH',
}

export interface AuditLog {
  id: string;
  userId?: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  phiAccessed: boolean;
  description?: string;
  createdAt: Date;
}

export interface CreateAuditLogDto {
  userId?: string;
  action: AuditAction;
  resource: AuditResource;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  oldValues?: Record<string, unknown>;
  newValues?: Record<string, unknown>;
  phiAccessed?: boolean;
  description?: string;
}
