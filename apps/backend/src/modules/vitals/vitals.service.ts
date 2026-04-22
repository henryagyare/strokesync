import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class VitalsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly socket: SocketGateway,
  ) {}

  async create(data: {
    encounterId: string;
    patientId: string;
    recordedById: string;
    systolicBP?: number;
    diastolicBP?: number;
    heartRate?: number;
    heartRhythm?: string;
    respiratoryRate?: number;
    oxygenSaturation?: number;
    supplementalO2?: boolean;
    o2FlowRate?: number;
    temperature?: number;
    temperatureUnit?: string;
    bloodGlucose?: number;
    gcsScore?: number;
    details?: Record<string, unknown>;
    deviceSource?: string;
    notes?: string;
  }) {
    const vital = await this.prisma.vitalSign.create({
      data: {
        encounterId: data.encounterId,
        patientId: data.patientId,
        recordedById: data.recordedById,
        systolicBP: data.systolicBP,
        diastolicBP: data.diastolicBP,
        heartRate: data.heartRate,
        heartRhythm: data.heartRhythm,
        respiratoryRate: data.respiratoryRate,
        oxygenSaturation: data.oxygenSaturation,
        supplementalO2: data.supplementalO2 ?? false,
        o2FlowRate: data.o2FlowRate,
        temperature: data.temperature,
        temperatureUnit: data.temperatureUnit ?? 'C',
        bloodGlucose: data.bloodGlucose,
        gcsScore: data.gcsScore,
        details: data.details as any,
        deviceSource: data.deviceSource,
        notes: data.notes,
      },
      include: {
        recordedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Audit log
    await this.audit.log({
      userId: data.recordedById,
      action: 'CREATE',
      resource: 'VITAL_SIGN',
      resourceId: vital.id,
      phiAccessed: true,
      description: `Vitals recorded: BP ${data.systolicBP}/${data.diastolicBP}, HR ${data.heartRate}, SpO2 ${data.oxygenSaturation}`,
    });

    // Real-time push to encounter room
    this.socket.emitToEncounter(data.encounterId, 'vitals:new', vital);

    // Check for critical vitals → auto-alert
    const criticals = this.checkCriticalVitals(data);
    if (criticals.length > 0) {
      this.socket.emitToEncounter(data.encounterId, 'vitals:critical', {
        vitalId: vital.id,
        criticals,
      });
    }

    return vital;
  }

  async findByEncounter(encounterId: string) {
    return this.prisma.vitalSign.findMany({
      where: { encounterId },
      include: {
        recordedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { recordedAt: 'desc' },
    });
  }

  async findByPatient(patientId: string) {
    return this.prisma.vitalSign.findMany({
      where: { patientId },
      orderBy: { recordedAt: 'desc' },
      take: 50,
    });
  }

  async findById(id: string) {
    const vital = await this.prisma.vitalSign.findUnique({
      where: { id },
      include: {
        recordedBy: { select: { id: true, firstName: true, lastName: true } },
        encounter: { select: { id: true, status: true, patientId: true } },
      },
    });
    if (!vital) throw new NotFoundException('Vital sign record not found');
    return vital;
  }

  /** Check for out-of-range vitals that need immediate attention */
  private checkCriticalVitals(data: {
    systolicBP?: number;
    diastolicBP?: number;
    heartRate?: number;
    oxygenSaturation?: number;
    bloodGlucose?: number;
    gcsScore?: number;
  }): string[] {
    const criticals: string[] = [];

    if (data.systolicBP && data.systolicBP > 180) criticals.push(`SBP critically high: ${data.systolicBP}`);
    if (data.systolicBP && data.systolicBP < 90) criticals.push(`SBP critically low: ${data.systolicBP}`);
    if (data.diastolicBP && data.diastolicBP > 120) criticals.push(`DBP critically high: ${data.diastolicBP}`);
    if (data.heartRate && data.heartRate > 150) criticals.push(`HR critically high: ${data.heartRate}`);
    if (data.heartRate && data.heartRate < 40) criticals.push(`HR critically low: ${data.heartRate}`);
    if (data.oxygenSaturation && data.oxygenSaturation < 90) criticals.push(`SpO2 critically low: ${data.oxygenSaturation}%`);
    if (data.bloodGlucose && data.bloodGlucose < 60) criticals.push(`Glucose critically low: ${data.bloodGlucose}`);
    if (data.bloodGlucose && data.bloodGlucose > 400) criticals.push(`Glucose critically high: ${data.bloodGlucose}`);
    if (data.gcsScore && data.gcsScore <= 8) criticals.push(`GCS critically low: ${data.gcsScore}`);

    return criticals;
  }
}
