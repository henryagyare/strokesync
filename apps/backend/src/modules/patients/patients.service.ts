import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PatientStatus, Gender } from '@strokesync/shared';

interface CreatePatientPayload {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
  phoneNumber?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  address?: string;
  insuranceProvider?: string;
  insurancePolicyNumber?: string;
  chiefComplaint?: string;
  symptomOnsetTime?: string;
  lastKnownWellTime?: string;
}

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePatientPayload) {
    const dob = new Date(data.dateOfBirth);
    const age = this.calculateAge(dob);
    const mrn = this.generateMRN();

    return this.prisma.patient.create({
      data: {
        mrn,
        firstName: data.firstName,
        lastName: data.lastName,
        dateOfBirth: dob,
        gender: data.gender,
        age,
        phoneNumber: data.phoneNumber,
        emergencyContactName: data.emergencyContactName,
        emergencyContactPhone: data.emergencyContactPhone,
        address: data.address,
        insuranceProvider: data.insuranceProvider,
        insurancePolicyNumber: data.insurancePolicyNumber,
        chiefComplaint: data.chiefComplaint,
        symptomOnsetTime: data.symptomOnsetTime ? new Date(data.symptomOnsetTime) : undefined,
        lastKnownWellTime: data.lastKnownWellTime ? new Date(data.lastKnownWellTime) : undefined,
      },
      include: {
        medicalHistory: true,
        medications: true,
        allergies: true,
      },
    });
  }

  async findAll(params?: { status?: PatientStatus; search?: string }) {
    return this.prisma.patient.findMany({
      where: {
        status: params?.status,
        ...(params?.search && {
          OR: [
            { firstName: { contains: params.search, mode: 'insensitive' as const } },
            { lastName: { contains: params.search, mode: 'insensitive' as const } },
            { mrn: { contains: params.search, mode: 'insensitive' as const } },
          ],
        }),
      },
      include: {
        encounters: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
        nihssAssessments: {
          orderBy: { assessedAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
  }

  async findById(id: string) {
    const patient = await this.prisma.patient.findUnique({
      where: { id },
      include: {
        medicalHistory: true,
        medications: { where: { isActive: true } },
        allergies: true,
        encounters: {
          orderBy: { createdAt: 'desc' },
          include: {
            technician: { select: { id: true, firstName: true, lastName: true } },
            neurologist: { select: { id: true, firstName: true, lastName: true } },
          },
        },
        vitalSigns: { orderBy: { recordedAt: 'desc' }, take: 10 },
        nihssAssessments: { orderBy: { assessedAt: 'desc' } },
        imagingStudies: { orderBy: { createdAt: 'desc' } },
        labResults: { orderBy: { createdAt: 'desc' }, include: { resultValues: true } },
      },
    });

    if (!patient) throw new NotFoundException('Patient not found');
    return patient;
  }

  async updateStatus(id: string, status: PatientStatus) {
    return this.prisma.patient.update({
      where: { id },
      data: { status },
    });
  }

  private calculateAge(dob: Date): number {
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
    return age;
  }

  private generateMRN(): string {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `SS-${ts}-${rand}`;
  }
}
