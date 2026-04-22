import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class ImagingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly socket: SocketGateway,
  ) {}

  async create(data: { encounterId: string; patientId: string; orderedById: string; imagingType: string; studyDescription?: string; notes?: string; details?: any }) {
    const study = await this.prisma.imagingStudy.create({ data: { ...data, imagingType: data.imagingType as any, details: data.details } as any });
    await this.audit.log({ userId: data.orderedById, action: 'CREATE', resource: 'IMAGING', resourceId: study.id, phiAccessed: true, description: `Imaging ordered: ${data.imagingType}` });
    this.socket.emitToEncounter(data.encounterId, 'imaging:ordered', study);
    return study;
  }

  async updateReport(id: string, data: { userId: string; status?: string; findings?: string; impression?: string; isCritical?: boolean; details?: any; interpretedById?: string }) {
    const study = await this.prisma.imagingStudy.update({
      where: { id },
      data: { status: data.status as any, findings: data.findings, impression: data.impression, isCritical: data.isCritical, details: data.details, interpretedById: data.interpretedById, reportedAt: new Date() },
    });
    await this.audit.log({ userId: data.userId, action: 'UPDATE', resource: 'IMAGING', resourceId: id, phiAccessed: true, description: `Imaging reported: ${study.imagingType} → ${data.status}` });
    this.socket.emitToEncounter(study.encounterId, 'imaging:reported', study);
    if (data.isCritical) this.socket.emitToEncounter(study.encounterId, 'imaging:critical', study);
    return study;
  }

  async findByEncounter(encounterId: string) {
    return this.prisma.imagingStudy.findMany({ where: { encounterId }, include: { orderedBy: { select: { id: true, firstName: true, lastName: true } }, interpretedBy: { select: { id: true, firstName: true, lastName: true } } }, orderBy: { createdAt: 'desc' } });
  }

  async findById(id: string) {
    const study = await this.prisma.imagingStudy.findUnique({ where: { id }, include: { orderedBy: { select: { id: true, firstName: true, lastName: true } }, interpretedBy: { select: { id: true, firstName: true, lastName: true } } } });
    if (!study) throw new NotFoundException('Imaging study not found');
    return study;
  }
}
