import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SocketGateway } from '../socket/socket.gateway';
import { calculateTPADose } from '../nihss/nihss.service';

@Injectable()
export class OrdersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly socket: SocketGateway,
  ) {}

  async create(data: {
    consultationId: string;
    encounterId: string;
    patientId: string;
    orderedById: string;
    orderType: string;
    priority?: string;
    orderDescription: string;
    medicationName?: string;
    dosage?: string;
    route?: string;
    frequency?: string;
    duration?: string;
    transferDestination?: string;
    transferUnit?: string;
    notes?: string;
  }) {
    const order = await this.prisma.treatmentOrder.create({
      data: {
        consultationId: data.consultationId,
        encounterId: data.encounterId,
        patientId: data.patientId,
        orderedById: data.orderedById,
        orderType: data.orderType as any,
        priority: (data.priority ?? 'ROUTINE') as any,
        orderDescription: data.orderDescription,
        medicationName: data.medicationName,
        dosage: data.dosage,
        route: data.route,
        frequency: data.frequency,
        duration: data.duration,
        transferDestination: data.transferDestination,
        transferUnit: data.transferUnit,
        notes: data.notes,
      },
      include: {
        orderedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Update patient status
    await this.prisma.patient.update({
      where: { id: data.patientId },
      data: { status: 'TREATMENT_ORDERED' },
    });

    await this.audit.log({
      userId: data.orderedById,
      action: 'CREATE',
      resource: 'TREATMENT_ORDER',
      resourceId: order.id,
      phiAccessed: true,
      description: `Order created: ${data.orderType} — ${data.orderDescription}`,
    });

    this.socket.emitToEncounter(data.encounterId, 'order:created', order);
    return order;
  }

  /** Shortcut: Create a tPA order with auto-calculated dosing */
  async createTPAOrder(data: {
    consultationId: string;
    encounterId: string;
    patientId: string;
    orderedById: string;
    weightKg: number;
    notes?: string;
  }) {
    const dose = calculateTPADose(data.weightKg);

    return this.create({
      consultationId: data.consultationId,
      encounterId: data.encounterId,
      patientId: data.patientId,
      orderedById: data.orderedById,
      orderType: 'MEDICATION',
      priority: 'EMERGENCY',
      orderDescription: `IV Alteplase (tPA) — ${dose.totalDoseMg}mg total`,
      medicationName: 'Alteplase (tPA)',
      dosage: `${dose.totalDoseMg}mg total: ${dose.bolusMg}mg bolus + ${dose.infusionMg}mg infusion`,
      route: 'IV',
      frequency: 'ONCE',
      notes: [
        dose.bolusInstruction,
        dose.infusionInstruction,
        'Monitor BP q15min during infusion. Goal BP <180/105.',
        'Hold all anticoagulants and antiplatelets x24h.',
        'Monitor for signs of hemorrhagic conversion.',
        ...(dose.warnings.length > 0 ? ['⚠️ WARNINGS: ' + dose.warnings.join('; ')] : []),
        data.notes,
      ].filter(Boolean).join('\n'),
    });
  }

  async updateStatus(id: string, data: { userId: string; status: string; executedById?: string; notes?: string }) {
    const order = await this.prisma.treatmentOrder.update({
      where: { id },
      data: {
        status: data.status as any,
        executedById: data.executedById,
        executedAt: data.status === 'COMPLETED' ? new Date() : undefined,
        notes: data.notes,
      },
    });

    await this.audit.log({ userId: data.userId, action: 'UPDATE', resource: 'TREATMENT_ORDER', resourceId: id, description: `Order ${data.status}` });
    this.socket.emitToEncounter(order.encounterId, 'order:updated', order);
    return order;
  }

  async findByEncounter(encounterId: string) {
    return this.prisma.treatmentOrder.findMany({
      where: { encounterId },
      include: { orderedBy: { select: { id: true, firstName: true, lastName: true } }, executedBy: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByConsultation(consultationId: string) {
    return this.prisma.treatmentOrder.findMany({
      where: { consultationId },
      include: { orderedBy: { select: { id: true, firstName: true, lastName: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const order = await this.prisma.treatmentOrder.findUnique({
      where: { id },
      include: { orderedBy: { select: { id: true, firstName: true, lastName: true } }, executedBy: { select: { id: true, firstName: true, lastName: true } }, consultation: true },
    });
    if (!order) throw new NotFoundException('Treatment order not found');
    return order;
  }
}
