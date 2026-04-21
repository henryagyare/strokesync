// ─── Imaging Domain Types ──────────────────────────────────

export enum ImagingType {
  CT_HEAD = 'CT_HEAD',
  CT_ANGIOGRAPHY = 'CT_ANGIOGRAPHY',
  CT_PERFUSION = 'CT_PERFUSION',
  MRI_BRAIN = 'MRI_BRAIN',
  MRA = 'MRA',
  X_RAY = 'X_RAY',
  OTHER = 'OTHER',
}

export enum ImagingStatus {
  ORDERED = 'ORDERED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  PRELIMINARY = 'PRELIMINARY',
  FINAL = 'FINAL',
  CANCELLED = 'CANCELLED',
}

export interface ImagingStudy {
  id: string;
  encounterId: string;
  patientId: string;
  orderedById: string;
  interpretedById?: string;
  imagingType: ImagingType;
  status: ImagingStatus;
  studyDescription?: string;
  findings?: string;
  impression?: string;
  imageUrls: string[];
  thumbnailUrl?: string;
  dicomStudyUid?: string;
  performedAt?: Date;
  reportedAt?: Date;
  isCritical: boolean;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateImagingStudyDto {
  encounterId: string;
  patientId: string;
  imagingType: ImagingType;
  studyDescription?: string;
  notes?: string;
}

export interface UpdateImagingStudyDto {
  interpretedById?: string;
  status?: ImagingStatus;
  findings?: string;
  impression?: string;
  imageUrls?: string[];
  thumbnailUrl?: string;
  dicomStudyUid?: string;
  performedAt?: string;
  reportedAt?: string;
  isCritical?: boolean;
  notes?: string;
}
