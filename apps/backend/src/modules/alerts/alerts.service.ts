import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class AlertsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly socket: SocketGateway,
  ) {}

  async create(data: {
    encounterId?: string;
    patientId?: string;
    recipientId: string;
    senderId?: string;
    alertType: string;
    severity: string;
    title: string;
    message: string;
    metadata?: any;
    expiresAt?: Date;
  }) {
    const alert = await this.prisma.alert.create({
      data: {
        encounterId: data.encounterId,
        patientId: data.patientId,
        recipientId: data.recipientId,
        senderId: data.senderId,
        alertType: data.alertType as any,
        severity: data.severity as any,
        title: data.title,
        message: data.message,
        metadata: data.metadata,
        expiresAt: data.expiresAt,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, mrn: true } },
      },
    });

    await this.audit.log({
      userId: data.senderId,
      action: 'CREATE',
      resource: 'ALERT',
      resourceId: alert.id,
      description: `Alert created: ${data.severity} — ${data.title}`,
    });

    // Push to recipient + encounter room
    this.socket.emitToUser(data.recipientId, 'alert:new', alert);
    if (data.encounterId) {
      this.socket.emitToEncounter(data.encounterId, 'alert:new', alert);
    }

    return alert;
  }

  async acknowledge(id: string, userId: string) {
    const alert = await this.prisma.alert.update({
      where: { id },
      data: { status: 'ACKNOWLEDGED', acknowledgedAt: new Date() },
    });
    await this.audit.log({ userId, action: 'UPDATE', resource: 'ALERT', resourceId: id, description: 'Alert acknowledged' });
    return alert;
  }

  async resolve(id: string, userId: string) {
    const alert = await this.prisma.alert.update({
      where: { id },
      data: { status: 'RESOLVED', resolvedAt: new Date() },
    });
    await this.audit.log({ userId, action: 'UPDATE', resource: 'ALERT', resourceId: id, description: 'Alert resolved' });
    return alert;
  }

  async findForUser(userId: string, status?: string) {
    return this.prisma.alert.findMany({
      where: { recipientId: userId, ...(status && { status: status as any }) },
      include: { patient: { select: { id: true, firstName: true, lastName: true, mrn: true } } },
      orderBy: { createdAt: 'desc' },
      take: 50,
    });
  }

  async findByEncounter(encounterId: string) {
    return this.prisma.alert.findMany({
      where: { encounterId },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * ═══════════════════════════════════════════════════════════════════════════
   * TRANSMIT & ALERT — One-tap endpoint for technicians
   *
   * This is the critical workflow: technician has collected patient data and
   * needs to simultaneously:
   *   1. Update patient status → CONSULTATION_PENDING
   *   2. Update encounter status → PENDING_REVIEW
   *   3. Auto-assign available neurologist (or specific one)
   *   4. Create a consultation request
   *   5. Fire EMERGENCY alert to the neurologist with full patient summary
   *   6. Push real-time WebSocket events to the neurologist
   *
   * Returns the created consultation + alert for confirmation.
   * ═══════════════════════════════════════════════════════════════════════════
   */
  async transmitAndAlert(data: {
    encounterId: string;
    patientId: string;
    technicianId: string;
    neurologistId?: string;
    urgencyMessage?: string;
  }) {
    // 1. Find encounter with all clinical data
    const encounter = await this.prisma.encounter.findUnique({
      where: { id: data.encounterId },
      include: {
        patient: { include: { medicalHistory: true, allergies: true, medications: { where: { isActive: true } } } },
        vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 1 },
        nihssAssessments: { orderBy: { assessedAt: 'desc' }, take: 1 },
        imagingStudies: { orderBy: { createdAt: 'desc' }, take: 1 },
        labResults: { include: { resultValues: true }, orderBy: { createdAt: 'desc' }, take: 3 },
      },
    });

    if (!encounter) throw new NotFoundException('Encounter not found');

    // 2. Find available neurologist (prefer specified, otherwise first available)
    let neurologistId = data.neurologistId;
    if (!neurologistId) {
      const availableNeuro = await this.prisma.user.findFirst({
        where: { role: 'NEUROLOGIST', status: 'ACTIVE' },
      });
      if (!availableNeuro) throw new NotFoundException('No neurologist available');
      neurologistId = availableNeuro.id;
    }

    // 3. Update patient and encounter status
    await this.prisma.$transaction([
      this.prisma.patient.update({
        where: { id: data.patientId },
        data: { status: 'CONSULTATION_PENDING' },
      }),
      this.prisma.encounter.update({
        where: { id: data.encounterId },
        data: { status: 'PENDING_REVIEW', neurologistId },
      }),
    ]);

    // 4. Create consultation request
    const consultation = await this.prisma.consultation.create({
      data: {
        encounterId: data.encounterId,
        patientId: data.patientId,
        technicianId: data.technicianId,
        neurologistId,
        status: 'REQUESTED',
      },
    });

    // 5. Build alert summary from clinical data
    const patient = encounter.patient;
    const vitals = encounter.vitalSigns[0];
    const nihss = encounter.nihssAssessments[0];
    const imaging = encounter.imagingStudies[0];

    const summary = [
      `${patient.firstName} ${patient.lastName}, ${patient.age}${patient.gender === 'MALE' ? 'M' : 'F'}`,
      `Chief Complaint: ${patient.chiefComplaint}`,
      vitals ? `Vitals: BP ${vitals.systolicBP}/${vitals.diastolicBP}, HR ${vitals.heartRate}, SpO2 ${vitals.oxygenSaturation}%, GCS ${vitals.gcsScore}` : null,
      nihss ? `NIHSS: ${nihss.totalScore}` : null,
      imaging ? `Imaging: ${imaging.imagingType} — ${imaging.impression || 'Pending'}` : null,
      patient.allergies.length > 0 ? `Allergies: ${patient.allergies.map((a) => a.allergen).join(', ')}` : null,
      data.urgencyMessage,
    ].filter(Boolean).join('\n');

    // 6. Fire alert
    const alert = await this.create({
      encounterId: data.encounterId,
      patientId: data.patientId,
      recipientId: neurologistId,
      senderId: data.technicianId,
      alertType: 'CONSULTATION_REQUEST',
      severity: nihss && nihss.totalScore >= 16 ? 'EMERGENCY' : nihss && nihss.totalScore >= 5 ? 'CRITICAL' : 'WARNING',
      title: `🚨 New Stroke Patient: ${patient.firstName} ${patient.lastName} — NIHSS ${nihss?.totalScore ?? 'N/A'}`,
      message: summary,
      metadata: {
        nihss: nihss?.totalScore,
        sbp: vitals?.systolicBP,
        dbp: vitals?.diastolicBP,
        gcs: vitals?.gcsScore,
        chiefComplaint: patient.chiefComplaint,
        consultationId: consultation.id,
      },
    });

    // 7. Audit
    await this.audit.log({
      userId: data.technicianId,
      action: 'CREATE',
      resource: 'CONSULTATION',
      resourceId: consultation.id,
      phiAccessed: true,
      description: `TRANSMIT & ALERT: Patient ${patient.mrn} transmitted to neurologist`,
    });

    return {
      success: true,
      consultation,
      alert,
      neurologistId,
      patientSummary: summary,
    };
  }
}
