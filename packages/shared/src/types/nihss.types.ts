// ─── NIHSS (National Institutes of Health Stroke Scale) ───

export interface NIHSSAssessment {
  id: string;
  encounterId: string;
  patientId: string;
  assessedById: string;
  totalScore: number;

  // Individual NIHSS components (0-4 scale varies per item)
  levelOfConsciousness: number; // 1a: 0-3
  locQuestions: number;         // 1b: 0-2
  locCommands: number;          // 1c: 0-2
  bestGaze: number;             // 2: 0-2
  visualFields: number;         // 3: 0-3
  facialPalsy: number;          // 4: 0-3
  motorLeftArm: number;         // 5a: 0-4
  motorRightArm: number;        // 5b: 0-4
  motorLeftLeg: number;         // 6a: 0-4
  motorRightLeg: number;        // 6b: 0-4
  limbAtaxia: number;           // 7: 0-2
  sensory: number;              // 8: 0-2
  bestLanguage: number;         // 9: 0-3
  dysarthria: number;           // 10: 0-2
  extinctionInattention: number; // 11: 0-2

  assessedAt: Date;
  notes?: string;
  createdAt: Date;
}

export interface CreateNIHSSAssessmentDto {
  encounterId: string;
  patientId: string;
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
  notes?: string;
}

export const NIHSS_SEVERITY = {
  NONE: { min: 0, max: 0, label: 'No Stroke Symptoms' },
  MINOR: { min: 1, max: 4, label: 'Minor Stroke' },
  MODERATE: { min: 5, max: 15, label: 'Moderate Stroke' },
  MODERATE_SEVERE: { min: 16, max: 20, label: 'Moderate to Severe Stroke' },
  SEVERE: { min: 21, max: 42, label: 'Severe Stroke' },
} as const;

export type NIHSSSeverityLevel = keyof typeof NIHSS_SEVERITY;

export function getNIHSSSeverity(score: number): NIHSSSeverityLevel {
  if (score === 0) return 'NONE';
  if (score <= 4) return 'MINOR';
  if (score <= 15) return 'MODERATE';
  if (score <= 20) return 'MODERATE_SEVERE';
  return 'SEVERE';
}

export function calculateNIHSSTotal(assessment: CreateNIHSSAssessmentDto): number {
  return (
    assessment.levelOfConsciousness +
    assessment.locQuestions +
    assessment.locCommands +
    assessment.bestGaze +
    assessment.visualFields +
    assessment.facialPalsy +
    assessment.motorLeftArm +
    assessment.motorRightArm +
    assessment.motorLeftLeg +
    assessment.motorRightLeg +
    assessment.limbAtaxia +
    assessment.sensory +
    assessment.bestLanguage +
    assessment.dysarthria +
    assessment.extinctionInattention
  );
}
