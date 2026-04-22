import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class LabsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly socket: SocketGateway,
  ) {}

  async create(data: {
    encounterId: string;
    patientId: string;
    orderedById: string;
    testType: string;
    testName: string;
    isSimulated?: boolean;
    notes?: string;
    results?: any;
  }) {
    const lab = await this.prisma.labResult.create({
      data: {
        encounterId: data.encounterId,
        patientId: data.patientId,
        orderedById: data.orderedById,
        testType: data.testType as any,
        testName: data.testName,
        isSimulated: data.isSimulated ?? false,
        notes: data.notes,
        results: data.results,
      },
    });

    await this.audit.log({
      userId: data.orderedById,
      action: 'CREATE',
      resource: 'LAB_RESULT',
      resourceId: lab.id,
      phiAccessed: true,
      description: `Lab ordered: ${data.testName} (${data.testType})`,
    });

    this.socket.emitToEncounter(data.encounterId, 'lab:ordered', lab);
    return lab;
  }

  async updateResults(id: string, data: {
    userId: string;
    status: string;
    results?: any;
    resultValues?: Array<{
      componentName: string;
      value: string;
      unit: string;
      referenceRange: string;
      isAbnormal: boolean;
      isCritical: boolean;
    }>;
    notes?: string;
  }) {
    const lab = await this.prisma.labResult.update({
      where: { id },
      data: {
        status: data.status as any,
        results: data.results,
        resultedAt: data.status === 'COMPLETED' ? new Date() : undefined,
        notes: data.notes,
        ...(data.resultValues && {
          resultValues: {
            createMany: { data: data.resultValues },
          },
        }),
      },
      include: { resultValues: true },
    });

    await this.audit.log({
      userId: data.userId,
      action: 'UPDATE',
      resource: 'LAB_RESULT',
      resourceId: id,
      phiAccessed: true,
      description: `Lab results updated: ${lab.testName} → ${data.status}`,
    });

    this.socket.emitToEncounter(lab.encounterId, 'lab:results', lab);

    // Check for critical values
    if (data.resultValues?.some((v) => v.isCritical)) {
      this.socket.emitToEncounter(lab.encounterId, 'lab:critical', {
        labId: id,
        criticalValues: data.resultValues.filter((v) => v.isCritical),
      });
    }

    return lab;
  }

  async findByEncounter(encounterId: string) {
    return this.prisma.labResult.findMany({
      where: { encounterId },
      include: {
        resultValues: true,
        orderedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const lab = await this.prisma.labResult.findUnique({
      where: { id },
      include: { resultValues: true, orderedBy: { select: { id: true, firstName: true, lastName: true } } },
    });
    if (!lab) throw new NotFoundException('Lab result not found');
    return lab;
  }
}
