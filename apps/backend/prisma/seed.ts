// ═══════════════════════════════════════════════════════════════════════════════
// StrokeSync Database Seed — Production-Grade
// Pre-loads: 3 users + 4 sample patients with complete clinical data
// Run: npx prisma db seed
// ═══════════════════════════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ─── Helper: relative timestamps ───────────────────────────────────────────
function hoursAgo(h: number): Date {
  return new Date(Date.now() - h * 60 * 60 * 1000);
}
function minutesAgo(m: number): Date {
  return new Date(Date.now() - m * 60 * 1000);
}

async function main() {
  console.log('\n🌱 Seeding StrokeSync database...\n');

  // ═══════════════════════════════════════════════════════════════════════════
  // USERS
  // ═══════════════════════════════════════════════════════════════════════════
  const passwordHash = await bcrypt.hash('StrokeSync2024!', 12);

  const technician = await prisma.user.upsert({
    where: { email: 'tech@strokesync.com' },
    update: {},
    create: {
      email: 'tech@strokesync.com',
      passwordHash,
      firstName: 'Sarah',
      lastName: 'Mitchell',
      role: 'TECHNICIAN',
      phoneNumber: '+1-555-0101',
      licenseNumber: 'EMT-2024-001',
      status: 'ACTIVE',
    },
  });

  const neurologist = await prisma.user.upsert({
    where: { email: 'neuro@strokesync.com' },
    update: {},
    create: {
      email: 'neuro@strokesync.com',
      passwordHash,
      firstName: 'Dr. Michael',
      lastName: 'Chen',
      role: 'NEUROLOGIST',
      phoneNumber: '+1-555-0202',
      licenseNumber: 'MD-2024-001',
      specialization: 'Vascular Neurology',
      status: 'ACTIVE',
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: 'admin@strokesync.com' },
    update: {},
    create: {
      email: 'admin@strokesync.com',
      passwordHash,
      firstName: 'Admin',
      lastName: 'User',
      role: 'ADMIN',
      status: 'ACTIVE',
    },
  });

  console.log('✅ Users:', {
    technician: technician.email,
    neurologist: neurologist.email,
    admin: admin.email,
  });

  // ═══════════════════════════════════════════════════════════════════════════
  // PATIENT 1: John Doe — 65M — Large right MCA infarct
  // Status: CONSULTATION_ACTIVE → tPA in progress → ICU transfer pending
  // ═══════════════════════════════════════════════════════════════════════════
  const p1 = await prisma.patient.create({
    data: {
      mrn: 'SS-JD-65M-001',
      firstName: 'John',
      lastName: 'Doe',
      dateOfBirth: new Date('1961-03-15'),
      gender: 'MALE',
      age: 65,
      phoneNumber: '+1-555-1001',
      emergencyContactName: 'Jane Doe',
      emergencyContactPhone: '+1-555-1002',
      address: '123 Main St, Springfield, IL 62701',
      insuranceProvider: 'Blue Cross Blue Shield',
      insurancePolicyNumber: 'BCBS-2024-JD001',
      status: 'CONSULTATION_ACTIVE',
      chiefComplaint: 'Sudden onset left-sided weakness, facial droop, slurred speech',
      symptomOnsetTime: hoursAgo(2),
      lastKnownWellTime: hoursAgo(2.5),
      medicalHistory: {
        create: [
          { condition: 'Hypertension', status: 'CHRONIC', notes: 'Controlled with medication' },
          { condition: 'Type 2 Diabetes Mellitus', status: 'CHRONIC', notes: 'HbA1c 7.2%' },
          { condition: 'Atrial Fibrillation', status: 'ACTIVE', notes: 'On anticoagulation therapy' },
          { condition: 'Hyperlipidemia', status: 'CHRONIC', notes: 'Controlled with statins' },
        ],
      },
      medications: {
        create: [
          { name: 'Lisinopril', dosage: '20mg', frequency: 'Daily', route: 'PO', isActive: true },
          { name: 'Metformin', dosage: '1000mg', frequency: 'BID', route: 'PO', isActive: true },
          { name: 'Warfarin', dosage: '5mg', frequency: 'Daily', route: 'PO', isActive: true },
          { name: 'Atorvastatin', dosage: '40mg', frequency: 'Daily', route: 'PO', isActive: true },
        ],
      },
      allergies: {
        create: [
          { allergen: 'Penicillin', reaction: 'Hives, urticaria', severity: 'MODERATE' },
          { allergen: 'Sulfa drugs', reaction: 'Anaphylaxis', severity: 'LIFE_THREATENING' },
        ],
      },
    },
  });

  const enc1 = await prisma.encounter.create({
    data: {
      patientId: p1.id,
      technicianId: technician.id,
      neurologistId: neurologist.id,
      status: 'IN_REVIEW',
      priority: 'CRITICAL',
      msuUnitId: 'MSU-001',
      msuLocation: '39.7817,-89.6501',
      dispatchTime: hoursAgo(1.8),
      arrivalTime: hoursAgo(1.5),
    },
  });

  // Vitals set 1 (arrival)
  await prisma.vitalSign.create({
    data: {
      encounterId: enc1.id,
      patientId: p1.id,
      recordedById: technician.id,
      systolicBP: 178,
      diastolicBP: 95,
      heartRate: 88,
      heartRhythm: 'Irregularly irregular (A-fib)',
      respiratoryRate: 18,
      oxygenSaturation: 96,
      temperature: 37.1,
      temperatureUnit: 'C',
      bloodGlucose: 165,
      gcsScore: 13,
      recordedAt: hoursAgo(1.5),
      details: {
        pupilLeft: '3mm reactive',
        pupilRight: '3mm reactive',
        painScale: 2,
        skinColor: 'Pale',
        diaphoresis: false,
        capillaryRefill: '< 2 sec',
      },
    },
  });

  // Vitals set 2 (30 min later)
  await prisma.vitalSign.create({
    data: {
      encounterId: enc1.id,
      patientId: p1.id,
      recordedById: technician.id,
      systolicBP: 172,
      diastolicBP: 92,
      heartRate: 84,
      heartRhythm: 'Irregularly irregular (A-fib)',
      respiratoryRate: 17,
      oxygenSaturation: 97,
      temperature: 37.0,
      temperatureUnit: 'C',
      bloodGlucose: 158,
      gcsScore: 13,
      recordedAt: hoursAgo(1),
      details: {
        pupilLeft: '3mm reactive',
        pupilRight: '3mm reactive',
        painScale: 1,
        notes: 'Stable from initial assessment',
      },
    },
  });

  // Labs — Coagulation panel (critical for tPA decision)
  await prisma.labResult.create({
    data: {
      encounterId: enc1.id,
      patientId: p1.id,
      orderedById: technician.id,
      testType: 'COAGULATION',
      testName: 'Coagulation Panel',
      status: 'COMPLETED',
      specimenCollectedAt: hoursAgo(1.4),
      resultedAt: hoursAgo(1.2),
      results: {
        components: [
          { name: 'INR', value: '2.1', unit: '', range: '0.8-1.2', abnormal: true, critical: true },
          { name: 'PT', value: '24.5', unit: 'sec', range: '11-13.5', abnormal: true, critical: false },
          { name: 'aPTT', value: '35.2', unit: 'sec', range: '25-35', abnormal: true, critical: false },
          { name: 'Platelet Count', value: '189', unit: 'K/μL', range: '150-400', abnormal: false, critical: false },
        ],
      },
      resultValues: {
        create: [
          { componentName: 'INR', value: '2.1', unit: '', referenceRange: '0.8-1.2', isAbnormal: true, isCritical: true },
          { componentName: 'PT', value: '24.5', unit: 'sec', referenceRange: '11-13.5', isAbnormal: true, isCritical: false },
          { componentName: 'aPTT', value: '35.2', unit: 'sec', referenceRange: '25-35', isAbnormal: true, isCritical: false },
          { componentName: 'Platelet Count', value: '189', unit: 'K/μL', referenceRange: '150-400', isAbnormal: false, isCritical: false },
        ],
      },
      notes: 'Patient on Warfarin. INR elevated at 2.1 — tPA relative contraindication if >1.7. Needs reversal.',
    },
  });

  // Labs — BMP
  await prisma.labResult.create({
    data: {
      encounterId: enc1.id,
      patientId: p1.id,
      orderedById: technician.id,
      testType: 'BMP',
      testName: 'Basic Metabolic Panel',
      status: 'COMPLETED',
      specimenCollectedAt: hoursAgo(1.4),
      resultedAt: hoursAgo(1.1),
      results: {
        components: [
          { name: 'Glucose', value: '165', unit: 'mg/dL', range: '70-100', abnormal: true, critical: false },
          { name: 'Sodium', value: '141', unit: 'mEq/L', range: '136-145', abnormal: false, critical: false },
          { name: 'Potassium', value: '4.2', unit: 'mEq/L', range: '3.5-5.0', abnormal: false, critical: false },
          { name: 'Creatinine', value: '1.1', unit: 'mg/dL', range: '0.7-1.3', abnormal: false, critical: false },
          { name: 'BUN', value: '18', unit: 'mg/dL', range: '7-20', abnormal: false, critical: false },
        ],
      },
      resultValues: {
        create: [
          { componentName: 'Glucose', value: '165', unit: 'mg/dL', referenceRange: '70-100', isAbnormal: true, isCritical: false },
          { componentName: 'Sodium', value: '141', unit: 'mEq/L', referenceRange: '136-145', isAbnormal: false, isCritical: false },
          { componentName: 'Potassium', value: '4.2', unit: 'mEq/L', referenceRange: '3.5-5.0', isAbnormal: false, isCritical: false },
          { componentName: 'Creatinine', value: '1.1', unit: 'mg/dL', referenceRange: '0.7-1.3', isAbnormal: false, isCritical: false },
          { componentName: 'BUN', value: '18', unit: 'mg/dL', referenceRange: '7-20', isAbnormal: false, isCritical: false },
        ],
      },
    },
  });

  // Imaging — CT Head
  await prisma.imagingStudy.create({
    data: {
      encounterId: enc1.id,
      patientId: p1.id,
      orderedById: technician.id,
      interpretedById: neurologist.id,
      imagingType: 'CT_HEAD',
      status: 'FINAL',
      studyDescription: 'Non-contrast CT Head — Stroke Protocol',
      findings: 'Hyperdense right MCA sign. Early ischemic changes in the right MCA territory including right insular ribbon sign, loss of gray-white matter differentiation in the right frontal and temporal lobes, and sulcal effacement.',
      impression: 'Acute large right MCA territory infarct with early ischemic changes. ASPECTS score: 6. No intracranial hemorrhage. No midline shift. Recommend CTA for vessel occlusion confirmation.',
      performedAt: hoursAgo(1.2),
      reportedAt: hoursAgo(1),
      isCritical: true,
      details: {
        aspectsScore: 6,
        hemorrhage: false,
        midlineShift: false,
        midlineShiftMm: 0,
        vesselOcclusion: 'Right M1 segment hyperdense vessel sign',
        edema: 'Mild sulcal effacement',
        priorInfarcts: false,
        contrastUsed: false,
        sliceThickness: '5mm',
        radiationDose: '1.8 mSv',
      },
    },
  });

  // NIHSS Assessment
  await prisma.nIHSSAssessment.create({
    data: {
      encounterId: enc1.id,
      patientId: p1.id,
      assessedById: technician.id,
      totalScore: 18,
      levelOfConsciousness: 1,
      locQuestions: 1,
      locCommands: 1,
      bestGaze: 1,
      visualFields: 2,
      facialPalsy: 2,
      motorLeftArm: 3,
      motorRightArm: 0,
      motorLeftLeg: 3,
      motorRightLeg: 0,
      limbAtaxia: 0,
      sensory: 1,
      bestLanguage: 1,
      dysarthria: 2,
      extinctionInattention: 0,
      assessedAt: hoursAgo(1.4),
      notes: 'Large right MCA territory infarct. Left hemiparesis (arm > leg), left facial droop, dysarthria, left-sided neglect.',
      details: {
        laterality: 'Left-sided deficits → Right hemisphere',
        dominantHand: 'Right',
        eyeDeviation: 'Slight right gaze preference',
        tongueDeviation: 'Left',
        pronatorDrift: 'Left arm drifts within 5 seconds',
        neglect: 'Left visual and tactile extinction',
      },
    },
  });

  // Consultation
  const consult1 = await prisma.consultation.create({
    data: {
      encounterId: enc1.id,
      patientId: p1.id,
      neurologistId: neurologist.id,
      technicianId: technician.id,
      status: 'IN_PROGRESS',
      requestedAt: hoursAgo(1.3),
      acceptedAt: hoursAgo(1.25),
      startedAt: hoursAgo(1.2),
      clinicalImpression: 'Acute ischemic stroke, large vessel occlusion right MCA territory. NIHSS 18, ASPECTS 6. Patient within tPA window (2h from onset). INR 2.1 on Warfarin — relative contraindication but benefit likely outweighs risk given severity.',
      recommendations: '1. Administer IV tPA at 0.9mg/kg. 2. Hold Warfarin. 3. Monitor for hemorrhagic conversion. 4. Transfer to Neuro ICU. 5. Consider endovascular thrombectomy if no improvement post-tPA.',
      diagnosis: 'Acute ischemic stroke — Large right MCA territory infarct',
      diagnosisCode: 'I63.311',
    },
  });

  // Treatment Orders
  await prisma.treatmentOrder.createMany({
    data: [
      {
        consultationId: consult1.id,
        encounterId: enc1.id,
        patientId: p1.id,
        orderedById: neurologist.id,
        orderType: 'MEDICATION',
        status: 'IN_PROGRESS',
        priority: 'EMERGENCY',
        orderDescription: 'IV Alteplase (tPA) — Standard dose protocol',
        medicationName: 'Alteplase (tPA)',
        dosage: '0.9 mg/kg IV (max 90mg): 10% bolus over 1 min, remainder infused over 60 min',
        route: 'IV',
        frequency: 'ONCE',
        notes: 'Within 4.5h window. Hold warfarin. Monitor BP q15min during infusion. Goal BP <180/105. Monitor for signs of hemorrhagic conversion: headache, nausea, neurological worsening.',
      },
      {
        consultationId: consult1.id,
        encounterId: enc1.id,
        patientId: p1.id,
        orderedById: neurologist.id,
        orderType: 'TRANSFER',
        status: 'PENDING',
        priority: 'EMERGENCY',
        orderDescription: 'Transfer to Neuro ICU — University Hospital',
        transferDestination: 'University Hospital',
        transferUnit: 'Neuro ICU',
        notes: 'Continuous cardiac monitoring, neuro checks q15min x 24h, BP goal <180/105. ICU bed reserved. ETA 15 minutes.',
      },
    ],
  });

  // Messages in consultation
  await prisma.message.createMany({
    data: [
      {
        consultationId: consult1.id,
        senderId: technician.id,
        messageType: 'TEXT',
        content: 'Dr. Chen, 65M John Doe — sudden onset left-sided weakness, facial droop, slurred speech. NIHSS 18. CT shows hyperdense right MCA sign, ASPECTS 6. INR 2.1 on Warfarin. Within tPA window.',
        createdAt: hoursAgo(1.3),
      },
      {
        consultationId: consult1.id,
        senderId: neurologist.id,
        messageType: 'TEXT',
        content: 'Received. Reviewing CT now. INR 2.1 is concerning but NIHSS 18 with ASPECTS 6 — benefits of tPA likely outweigh risks. Prepare tPA at 0.9mg/kg. What\'s his weight?',
        createdAt: hoursAgo(1.25),
      },
      {
        consultationId: consult1.id,
        senderId: technician.id,
        messageType: 'TEXT',
        content: 'Weight is 82kg. tPA dose: 73.8mg total. 7.4mg bolus, 66.4mg infusion over 60 min. Ready to administer.',
        createdAt: hoursAgo(1.2),
      },
      {
        consultationId: consult1.id,
        senderId: neurologist.id,
        messageType: 'TEXT',
        content: 'Confirmed. Begin tPA infusion now. Hold all anticoagulants. BP management: Labetalol 10mg IV PRN if SBP >180 or DBP >105. I\'ve ordered Neuro ICU transfer — ETA 15 min.',
        createdAt: hoursAgo(1.15),
      },
    ],
  });

  // Alert
  await prisma.alert.create({
    data: {
      encounterId: enc1.id,
      patientId: p1.id,
      recipientId: neurologist.id,
      senderId: technician.id,
      alertType: 'CRITICAL_VITAL',
      severity: 'CRITICAL',
      status: 'ACKNOWLEDGED',
      title: 'Critical: Elevated BP in Stroke Patient',
      message: 'John Doe (65M) — SBP 178/95 with active A-fib. NIHSS 18. CT confirms Large right MCA infarct.',
      acknowledgedAt: hoursAgo(1.25),
      metadata: { nihss: 18, sbp: 178, dbp: 95, hrRhythm: 'A-fib' },
    },
  });

  console.log('✅ Patient 1: John Doe — 65M, NIHSS 18, right MCA infarct → tPA + ICU');

  // ═══════════════════════════════════════════════════════════════════════════
  // PATIENT 2: Jane Smith — 50F — Small left PCA infarct
  // Status: TREATMENT_ORDERED → tPA + speech therapy
  // ═══════════════════════════════════════════════════════════════════════════
  const p2 = await prisma.patient.create({
    data: {
      mrn: 'SS-JS-50F-002',
      firstName: 'Jane',
      lastName: 'Smith',
      dateOfBirth: new Date('1976-07-22'),
      gender: 'FEMALE',
      age: 50,
      phoneNumber: '+1-555-2001',
      emergencyContactName: 'Robert Smith',
      emergencyContactPhone: '+1-555-2002',
      address: '456 Oak Ave, Springfield, IL 62702',
      insuranceProvider: 'Aetna',
      insurancePolicyNumber: 'AET-2024-JS002',
      status: 'TREATMENT_ORDERED',
      chiefComplaint: 'Sudden visual field loss, word-finding difficulty',
      symptomOnsetTime: hoursAgo(3),
      lastKnownWellTime: hoursAgo(3.5),
      medicalHistory: {
        create: [
          { condition: 'Migraine with aura', status: 'CHRONIC', notes: 'Frequency: 2-3/month' },
          { condition: 'Oral contraceptive use', status: 'ACTIVE', notes: '10+ years' },
          { condition: 'Patent Foramen Ovale (PFO)', status: 'ACTIVE', notes: 'Diagnosed incidentally 2020 via echo' },
        ],
      },
      medications: {
        create: [
          { name: 'Sumatriptan', dosage: '100mg', frequency: 'PRN', route: 'PO', isActive: true },
          { name: 'Oral Contraceptive (Yaz)', dosage: '1 tab', frequency: 'Daily', route: 'PO', isActive: true },
        ],
      },
      allergies: {
        create: [
          { allergen: 'Aspirin', reaction: 'GI bleeding', severity: 'SEVERE' },
        ],
      },
    },
  });

  const enc2 = await prisma.encounter.create({
    data: {
      patientId: p2.id,
      technicianId: technician.id,
      neurologistId: neurologist.id,
      status: 'IN_REVIEW',
      priority: 'HIGH',
      msuUnitId: 'MSU-002',
      msuLocation: '39.7900,-89.6440',
      dispatchTime: hoursAgo(2.8),
      arrivalTime: hoursAgo(2.5),
    },
  });

  await prisma.vitalSign.create({
    data: {
      encounterId: enc2.id,
      patientId: p2.id,
      recordedById: technician.id,
      systolicBP: 148,
      diastolicBP: 82,
      heartRate: 76,
      heartRhythm: 'Regular sinus rhythm',
      respiratoryRate: 16,
      oxygenSaturation: 98,
      temperature: 36.8,
      temperatureUnit: 'C',
      bloodGlucose: 95,
      gcsScore: 15,
      recordedAt: hoursAgo(2.5),
      details: {
        pupilLeft: '4mm reactive',
        pupilRight: '4mm reactive',
        painScale: 3,
        skinColor: 'Normal',
      },
    },
  });

  await prisma.labResult.create({
    data: {
      encounterId: enc2.id,
      patientId: p2.id,
      orderedById: technician.id,
      testType: 'COAGULATION',
      testName: 'Coagulation Panel',
      status: 'COMPLETED',
      specimenCollectedAt: hoursAgo(2.4),
      resultedAt: hoursAgo(2.2),
      results: {
        components: [
          { name: 'INR', value: '1.0', unit: '', range: '0.8-1.2', abnormal: false, critical: false },
          { name: 'PT', value: '12.1', unit: 'sec', range: '11-13.5', abnormal: false, critical: false },
          { name: 'Platelet Count', value: '245', unit: 'K/μL', range: '150-400', abnormal: false, critical: false },
        ],
      },
      resultValues: {
        create: [
          { componentName: 'INR', value: '1.0', unit: '', referenceRange: '0.8-1.2', isAbnormal: false, isCritical: false },
          { componentName: 'PT', value: '12.1', unit: 'sec', referenceRange: '11-13.5', isAbnormal: false, isCritical: false },
          { componentName: 'Platelet Count', value: '245', unit: 'K/μL', referenceRange: '150-400', isAbnormal: false, isCritical: false },
        ],
      },
    },
  });

  await prisma.imagingStudy.create({
    data: {
      encounterId: enc2.id,
      patientId: p2.id,
      orderedById: technician.id,
      interpretedById: neurologist.id,
      imagingType: 'CT_HEAD',
      status: 'FINAL',
      studyDescription: 'Non-contrast CT Head — Stroke Protocol',
      findings: 'Subtle hypodensity in the left occipital lobe. No hemorrhage.',
      impression: 'Small left PCA territory infarct. ASPECTS not applicable (posterior circulation). No hemorrhage. Recommend MRI for definitive characterization.',
      performedAt: hoursAgo(2.2),
      reportedAt: hoursAgo(2),
      isCritical: false,
      details: {
        hemorrhage: false,
        midlineShift: false,
        territory: 'Left PCA',
        contrastUsed: false,
        posteriorCirculation: true,
      },
    },
  });

  await prisma.nIHSSAssessment.create({
    data: {
      encounterId: enc2.id,
      patientId: p2.id,
      assessedById: technician.id,
      totalScore: 6,
      levelOfConsciousness: 0,
      locQuestions: 0,
      locCommands: 0,
      bestGaze: 0,
      visualFields: 2,
      facialPalsy: 0,
      motorLeftArm: 0,
      motorRightArm: 0,
      motorLeftLeg: 0,
      motorRightLeg: 0,
      limbAtaxia: 0,
      sensory: 1,
      bestLanguage: 2,
      dysarthria: 1,
      extinctionInattention: 0,
      assessedAt: hoursAgo(2.4),
      notes: 'Small left PCA territory infarct. Right homonymous hemianopia, anomic aphasia.',
      details: {
        laterality: 'Right visual field cut → Left PCA',
        dominantHand: 'Right',
        languageDeficit: 'Anomic aphasia — naming difficulty',
        readingDifficulty: true,
      },
    },
  });

  const consult2 = await prisma.consultation.create({
    data: {
      encounterId: enc2.id,
      patientId: p2.id,
      neurologistId: neurologist.id,
      technicianId: technician.id,
      status: 'COMPLETED',
      requestedAt: hoursAgo(2.3),
      acceptedAt: hoursAgo(2.25),
      startedAt: hoursAgo(2.2),
      completedAt: hoursAgo(1.5),
      clinicalImpression: 'Small left PCA territory infarct. 50F with PFO and OCP use — likely paradoxical embolism. Within tPA window. Normal coagulation.',
      recommendations: '1. Administer IV tPA (within window, no contraindications). 2. Discontinue oral contraceptives. 3. Speech therapy consult for aphasia. 4. Cardiology consult for PFO closure evaluation.',
      diagnosis: 'Acute ischemic stroke — Small left PCA territory infarct, likely paradoxical embolism',
      diagnosisCode: 'I63.512',
    },
  });

  await prisma.treatmentOrder.createMany({
    data: [
      {
        consultationId: consult2.id,
        encounterId: enc2.id,
        patientId: p2.id,
        orderedById: neurologist.id,
        orderType: 'MEDICATION',
        status: 'COMPLETED',
        priority: 'STAT',
        orderDescription: 'IV Alteplase (tPA) — Standard dose',
        medicationName: 'Alteplase (tPA)',
        dosage: '0.9 mg/kg IV',
        route: 'IV',
        frequency: 'ONCE',
        notes: 'Administered successfully. No complications during infusion.',
      },
      {
        consultationId: consult2.id,
        encounterId: enc2.id,
        patientId: p2.id,
        orderedById: neurologist.id,
        orderType: 'CONSULT',
        status: 'PENDING',
        priority: 'URGENT',
        orderDescription: 'Speech therapy consultation for anomic aphasia',
        notes: 'Evaluate for speech/language deficits. Begin therapy when stable.',
      },
    ],
  });

  console.log('✅ Patient 2: Jane Smith — 50F, NIHSS 6, left PCA infarct → tPA + speech therapy');

  // ═══════════════════════════════════════════════════════════════════════════
  // PATIENT 3: Bob Johnson — 70M — Large left MCA infarct
  // Status: CONSULTATION_PENDING → awaiting neurologist review
  // ═══════════════════════════════════════════════════════════════════════════
  const p3 = await prisma.patient.create({
    data: {
      mrn: 'SS-BJ-70M-003',
      firstName: 'Bob',
      lastName: 'Johnson',
      dateOfBirth: new Date('1956-11-08'),
      gender: 'MALE',
      age: 70,
      phoneNumber: '+1-555-3001',
      emergencyContactName: 'Linda Johnson',
      emergencyContactPhone: '+1-555-3002',
      address: '789 Elm Dr, Springfield, IL 62703',
      insuranceProvider: 'Medicare',
      insurancePolicyNumber: 'MCR-2024-BJ003',
      status: 'CONSULTATION_PENDING',
      chiefComplaint: 'Sudden right-sided weakness, unable to speak. Wife reports patient grabbed head and fell.',
      symptomOnsetTime: hoursAgo(1),
      lastKnownWellTime: hoursAgo(1.25),
      medicalHistory: {
        create: [
          { condition: 'Hypertension', status: 'CHRONIC', notes: 'Poorly controlled despite 2 medications' },
          { condition: 'Previous TIA (2022)', status: 'RESOLVED', notes: 'Left hemispheric, resolved in 30 min' },
          { condition: 'Carotid stenosis (left 70%)', status: 'ACTIVE', notes: 'Declined endarterectomy' },
          { condition: 'COPD', status: 'CHRONIC', notes: 'GOLD Stage II' },
          { condition: 'Former smoker (40 pack-years)', status: 'RESOLVED', notes: 'Quit 2020' },
        ],
      },
      medications: {
        create: [
          { name: 'Amlodipine', dosage: '10mg', frequency: 'Daily', route: 'PO', isActive: true },
          { name: 'Aspirin', dosage: '325mg', frequency: 'Daily', route: 'PO', isActive: true },
          { name: 'Clopidogrel', dosage: '75mg', frequency: 'Daily', route: 'PO', isActive: true },
          { name: 'Tiotropium inhaler', dosage: '18mcg', frequency: 'Daily', route: 'INH', isActive: true },
        ],
      },
      allergies: {
        create: [
          { allergen: 'Iodine contrast', reaction: 'Hives, throat swelling', severity: 'SEVERE' },
        ],
      },
    },
  });

  const enc3 = await prisma.encounter.create({
    data: {
      patientId: p3.id,
      technicianId: technician.id,
      status: 'PENDING_REVIEW',
      priority: 'CRITICAL',
      msuUnitId: 'MSU-001',
      msuLocation: '39.7750,-89.6550',
      dispatchTime: minutesAgo(50),
      arrivalTime: minutesAgo(40),
    },
  });

  await prisma.vitalSign.create({
    data: {
      encounterId: enc3.id,
      patientId: p3.id,
      recordedById: technician.id,
      systolicBP: 195,
      diastolicBP: 108,
      heartRate: 102,
      heartRhythm: 'Sinus tachycardia',
      respiratoryRate: 22,
      oxygenSaturation: 92,
      supplementalO2: true,
      o2FlowRate: 2,
      temperature: 37.4,
      temperatureUnit: 'C',
      bloodGlucose: 142,
      gcsScore: 10,
      recordedAt: minutesAgo(38),
      details: {
        pupilLeft: '4mm reactive',
        pupilRight: '2mm sluggish',
        painScale: 0,
        skinColor: 'Flushed',
        diaphoresis: true,
        oxygenDevice: 'Nasal cannula',
      },
    },
  });

  await prisma.labResult.create({
    data: {
      encounterId: enc3.id,
      patientId: p3.id,
      orderedById: technician.id,
      testType: 'BLOOD_GLUCOSE',
      testName: 'Point-of-Care Glucose',
      status: 'COMPLETED',
      specimenCollectedAt: minutesAgo(36),
      resultedAt: minutesAgo(35),
      isSimulated: false,
      results: {
        components: [
          { name: 'Glucose', value: '142', unit: 'mg/dL', range: '70-100', abnormal: true, critical: false },
        ],
      },
      resultValues: {
        create: [
          { componentName: 'Glucose', value: '142', unit: 'mg/dL', referenceRange: '70-100', isAbnormal: true, isCritical: false },
        ],
      },
    },
  });

  await prisma.imagingStudy.create({
    data: {
      encounterId: enc3.id,
      patientId: p3.id,
      orderedById: technician.id,
      imagingType: 'CT_HEAD',
      status: 'PRELIMINARY',
      studyDescription: 'Non-contrast CT Head — Stroke Protocol',
      findings: 'Loss of gray-white differentiation in the left MCA territory. Left insular ribbon sign. Sulcal effacement in the left frontoparietal region.',
      impression: 'Acute large left MCA territory infarct. ASPECTS 5. No hemorrhage. Significant early ischemic changes.',
      performedAt: minutesAgo(30),
      isCritical: true,
      details: {
        aspectsScore: 5,
        hemorrhage: false,
        midlineShift: false,
        territory: 'Left MCA',
        earlyIschemicChanges: true,
        contrastUsed: false,
        contrastContraindicated: true,
        contrastAllergyNote: 'Patient allergic to iodine contrast',
      },
    },
  });

  await prisma.nIHSSAssessment.create({
    data: {
      encounterId: enc3.id,
      patientId: p3.id,
      assessedById: technician.id,
      totalScore: 22,
      levelOfConsciousness: 2,
      locQuestions: 2,
      locCommands: 1,
      bestGaze: 2,
      visualFields: 2,
      facialPalsy: 3,
      motorLeftArm: 0,
      motorRightArm: 4,
      motorLeftLeg: 0,
      motorRightLeg: 4,
      limbAtaxia: 0,
      sensory: 1,
      bestLanguage: 3,
      dysarthria: 2,
      extinctionInattention: 1,
      assessedAt: minutesAgo(35),
      notes: 'Large left MCA infarct. Global aphasia, right hemiplegia, right facial droop, forced left gaze deviation. GCS 10 (E2V2M6).',
      details: {
        laterality: 'Right-sided deficits → Left hemisphere (dominant)',
        dominantHand: 'Right',
        eyeDeviation: 'Forced left gaze deviation',
        gazeCorrectsDollsEyes: false,
        speechOutput: 'No intelligible speech',
        comprehension: 'Unable to follow commands reliably',
        gcsBreakdown: { eye: 2, verbal: 2, motor: 6 },
      },
    },
  });

  // Alert — awaiting neurologist assignment
  await prisma.alert.create({
    data: {
      encounterId: enc3.id,
      patientId: p3.id,
      recipientId: neurologist.id,
      senderId: technician.id,
      alertType: 'CONSULTATION_REQUEST',
      severity: 'EMERGENCY',
      status: 'ACTIVE',
      title: '🚨 URGENT: New stroke patient — NIHSS 22, ASPECTS 5',
      message: 'Bob Johnson, 70M. Sudden right-sided weakness + global aphasia. NIHSS 22. CT shows large left MCA infarct, ASPECTS 5. Within 1h tPA window. Awaiting your review.',
      metadata: { nihss: 22, aspectsScore: 5, sbp: 195, timeFromOnset: '1h', tpaEligible: true },
    },
  });

  console.log('✅ Patient 3: Bob Johnson — 70M, NIHSS 22, left MCA infarct → awaiting neuro review');

  // ═══════════════════════════════════════════════════════════════════════════
  // PATIENT 4: Maria Rodriguez — 40F — Small right frontal hemorrhage
  // Status: INTAKE → hypertensive emergency + cocaine use
  // ═══════════════════════════════════════════════════════════════════════════
  const p4 = await prisma.patient.create({
    data: {
      mrn: 'SS-MR-40F-004',
      firstName: 'Maria',
      lastName: 'Rodriguez',
      dateOfBirth: new Date('1986-05-12'),
      gender: 'FEMALE',
      age: 40,
      phoneNumber: '+1-555-4001',
      emergencyContactName: 'Carlos Rodriguez',
      emergencyContactPhone: '+1-555-4002',
      address: '321 Pine St, Springfield, IL 62704',
      insuranceProvider: 'United Healthcare',
      insurancePolicyNumber: 'UHC-2024-MR004',
      status: 'INTAKE',
      chiefComplaint: 'Severe thunderclap headache "worst of my life", left arm numbness, nausea, vomiting x2',
      symptomOnsetTime: minutesAgo(45),
      lastKnownWellTime: minutesAgo(50),
      medicalHistory: {
        create: [
          { condition: 'Uncontrolled hypertension', status: 'ACTIVE', notes: 'Non-compliant with medications. Last BP in clinic: 180/110' },
          { condition: 'Cocaine use disorder', status: 'ACTIVE', notes: 'Last use: today, ~1h before symptom onset' },
        ],
      },
      medications: {
        create: [
          { name: 'Hydrochlorothiazide', dosage: '25mg', frequency: 'Daily', route: 'PO', isActive: true, prescribedBy: 'Dr. Garcia' },
        ],
      },
      allergies: {
        create: [
          { allergen: 'Latex', reaction: 'Contact dermatitis', severity: 'MILD' },
        ],
      },
    },
  });

  const enc4 = await prisma.encounter.create({
    data: {
      patientId: p4.id,
      technicianId: technician.id,
      status: 'ACTIVE',
      priority: 'HIGH',
      msuUnitId: 'MSU-003',
      msuLocation: '39.7820,-89.6380',
      dispatchTime: minutesAgo(38),
      arrivalTime: minutesAgo(30),
    },
  });

  await prisma.vitalSign.create({
    data: {
      encounterId: enc4.id,
      patientId: p4.id,
      recordedById: technician.id,
      systolicBP: 210,
      diastolicBP: 125,
      heartRate: 112,
      heartRhythm: 'Sinus tachycardia',
      respiratoryRate: 20,
      oxygenSaturation: 97,
      temperature: 37.0,
      temperatureUnit: 'C',
      bloodGlucose: 110,
      gcsScore: 14,
      recordedAt: minutesAgo(28),
      details: {
        pupilLeft: '3mm reactive',
        pupilRight: '3mm reactive',
        painScale: 9,
        skinColor: 'Diaphoretic',
        diaphoresis: true,
        nausea: true,
        vomiting: true,
        headacheSeverity: '10/10 thunderclap',
      },
    },
  });

  await prisma.nIHSSAssessment.create({
    data: {
      encounterId: enc4.id,
      patientId: p4.id,
      assessedById: technician.id,
      totalScore: 4,
      levelOfConsciousness: 0,
      locQuestions: 0,
      locCommands: 0,
      bestGaze: 0,
      visualFields: 0,
      facialPalsy: 0,
      motorLeftArm: 2,
      motorRightArm: 0,
      motorLeftLeg: 0,
      motorRightLeg: 0,
      limbAtaxia: 0,
      sensory: 1,
      bestLanguage: 0,
      dysarthria: 1,
      extinctionInattention: 0,
      assessedAt: minutesAgo(25),
      notes: 'Small right frontal hemorrhage suspected given thunderclap headache, hypertensive emergency, and cocaine use. Left arm drift, mild sensory loss, mild dysarthria. tPA CONTRAINDICATED if hemorrhagic.',
      details: {
        laterality: 'Left arm drift → Right frontal',
        dominantHand: 'Right',
        headacheCharacter: 'Thunderclap, sudden onset',
        tpaContraindication: 'Suspected hemorrhage + cocaine use',
        toxicologyNote: 'Cocaine positive — sympathomimetic crisis',
      },
    },
  });

  // Alert — hypertensive emergency
  await prisma.alert.create({
    data: {
      encounterId: enc4.id,
      patientId: p4.id,
      recipientId: neurologist.id,
      senderId: technician.id,
      alertType: 'CRITICAL_VITAL',
      severity: 'CRITICAL',
      status: 'ACTIVE',
      title: '⚠️ Hypertensive Emergency: BP 210/125',
      message: 'Maria Rodriguez, 40F. Thunderclap headache, BP 210/125, cocaine use today. NIHSS 4. Suspected hemorrhagic stroke — tPA CONTRAINDICATED. Urgent CT needed.',
      metadata: { nihss: 4, sbp: 210, dbp: 125, cocaineUse: true, suspectedHemorrhage: true },
    },
  });

  console.log('✅ Patient 4: Maria Rodriguez — 40F, NIHSS 4, suspected frontal hemorrhage');

  // ═══════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════
  console.log('\n' + '═'.repeat(60));
  console.log('🎉 StrokeSync Database Seeding Complete!');
  console.log('═'.repeat(60));
  console.log('\n📊 Summary:');
  console.log('   Users:        3 (technician, neurologist, admin)');
  console.log('   Patients:     4');
  console.log('   Encounters:   4');
  console.log('   Vital Sets:   5 (2 for Patient 1)');
  console.log('   Lab Results:  3 (coag panel, BMP, glucose)');
  console.log('   CT Scans:     3');
  console.log('   NIHSS Scores: 4');
  console.log('   Consults:     2 (P1 in progress, P2 completed)');
  console.log('   Orders:       4 (tPA x2, ICU transfer, speech therapy)');
  console.log('   Messages:     4 (consultation thread)');
  console.log('   Alerts:       3 (2 active, 1 acknowledged)');
  console.log('\n🔐 Login Credentials:');
  console.log('   Technician:  tech@strokesync.com  / StrokeSync2024!');
  console.log('   Neurologist: neuro@strokesync.com / StrokeSync2024!');
  console.log('   Admin:       admin@strokesync.com / StrokeSync2024!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
