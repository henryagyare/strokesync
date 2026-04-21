import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EncounterPriority, EncounterStatus } from '@strokesync/shared';

@Injectable()
export class EncountersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    patientId: string;
    technicianId: string;
    priority?: EncounterPriority;
    msuUnitId?: string;
    msuLocation?: string;
    notes?: string;
  }) {
    return this.prisma.encounter.create({
      data: {
        patientId: data.patientId,
        technicianId: data.technicianId,
        priority: data.priority || 'MEDIUM',
        msuUnitId: data.msuUnitId,
        msuLocation: data.msuLocation,
        notes: data.notes,
      },
      include: {
        patient: true,
        technician: { select: { id: true, firstName: true, lastName: true } },
      },
    });
  }

  async findAll(params?: { status?: EncounterStatus; technicianId?: string; neurologistId?: string }) {
    return this.prisma.encounter.findMany({
      where: {
        status: params?.status,
        technicianId: params?.technicianId,
        neurologistId: params?.neurologistId,
      },
      include: {
        patient: { select: { id: true, firstName: true, lastName: true, mrn: true, status: true, age: true, gender: true } },
        technician: { select: { id: true, firstName: true, lastName: true } },
        neurologist: { select: { id: true, firstName: true, lastName: true } },
        nihssAssessments: { orderBy: { assessedAt: 'desc' }, take: 1 },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findById(id: string) {
    const encounter = await this.prisma.encounter.findUnique({
      where: { id },
      include: {
        patient: { include: { medicalHistory: true, medications: true, allergies: true } },
        technician: { select: { id: true, firstName: true, lastName: true, role: true } },
        neurologist: { select: { id: true, firstName: true, lastName: true, role: true } },
        vitalSigns: { orderBy: { recordedAt: 'desc' } },
        labResults: { include: { resultValues: true }, orderBy: { createdAt: 'desc' } },
        imagingStudies: { orderBy: { createdAt: 'desc' } },
        nihssAssessments: { orderBy: { assessedAt: 'desc' } },
        consultations: { include: { treatmentOrders: true, messages: { orderBy: { createdAt: 'asc' } } } },
      },
    });

    if (!encounter) throw new NotFoundException('Encounter not found');
    return encounter;
  }

  async update(id: string, data: { status?: EncounterStatus; neurologistId?: string; priority?: EncounterPriority; notes?: string }) {
    return this.prisma.encounter.update({
      where: { id },
      data,
    });
  }

  async assignNeurologist(encounterId: string, neurologistId: string) {
    return this.prisma.encounter.update({
      where: { id: encounterId },
      data: { neurologistId, status: 'IN_REVIEW' },
    });
  }
}
