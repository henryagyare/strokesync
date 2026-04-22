import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { SocketGateway } from '../socket/socket.gateway';

// ─── Pure Domain Logic ─────────────────────────────────────────────────────

/** NIHSS Severity Classification — zero dependencies */
export function classifyNIHSS(score: number): {
  level: 'NONE' | 'MINOR' | 'MODERATE' | 'MODERATE_SEVERE' | 'SEVERE';
  label: string;
  tpaConsideration: string;
} {
  if (score === 0) return { level: 'NONE', label: 'No Stroke Symptoms', tpaConsideration: 'Not indicated' };
  if (score <= 4) return { level: 'MINOR', label: 'Minor Stroke', tpaConsideration: 'Consider if disabling deficit' };
  if (score <= 15) return { level: 'MODERATE', label: 'Moderate Stroke', tpaConsideration: 'Strong candidate for tPA' };
  if (score <= 20) return { level: 'MODERATE_SEVERE', label: 'Moderate-Severe Stroke', tpaConsideration: 'tPA indicated if within window' };
  return { level: 'SEVERE', label: 'Severe Stroke', tpaConsideration: 'tPA indicated; consider thrombectomy' };
}

/** Calculate total NIHSS from individual component scores */
export function calculateNIHSSTotal(components: {
  levelOfConsciousness: number;
  locQuestions: number;
  locCommands: number;
  bestGaze: number;
  visualFields: number;
  facialPalsy: number;
  motorLeftArm: number;
  motorRightArm: number;
  motorLeftLeg: number;
  motorRightLeg: number;
  limbAtaxia: number;
  sensory: number;
  bestLanguage: number;
  dysarthria: number;
  extinctionInattention: number;
}): number {
  return Object.values(components).reduce((sum, v) => sum + v, 0);
}

/**
 * tPA Dose Calculator — Pure domain logic
 * Standard: Alteplase 0.9 mg/kg, max 90 mg
 * 10% bolus over 1 min, remainder over 60 min
 */
export function calculateTPADose(weightKg: number): {
  eligible: boolean;
  totalDoseMg: number;
  bolusMg: number;
  infusionMg: number;
  bolusInstruction: string;
  infusionInstruction: string;
  warnings: string[];
} {
  const warnings: string[] = [];

  if (weightKg < 30) {
    warnings.push('Patient weight <30kg — use with extreme caution');
  }
  if (weightKg > 150) {
    warnings.push('Patient weight >150kg — dose capped at 90mg');
  }

  const rawDose = weightKg * 0.9;
  const totalDoseMg = Math.min(rawDose, 90); // cap at 90mg
  const bolusMg = Math.round(totalDoseMg * 0.1 * 10) / 10; // 10% bolus, rounded to 0.1
  const infusionMg = Math.round((totalDoseMg - bolusMg) * 10) / 10;

  return {
    eligible: weightKg >= 30,
    totalDoseMg: Math.round(totalDoseMg * 10) / 10,
    bolusMg,
    infusionMg,
    bolusInstruction: `Administer ${bolusMg}mg IV bolus over 1 minute`,
    infusionInstruction: `Infuse ${infusionMg}mg IV over 60 minutes`,
    warnings,
  };
}

/** Check tPA eligibility based on time from onset */
export function checkTPAWindow(symptomOnsetTime: Date): {
  withinWindow: boolean;
  hoursFromOnset: number;
  windowRemaining: string;
  extendedWindow: boolean;
} {
  const now = new Date();
  const hoursFromOnset = (now.getTime() - symptomOnsetTime.getTime()) / (1000 * 60 * 60);
  const standardWindow = 4.5; // hours
  const withinWindow = hoursFromOnset <= standardWindow;
  const remainingHours = Math.max(0, standardWindow - hoursFromOnset);
  const remainingMins = Math.round(remainingHours * 60);

  return {
    withinWindow,
    hoursFromOnset: Math.round(hoursFromOnset * 100) / 100,
    windowRemaining: withinWindow ? `${Math.floor(remainingMins / 60)}h ${remainingMins % 60}m` : 'EXPIRED',
    extendedWindow: hoursFromOnset > 4.5 && hoursFromOnset <= 24, // for thrombectomy consideration
  };
}

// ─── NestJS Service ────────────────────────────────────────────────────────

@Injectable()
export class NihssService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly socket: SocketGateway,
  ) {}

  async create(data: {
    encounterId: string;
    patientId: string;
    assessedById: string;
    levelOfConsciousness: number;
    locQuestions: number;
    locCommands: number;
    bestGaze: number;
    visualFields: number;
    facialPalsy: number;
    motorLeftArm: number;
    motorRightArm: number;
    motorLeftLeg: number;
    motorRightLeg: number;
    limbAtaxia: number;
    sensory: number;
    bestLanguage: number;
    dysarthria: number;
    extinctionInattention: number;
    details?: Record<string, unknown>;
    notes?: string;
  }) {
    const totalScore = calculateNIHSSTotal(data);
    const severity = classifyNIHSS(totalScore);

    const assessment = await this.prisma.nIHSSAssessment.create({
      data: {
        ...data,
        totalScore,
        details: data.details as any,
      },
      include: {
        assessedBy: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    // Audit
    await this.audit.log({
      userId: data.assessedById,
      action: 'CREATE',
      resource: 'NIHSS',
      resourceId: assessment.id,
      phiAccessed: true,
      description: `NIHSS assessed: ${totalScore} (${severity.label})`,
    });

    // Real-time push
    this.socket.emitToEncounter(data.encounterId, 'nihss:new', {
      ...assessment,
      severity,
    });

    // Alert if score changed significantly
    const previous = await this.prisma.nIHSSAssessment.findFirst({
      where: { encounterId: data.encounterId, id: { not: assessment.id } },
      orderBy: { assessedAt: 'desc' },
    });

    if (previous && Math.abs(totalScore - previous.totalScore) >= 4) {
      this.socket.emitToEncounter(data.encounterId, 'nihss:significant_change', {
        previousScore: previous.totalScore,
        currentScore: totalScore,
        delta: totalScore - previous.totalScore,
        direction: totalScore > previous.totalScore ? 'WORSENING' : 'IMPROVING',
      });
    }

    return { ...assessment, severity };
  }

  async findByEncounter(encounterId: string) {
    const assessments = await this.prisma.nIHSSAssessment.findMany({
      where: { encounterId },
      include: {
        assessedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      orderBy: { assessedAt: 'desc' },
    });

    return assessments.map((a: any) => ({
      ...a,
      severity: classifyNIHSS(a.totalScore),
    }));
  }

  async findById(id: string) {
    const assessment = await this.prisma.nIHSSAssessment.findUnique({
      where: { id },
      include: {
        assessedBy: { select: { id: true, firstName: true, lastName: true } },
        patient: { select: { id: true, firstName: true, lastName: true } },
      },
    });
    if (!assessment) throw new NotFoundException('NIHSS assessment not found');
    return { ...assessment, severity: classifyNIHSS(assessment.totalScore) };
  }

  /** Pure domain: calculate tPA dosing */
  getTPADose(weightKg: number) {
    return calculateTPADose(weightKg);
  }

  /** Pure domain: check tPA window */
  getTPAWindow(symptomOnsetTime: Date) {
    return checkTPAWindow(symptomOnsetTime);
  }
}
