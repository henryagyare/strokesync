// ─── StrokeSync Database Seed ──────────────────────────────
// Seeds 4 sample patients + 2 users (technician + neurologist)

import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding StrokeSync database...\n');

  // ─── Users ──────────────────────────────────────────────
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

  console.log('✅ Users seeded:', { technician: technician.email, neurologist: neurologist.email, admin: admin.email });

  // ─── Patient 1: John Doe ────────────────────────────────
  const patient1 = await prisma.patient.create({
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
      symptomOnsetTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      lastKnownWellTime: new Date(Date.now() - 2.5 * 60 * 60 * 1000),
      medicalHistory: {
        create: [
          { condition: 'Hypertension', status: 'CHRONIC', notes: 'Controlled with medication' },
          { condition: 'Type 2 Diabetes Mellitus', status: 'CHRONIC', notes: 'HbA1c 7.2%' },
          { condition: 'Atrial Fibrillation', status: 'ACTIVE', notes: 'On anticoagulation' },
          { condition: 'Hyperlipidemia', status: 'CHRONIC' },
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
          { allergen: 'Penicillin', reaction: 'Hives', severity: 'MODERATE' },
          { allergen: 'Sulfa drugs', reaction: 'Anaphylaxis', severity: 'LIFE_THREATENING' },
        ],
      },
    },
  });

  // Encounter + clinical data for Patient 1
  const encounter1 = await prisma.encounter.create({
    data: {
      patientId: patient1.id,
      technicianId: technician.id,
      neurologistId: neurologist.id,
      status: 'IN_REVIEW',
      priority: 'CRITICAL',
      msuUnitId: 'MSU-001',
      msuLocation: '40.7128,-74.0060',
      dispatchTime: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
      arrivalTime: new Date(Date.now() - 1.5 * 60 * 60 * 1000),
    },
  });

  await prisma.vitalSign.create({
    data: {
      encounterId: encounter1.id,
      patientId: patient1.id,
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
    },
  });

  await prisma.nIHSSAssessment.create({
    data: {
      encounterId: encounter1.id,
      patientId: patient1.id,
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
      notes: 'Large right MCA territory infarct suspected. Left hemiparesis, left facial droop, dysarthria.',
    },
  });

  await prisma.imagingStudy.create({
    data: {
      encounterId: encounter1.id,
      patientId: patient1.id,
      orderedById: technician.id,
      interpretedById: neurologist.id,
      imagingType: 'CT_HEAD',
      status: 'FINAL',
      studyDescription: 'Non-contrast CT Head',
      findings: 'Hyperdense right MCA sign. Early ischemic changes in the right MCA territory including right insular ribbon sign and sulcal effacement.',
      impression: 'Large right MCA infarct with early ischemic changes. No hemorrhage. ASPECTS score: 6.',
      performedAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000),
      reportedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      isCritical: true,
    },
  });

  const consult1 = await prisma.consultation.create({
    data: {
      encounterId: encounter1.id,
      patientId: patient1.id,
      neurologistId: neurologist.id,
      technicianId: technician.id,
      status: 'IN_PROGRESS',
      requestedAt: new Date(Date.now() - 1.3 * 60 * 60 * 1000),
      acceptedAt: new Date(Date.now() - 1.25 * 60 * 60 * 1000),
      startedAt: new Date(Date.now() - 1.2 * 60 * 60 * 1000),
      diagnosis: 'Large right MCA territory infarct',
      diagnosisCode: 'I63.311',
    },
  });

  await prisma.treatmentOrder.createMany({
    data: [
      {
        consultationId: consult1.id,
        encounterId: encounter1.id,
        patientId: patient1.id,
        orderedById: neurologist.id,
        orderType: 'MEDICATION',
        status: 'IN_PROGRESS',
        priority: 'EMERGENCY',
        orderDescription: 'Administer tPA (Alteplase)',
        medicationName: 'Alteplase (tPA)',
        dosage: '0.9 mg/kg IV (max 90mg), 10% bolus over 1 min, remainder over 60 min',
        route: 'IV',
        frequency: 'ONCE',
        notes: 'Within 4.5h window. Hold warfarin. Monitor for hemorrhagic conversion.',
      },
      {
        consultationId: consult1.id,
        encounterId: encounter1.id,
        patientId: patient1.id,
        orderedById: neurologist.id,
        orderType: 'TRANSFER',
        status: 'PENDING',
        priority: 'EMERGENCY',
        orderDescription: 'Transfer to Neuro ICU for post-tPA monitoring',
        transferDestination: 'University Hospital',
        transferUnit: 'Neuro ICU',
        notes: 'Continuous cardiac monitoring, neuro checks q15min x 24h, BP goal <180/105',
      },
    ],
  });

  console.log('✅ Patient 1 seeded: John Doe — 65M, large right MCA infarct → tPA + ICU');

  // ─── Patient 2: Jane Smith ──────────────────────────────
  const patient2 = await prisma.patient.create({
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
      symptomOnsetTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      lastKnownWellTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
      medicalHistory: {
        create: [
          { condition: 'Migraine with aura', status: 'CHRONIC' },
          { condition: 'Oral contraceptive use', status: 'ACTIVE' },
          { condition: 'Patent Foramen Ovale (PFO)', status: 'ACTIVE', notes: 'Diagnosed incidentally 2020' },
        ],
      },
      medications: {
        create: [
          { name: 'Sumatriptan', dosage: '100mg', frequency: 'PRN', route: 'PO', isActive: true },
          { name: 'Oral Contraceptive', dosage: '1 tab', frequency: 'Daily', route: 'PO', isActive: true },
        ],
      },
      allergies: {
        create: [
          { allergen: 'Aspirin', reaction: 'GI bleeding', severity: 'SEVERE' },
        ],
      },
    },
  });

  const encounter2 = await prisma.encounter.create({
    data: {
      patientId: patient2.id,
      technicianId: technician.id,
      neurologistId: neurologist.id,
      status: 'IN_REVIEW',
      priority: 'HIGH',
      msuUnitId: 'MSU-002',
    },
  });

  await prisma.vitalSign.create({
    data: {
      encounterId: encounter2.id,
      patientId: patient2.id,
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
    },
  });

  await prisma.nIHSSAssessment.create({
    data: {
      encounterId: encounter2.id,
      patientId: patient2.id,
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
      notes: 'Small left PCA infarct suspected. Right homonymous hemianopia, anomic aphasia.',
    },
  });

  console.log('✅ Patient 2 seeded: Jane Smith — 50F, small left PCA infarct → tPA + speech therapy');

  // ─── Patient 3: Bob Johnson ─────────────────────────────
  const patient3 = await prisma.patient.create({
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
      chiefComplaint: 'Sudden right-sided weakness, unable to speak',
      symptomOnsetTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      lastKnownWellTime: new Date(Date.now() - 1.25 * 60 * 60 * 1000),
      medicalHistory: {
        create: [
          { condition: 'Hypertension', status: 'CHRONIC' },
          { condition: 'Previous TIA (2022)', status: 'RESOLVED' },
          { condition: 'Carotid stenosis (left 70%)', status: 'ACTIVE' },
          { condition: 'COPD', status: 'CHRONIC' },
          { condition: 'Former smoker (40 pack-years)', status: 'RESOLVED' },
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

  const encounter3 = await prisma.encounter.create({
    data: {
      patientId: patient3.id,
      technicianId: technician.id,
      status: 'PENDING_REVIEW',
      priority: 'CRITICAL',
      msuUnitId: 'MSU-001',
    },
  });

  await prisma.vitalSign.create({
    data: {
      encounterId: encounter3.id,
      patientId: patient3.id,
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
    },
  });

  await prisma.nIHSSAssessment.create({
    data: {
      encounterId: encounter3.id,
      patientId: patient3.id,
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
      notes: 'Large left MCA infarct. Global aphasia, right hemiplegia, right facial droop, left gaze deviation.',
    },
  });

  console.log('✅ Patient 3 seeded: Bob Johnson — 70M, large left MCA infarct');

  // ─── Patient 4: Maria Rodriguez ─────────────────────────
  const patient4 = await prisma.patient.create({
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
      chiefComplaint: 'Severe headache, left arm numbness, nausea',
      symptomOnsetTime: new Date(Date.now() - 45 * 60 * 1000), // 45 min ago
      lastKnownWellTime: new Date(Date.now() - 50 * 60 * 1000),
      medicalHistory: {
        create: [
          { condition: 'Uncontrolled hypertension', status: 'ACTIVE', notes: 'Non-compliant with medications' },
          { condition: 'Cocaine use disorder', status: 'ACTIVE', notes: 'Last use: today' },
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

  const encounter4 = await prisma.encounter.create({
    data: {
      patientId: patient4.id,
      technicianId: technician.id,
      status: 'ACTIVE',
      priority: 'HIGH',
      msuUnitId: 'MSU-003',
    },
  });

  await prisma.vitalSign.create({
    data: {
      encounterId: encounter4.id,
      patientId: patient4.id,
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
    },
  });

  await prisma.nIHSSAssessment.create({
    data: {
      encounterId: encounter4.id,
      patientId: patient4.id,
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
      notes: 'Small right frontal hemorrhage suspected. Left arm drift, mild sensory loss, mild dysarthria. Hypertensive emergency.',
    },
  });

  console.log('✅ Patient 4 seeded: Maria Rodriguez — 40F, small right frontal hemorrhage');

  console.log('\n🎉 Database seeding completed!\n');
  console.log('Login credentials:');
  console.log('  Technician: tech@strokesync.com / StrokeSync2024!');
  console.log('  Neurologist: neuro@strokesync.com / StrokeSync2024!');
  console.log('  Admin: admin@strokesync.com / StrokeSync2024!\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
