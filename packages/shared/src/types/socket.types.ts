// ─── Socket.io Event Types ─────────────────────────────────

export enum SocketEvent {
  // Connection
  CONNECT = 'connect',
  DISCONNECT = 'disconnect',
  ERROR = 'error',
  AUTHENTICATE = 'authenticate',
  AUTHENTICATED = 'authenticated',

  // Patient Events
  PATIENT_CREATED = 'patient:created',
  PATIENT_UPDATED = 'patient:updated',
  PATIENT_STATUS_CHANGED = 'patient:status_changed',

  // Vitals Events
  VITALS_RECORDED = 'vitals:recorded',
  VITALS_CRITICAL = 'vitals:critical',

  // Encounter Events
  ENCOUNTER_CREATED = 'encounter:created',
  ENCOUNTER_UPDATED = 'encounter:updated',
  ENCOUNTER_ASSIGNED = 'encounter:assigned',

  // Consultation Events
  CONSULTATION_REQUESTED = 'consultation:requested',
  CONSULTATION_ACCEPTED = 'consultation:accepted',
  CONSULTATION_STARTED = 'consultation:started',
  CONSULTATION_COMPLETED = 'consultation:completed',

  // Order Events
  ORDER_CREATED = 'order:created',
  ORDER_UPDATED = 'order:updated',
  ORDER_COMPLETED = 'order:completed',

  // Messaging
  MESSAGE_SENT = 'message:sent',
  MESSAGE_READ = 'message:read',
  TYPING_START = 'typing:start',
  TYPING_STOP = 'typing:stop',

  // Alerts
  ALERT_CREATED = 'alert:created',
  ALERT_ACKNOWLEDGED = 'alert:acknowledged',
  ALERT_RESOLVED = 'alert:resolved',

  // Imaging
  IMAGING_COMPLETED = 'imaging:completed',
  IMAGING_CRITICAL = 'imaging:critical',

  // NIHSS
  NIHSS_RECORDED = 'nihss:recorded',
  NIHSS_CHANGED = 'nihss:changed',

  // Lab
  LAB_RESULT_READY = 'lab:result_ready',
  LAB_CRITICAL = 'lab:critical',

  // Room Management
  JOIN_ENCOUNTER = 'room:join_encounter',
  LEAVE_ENCOUNTER = 'room:leave_encounter',
  JOIN_USER_ROOM = 'room:join_user',
}

export interface SocketPayload<T = unknown> {
  event: SocketEvent;
  data: T;
  timestamp: string;
  userId?: string;
  encounterId?: string;
}
