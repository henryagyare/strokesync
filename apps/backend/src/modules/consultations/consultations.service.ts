import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class ConsultationsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly socket: SocketGateway,
  ) {}

  async requestConsultation(data: {
    encounterId: string;
    patientId: string;
    technicianId: string;
    neurologistId: string;
  }) {
    const consultation = await this.prisma.consultation.create({
      data: {
        encounterId: data.encounterId,
        patientId: data.patientId,
        technicianId: data.technicianId,
        neurologistId: data.neurologistId,
        status: 'REQUESTED',
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, mrn: true, age: true, gender: true, chiefComplaint: true } },
        technician: { select: { id: true, firstName: true, lastName: true } },
        neurologist: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Update encounter status
    await this.prisma.encounter.update({
      where: { id: data.encounterId },
      data: { neurologistId: data.neurologistId, status: 'IN_REVIEW' },
    });

    await this.audit.log({
      userId: data.technicianId,
      action: 'CREATE',
      resource: 'CONSULTATION',
      resourceId: consultation.id,
      phiAccessed: true,
      description: 'Consultation requested',
    });

    // Notify neurologist
    this.socket.emitToUser(data.neurologistId, 'consultation:requested', consultation);
    this.socket.emitToEncounter(data.encounterId, 'consultation:status', { id: consultation.id, status: 'REQUESTED' });

    return consultation;
  }

  async accept(id: string, neurologistId: string) {
    const consultation = await this.prisma.consultation.update({
      where: { id },
      data: { status: 'ACCEPTED', acceptedAt: new Date() },
    });

    await this.audit.log({ userId: neurologistId, action: 'UPDATE', resource: 'CONSULTATION', resourceId: id, description: 'Consultation accepted' });
    this.socket.emitToEncounter(consultation.encounterId, 'consultation:status', { id, status: 'ACCEPTED' });
    return consultation;
  }

  async start(id: string, neurologistId: string) {
    const consultation = await this.prisma.consultation.update({
      where: { id },
      data: { status: 'IN_PROGRESS', startedAt: new Date() },
    });

    await this.audit.log({ userId: neurologistId, action: 'UPDATE', resource: 'CONSULTATION', resourceId: id, description: 'Consultation started' });
    this.socket.emitToEncounter(consultation.encounterId, 'consultation:status', { id, status: 'IN_PROGRESS' });
    return consultation;
  }

  async complete(id: string, data: {
    neurologistId: string;
    clinicalImpression?: string;
    recommendations?: string;
    diagnosis?: string;
    diagnosisCode?: string;
  }) {
    const consultation = await this.prisma.consultation.update({
      where: { id },
      data: {
        status: 'COMPLETED',
        completedAt: new Date(),
        clinicalImpression: data.clinicalImpression,
        recommendations: data.recommendations,
        diagnosis: data.diagnosis,
        diagnosisCode: data.diagnosisCode,
      },
    });

    await this.audit.log({ userId: data.neurologistId, action: 'UPDATE', resource: 'CONSULTATION', resourceId: id, phiAccessed: true, description: `Consultation completed: ${data.diagnosis}` });
    this.socket.emitToEncounter(consultation.encounterId, 'consultation:completed', consultation);
    return consultation;
  }

  async sendMessage(consultationId: string, data: { senderId: string; messageType?: string; content: string; audioUrl?: string; imageUrl?: string }) {
    const message = await this.prisma.message.create({
      data: {
        consultationId,
        senderId: data.senderId,
        messageType: (data.messageType ?? 'TEXT') as any,
        content: data.content,
        audioUrl: data.audioUrl,
        imageUrl: data.imageUrl,
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, role: true } },
      },
    });

    const consultation = await this.prisma.consultation.findUnique({ where: { id: consultationId } });
    if (consultation) {
      this.socket.emitToEncounter(consultation.encounterId, 'message:new', message);
    }

    await this.audit.log({ userId: data.senderId, action: 'CREATE', resource: 'MESSAGE', resourceId: message.id, phiAccessed: true, description: 'Message sent in consultation' });
    return message;
  }

  async getMessages(consultationId: string) {
    return this.prisma.message.findMany({
      where: { consultationId },
      include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } } },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findByEncounter(encounterId: string) {
    return this.prisma.consultation.findMany({
      where: { encounterId },
      include: {
        neurologist: { select: { id: true, firstName: true, lastName: true } },
        technician: { select: { id: true, firstName: true, lastName: true } },
        treatmentOrders: true,
        messages: { orderBy: { createdAt: 'asc' }, take: 5 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const consultation = await this.prisma.consultation.findUnique({
      where: { id },
      include: {
        patient: true,
        neurologist: { select: { id: true, firstName: true, lastName: true } },
        technician: { select: { id: true, firstName: true, lastName: true } },
        treatmentOrders: { orderBy: { createdAt: 'desc' } },
        messages: { include: { sender: { select: { id: true, firstName: true, lastName: true, role: true } } }, orderBy: { createdAt: 'asc' } },
      },
    });
    if (!consultation) throw new NotFoundException('Consultation not found');
    return consultation;
  }
}
