'use client';

import { useState, useCallback } from 'react';
import Sidebar from '../../components/dashboard/Sidebar';
import ActionPanel from '../../components/dashboard/ActionPanel';
import VitalCard from '../../components/dashboard/VitalCard';
import VitalsChart from '../../components/dashboard/VitalsChart';
import NIHSSDisplay from '../../components/dashboard/NIHSSDisplay';

// ─── Sample Data (matches seed exactly) ────────────────────────────────────
const PATIENTS = [
  {
    id: '1', firstName: 'John', lastName: 'Doe', name: 'John Doe', mrn: 'SS-JD-65M-001',
    age: 65, gender: 'MALE', status: 'CONSULTATION_ACTIVE', priority: 'CRITICAL', nihss: 18,
    chiefComplaint: 'Sudden onset left-sided weakness, facial droop, slurred speech',
    onsetTime: '2h 15m ago', lastKnownWell: '2h 30m ago',
    vitals: { systolicBP: 178, diastolicBP: 95, heartRate: 88, rhythm: 'A-fib (irregularly irregular)', rr: 18, spo2: 96, temp: 37.1, glucose: 165, gcs: 13 },
    vitalsHistory: [
      { time: '14:30', systolicBP: 185, diastolicBP: 98, heartRate: 92, oxygenSaturation: 95 },
      { time: '14:45', systolicBP: 182, diastolicBP: 96, heartRate: 90, oxygenSaturation: 95 },
      { time: '15:00', systolicBP: 178, diastolicBP: 95, heartRate: 88, oxygenSaturation: 96 },
      { time: '15:15', systolicBP: 175, diastolicBP: 93, heartRate: 86, oxygenSaturation: 96 },
      { time: '15:30', systolicBP: 172, diastolicBP: 92, heartRate: 84, oxygenSaturation: 97 },
    ],
    nihssComponents: { levelOfConsciousness: 1, locQuestions: 1, locCommands: 1, bestGaze: 1, visualFields: 2, facialPalsy: 2, motorLeftArm: 3, motorRightArm: 0, motorLeftLeg: 3, motorRightLeg: 0, limbAtaxia: 0, sensory: 1, bestLanguage: 1, dysarthria: 2, extinctionInattention: 0 },
    medicalHistory: ['Hypertension (controlled)', 'Type 2 Diabetes (HbA1c 7.2%)', 'Atrial Fibrillation (on anticoagulation)', 'Hyperlipidemia (on statins)'],
    medications: ['Lisinopril 20mg daily', 'Metformin 1000mg BID', 'Warfarin 5mg daily', 'Atorvastatin 40mg daily'],
    allergies: ['Penicillin (hives)', 'Sulfa drugs (anaphylaxis ⚠️)'],
    imaging: { type: 'CT Head (Non-contrast)', findings: 'Hyperdense right MCA sign. Early ischemic changes in the right MCA territory. Right insular ribbon sign.', impression: 'Acute large right MCA territory infarct. ASPECTS 6. No hemorrhage. No midline shift.', aspects: 6 },
    labs: [
      { name: 'Coagulation Panel', values: [{ component: 'INR', value: '2.1', ref: '0.8-1.2', critical: true }, { component: 'PT', value: '24.5s', ref: '11-13.5', abnormal: true }] },
      { name: 'Basic Metabolic Panel', values: [{ component: 'Glucose', value: '165', ref: '70-100', abnormal: true }, { component: 'Sodium', value: '141', ref: '136-145' }, { component: 'Potassium', value: '4.2', ref: '3.5-5.0' }, { component: 'Creatinine', value: '1.1', ref: '0.7-1.3' }] },
    ],
    orders: [
      { priority: 'EMERGENCY', name: 'Alteplase (tPA) — 0.9 mg/kg IV', details: '10% bolus over 1 min, remainder over 60 min. Hold warfarin. Monitor for hemorrhagic conversion.', status: 'IN_PROGRESS' },
      { priority: 'EMERGENCY', name: 'Transfer to Neuro ICU — University Hospital', details: 'Continuous cardiac monitoring, neuro checks q15min x 24h', status: 'PENDING' },
    ],
    consultation: {
      impression: 'Acute ischemic stroke, large vessel occlusion right MCA territory. NIHSS 18, ASPECTS 6. Patient within tPA window (2h from onset). INR 2.1 on Warfarin — relative contraindication but benefit likely outweighs risk given severity.',
      recommendations: '1. Administer IV tPA at 0.9mg/kg. 2. Hold Warfarin. 3. Monitor for hemorrhagic conversion. 4. Transfer to Neuro ICU. 5. Consider endovascular thrombectomy if no improvement post-tPA.',
    },
    messages: [
      { sender: 'Sarah Mitchell', role: 'TECHNICIAN', content: 'Dr. Chen, 65M — sudden onset left-sided weakness, facial droop. NIHSS 18. CT shows hyperdense right MCA sign, ASPECTS 6. INR 2.1 on Warfarin.', time: '14:30' },
      { sender: 'Dr. Michael Chen', role: 'NEUROLOGIST', content: 'Received. Reviewing CT now. INR 2.1 is concerning but NIHSS 18 with ASPECTS 6 — benefits of tPA likely outweigh risks. Prepare tPA at 0.9mg/kg. What\'s his weight?', time: '14:35' },
      { sender: 'Sarah Mitchell', role: 'TECHNICIAN', content: 'Weight is 82kg. tPA dose: 73.8mg total. 7.4mg bolus, 66.4mg infusion. Ready to administer.', time: '14:40' },
      { sender: 'Dr. Michael Chen', role: 'NEUROLOGIST', content: 'Confirmed. Begin tPA infusion now. Hold all anticoagulants. BP management: Labetalol 10mg IV PRN if SBP >180 or DBP >105. Neuro ICU transfer ordered.', time: '14:45' },
    ],
  },
  { id: '2', firstName: 'Jane', lastName: 'Smith', name: 'Jane Smith', mrn: 'SS-JS-50F-002', age: 50, gender: 'FEMALE', status: 'TREATMENT_ORDERED', priority: 'HIGH', nihss: 6, chiefComplaint: 'Sudden visual field loss, word-finding difficulty', onsetTime: '3h ago', vitals: { systolicBP: 148, diastolicBP: 82, heartRate: 76, spo2: 98, glucose: 95, gcs: 15 } },
  { id: '3', firstName: 'Bob', lastName: 'Johnson', name: 'Bob Johnson', mrn: 'SS-BJ-70M-003', age: 70, gender: 'MALE', status: 'CONSULTATION_PENDING', priority: 'CRITICAL', nihss: 22, chiefComplaint: 'Sudden right-sided weakness, unable to speak', onsetTime: '1h ago', vitals: { systolicBP: 195, diastolicBP: 108, heartRate: 102, spo2: 92, glucose: 142, gcs: 10 } },
  { id: '4', firstName: 'Maria', lastName: 'Rodriguez', name: 'Maria Rodriguez', mrn: 'SS-MR-40F-004', age: 40, gender: 'FEMALE', status: 'INTAKE', priority: 'HIGH', nihss: 4, chiefComplaint: 'Severe thunderclap headache, left arm numbness', onsetTime: '45m ago', vitals: { systolicBP: 210, diastolicBP: 125, heartRate: 112, spo2: 97, glucose: 110, gcs: 14 } },
];

const TABS = ['Patient Notes', 'Medical History', 'CT / Imaging', 'NIHSS Score', 'Vitals', 'Labs', 'Symptoms', 'Audio Message'];

function getVitalStatus(systolic?: number, diastolic?: number): 'critical' | 'abnormal' | 'normal' {
  if (!systolic) return 'normal';
  if (systolic > 180 || systolic < 90) return 'critical';
  if (systolic > 140 || diastolic! > 90) return 'abnormal';
  return 'normal';
}

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState('patients');
  const [selectedPatient, setSelectedPatient] = useState(PATIENTS[0]);
  const [activeTab, setActiveTab] = useState(0);

  const p = selectedPatient;
  const v = p.vitals;

  const handleSelectPatient = useCallback((patient: any) => {
    setSelectedPatient(patient);
    setActiveTab(0);
  }, []);

  return (
    <>
      <Sidebar
        activeSection={activeSection}
        onSectionChange={setActiveSection}
        patientCount={PATIENTS.length}
        alertCount={3}
        messageCount={2}
      />

      {/* ─── Center Panel ─────────────────────────────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Header */}
        <header className="h-[60px] min-h-[60px] border-b border-border/50 flex items-center justify-between px-6 bg-card/30 backdrop-blur-sm">
          <div>
            <h2 className="text-[15px] font-bold">Selected Patient Details</h2>
            <p className="text-[12px] text-muted-foreground">
              {p.name} — {p.age}{p.gender === 'MALE' ? 'M' : 'F'} — MRN: {p.mrn}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={`px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider ${
              p.priority === 'CRITICAL'
                ? 'bg-red-500/10 text-red-500 ring-1 ring-red-500/20 animate-pulse'
                : 'bg-amber-500/10 text-amber-500 ring-1 ring-amber-500/20'
            }`}>
              ● {p.priority}
            </span>
            <div className="text-right">
              <p className="text-[11px] text-muted-foreground">Time from onset</p>
              <p className="text-[13px] font-bold text-foreground tabular-nums">{p.onsetTime}</p>
            </div>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-border/50 bg-card/20">
          <div className="flex px-6 gap-0.5 overflow-x-auto">
            {TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveTab(i)}
                className={`px-4 py-3 text-[13px] whitespace-nowrap transition-all border-b-2 ${
                  i === activeTab
                    ? 'border-blue-500 text-blue-500 font-semibold'
                    : 'border-transparent text-muted-foreground hover:text-foreground hover:border-white/10'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">

          {/* ═══ TAB 0: Patient Notes ═══ */}
          {activeTab === 0 && (
            <>
              {/* Vital Cards Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <VitalCard label="BLOOD PRESSURE" value={`${v.systolicBP}/${v.diastolicBP}`} unit="mmHg" status={getVitalStatus(v.systolicBP, v.diastolicBP)} icon="🫀" trend="down" />
                <VitalCard label="HEART RATE" value={String(v.heartRate)} unit="bpm" status={v.heartRate > 100 ? 'abnormal' : 'normal'} icon="💓" trend="stable" />
                <VitalCard label="O₂ SATURATION" value={String(v.spo2)} unit="%" status={v.spo2 < 94 ? 'critical' : v.spo2 < 96 ? 'abnormal' : 'normal'} icon="🫁" />
                <VitalCard label="BLOOD GLUCOSE" value={String(v.glucose)} unit="mg/dL" status={v.glucose > 140 ? 'abnormal' : v.glucose < 70 ? 'critical' : 'normal'} icon="🩸" />
              </div>

              {/* Vitals Chart */}
              {p.vitalsHistory && <VitalsChart data={p.vitalsHistory} />}

              {/* Clinical Impression */}
              {p.consultation && (
                <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Clinical Impression
                  </h3>
                  <p className="text-[13px] text-muted-foreground leading-relaxed">{p.consultation.impression}</p>
                  {p.consultation.recommendations && (
                    <div className="mt-4 pt-3 border-t border-border/30">
                      <h4 className="text-[12px] font-semibold text-foreground mb-2">Recommendations</h4>
                      <p className="text-[13px] text-muted-foreground leading-relaxed">{p.consultation.recommendations}</p>
                    </div>
                  )}
                </div>
              )}

              {/* Active Orders */}
              {p.orders && (
                <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    Active Orders
                  </h3>
                  <div className="space-y-2.5">
                    {p.orders.map((order: any, i: number) => (
                      <div key={i} className={`flex items-start gap-3 p-3.5 rounded-xl border ${
                        order.priority === 'EMERGENCY' ? 'bg-red-500/[0.03] border-red-500/10' : 'bg-amber-500/[0.03] border-amber-500/10'
                      }`}>
                        <span className={`mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          order.priority === 'EMERGENCY' ? 'bg-red-500/10 text-red-500' : 'bg-amber-500/10 text-amber-500'
                        }`}>
                          {order.priority}
                        </span>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold">{order.name}</p>
                          <p className="text-[12px] text-muted-foreground mt-0.5">{order.details}</p>
                        </div>
                        <span className={`text-[11px] font-bold shrink-0 ${
                          order.status === 'IN_PROGRESS' ? 'text-amber-500' : 'text-blue-400'
                        }`}>
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Consultation Messages */}
              {p.messages && (
                <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Consultation Chat
                  </h3>
                  <div className="space-y-3 max-h-[300px] overflow-y-auto">
                    {p.messages.map((msg: any, i: number) => (
                      <div key={i} className={`flex gap-3 ${msg.role === 'NEUROLOGIST' ? 'flex-row-reverse' : ''}`}>
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 ${
                          msg.role === 'NEUROLOGIST' ? 'bg-blue-500/20 text-blue-400' : 'bg-emerald-500/20 text-emerald-400'
                        }`}>
                          {msg.sender.split(' ').map((w: string) => w[0]).join('').slice(0, 2)}
                        </div>
                        <div className={`max-w-[75%] p-3 rounded-xl text-[12px] leading-relaxed ${
                          msg.role === 'NEUROLOGIST'
                            ? 'bg-blue-500/[0.08] border border-blue-500/10 text-foreground'
                            : 'bg-white/[0.03] border border-border/30 text-muted-foreground'
                        }`}>
                          <p className="font-semibold text-[11px] mb-1 opacity-70">{msg.sender} · {msg.time}</p>
                          <p>{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Message Input */}
                  <div className="mt-3 flex gap-2">
                    <input
                      type="text"
                      placeholder="Type a message..."
                      className="flex-1 h-10 px-4 rounded-xl border border-border/50 bg-white/[0.02] text-sm placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-blue-500/50"
                    />
                    <button className="h-10 px-5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-500 transition-colors">
                      Send
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══ TAB 1: Medical History ═══ */}
          {activeTab === 1 && (
            <div className="space-y-5">
              <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                  Medical History
                </h3>
                <div className="space-y-2">
                  {(p.medicalHistory || []).map((h: string, i: number) => (
                    <div key={i} className="flex items-start gap-2 text-[13px]">
                      <span className="text-muted-foreground mt-0.5">•</span>
                      <span>{h}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                    Current Medications
                  </h3>
                  <div className="space-y-2">
                    {(p.medications || []).map((m: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-[13px] text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-400/50" />
                        {m}
                      </div>
                    ))}
                  </div>
                </div>
                <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                    Allergies
                  </h3>
                  <div className="space-y-2">
                    {(p.allergies || []).map((a: string, i: number) => (
                      <div key={i} className="flex items-center gap-2 text-[13px] text-red-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        {a}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB 2: CT / Imaging ═══ */}
          {activeTab === 2 && p.imaging && (
            <div className="space-y-5">
              <div className="p-5 rounded-xl border border-border/50 bg-card/50">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    {p.imaging.type}
                  </h3>
                  {p.imaging.aspects != null && (
                    <span className={`px-3 py-1 rounded-full text-[11px] font-bold ${
                      p.imaging.aspects <= 5 ? 'bg-red-500/10 text-red-500' : p.imaging.aspects <= 7 ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                    }`}>
                      ASPECTS: {p.imaging.aspects}/10
                    </span>
                  )}
                </div>
                {/* CT Placeholder */}
                <div className="w-full h-64 rounded-xl bg-gradient-to-br from-gray-900 to-gray-800 border border-white/5 flex items-center justify-center mb-4">
                  <div className="text-center">
                    <span className="text-4xl mb-2 block">🧠</span>
                    <p className="text-sm text-muted-foreground">CT Image Viewer</p>
                    <p className="text-[11px] text-muted-foreground/50">DICOM integration pending</p>
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <h4 className="text-[12px] font-semibold text-foreground mb-1">Findings</h4>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{p.imaging.findings}</p>
                  </div>
                  <div>
                    <h4 className="text-[12px] font-semibold text-foreground mb-1">Impression</h4>
                    <p className="text-[13px] text-muted-foreground leading-relaxed">{p.imaging.impression}</p>
                  </div>
                </div>
              </div>
            </div>
          )}
          {activeTab === 2 && !p.imaging && (
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No imaging studies available</div>
          )}

          {/* ═══ TAB 3: NIHSS Score ═══ */}
          {activeTab === 3 && (
            <NIHSSDisplay
              score={p.nihss}
              assessedAt="1.5h ago"
              assessedBy="Sarah Mitchell, EMT"
              components={p.nihssComponents}
            />
          )}

          {/* ═══ TAB 4: Vitals ═══ */}
          {activeTab === 4 && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <VitalCard label="BLOOD PRESSURE" value={`${v.systolicBP}/${v.diastolicBP}`} unit="mmHg" status={getVitalStatus(v.systolicBP, v.diastolicBP)} />
                <VitalCard label="HEART RATE" value={String(v.heartRate)} unit="bpm" status={v.heartRate > 100 ? 'abnormal' : 'normal'} />
                <VitalCard label="O₂ SATURATION" value={String(v.spo2)} unit="%" status={v.spo2 < 94 ? 'critical' : v.spo2 < 96 ? 'abnormal' : 'normal'} />
                <VitalCard label="BLOOD GLUCOSE" value={String(v.glucose)} unit="mg/dL" status={v.glucose > 140 ? 'abnormal' : 'normal'} />
                <VitalCard label="TEMPERATURE" value={String(v.temp || '37.1')} unit="°C" status="normal" />
                <VitalCard label="RESP RATE" value={String(v.rr || 18)} unit="/min" status="normal" />
                <VitalCard label="GCS" value={String(v.gcs)} unit="/15" status={v.gcs <= 8 ? 'critical' : v.gcs <= 12 ? 'abnormal' : 'normal'} />
                {v.rhythm && <VitalCard label="RHYTHM" value={v.rhythm.split(' ')[0]} unit="" status={v.rhythm.includes('A-fib') ? 'abnormal' : 'normal'} />}
              </div>
              {p.vitalsHistory && <VitalsChart data={p.vitalsHistory} />}
            </div>
          )}

          {/* ═══ TAB 5: Labs ═══ */}
          {activeTab === 5 && (
            <div className="space-y-4">
              {(p.labs || []).map((lab: any, li: number) => (
                <div key={li} className="p-5 rounded-xl border border-border/50 bg-card/50">
                  <h3 className="text-sm font-bold mb-3">{lab.name}</h3>
                  <div className="space-y-1.5">
                    {lab.values.map((v: any, vi: number) => (
                      <div key={vi} className="flex items-center justify-between py-2 border-b border-border/20 last:border-0">
                        <span className="text-[13px]">{v.component}</span>
                        <div className="flex items-center gap-3">
                          <span className={`text-[13px] font-bold tabular-nums ${v.critical ? 'text-red-500' : v.abnormal ? 'text-amber-500' : ''}`}>
                            {v.value}
                          </span>
                          <span className="text-[11px] text-muted-foreground w-20 text-right">({v.ref})</span>
                          {v.critical && <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />}
                          {v.abnormal && !v.critical && <span className="w-2 h-2 rounded-full bg-amber-500" />}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {(!p.labs || p.labs.length === 0) && (
                <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">No lab results available</div>
              )}
            </div>
          )}

          {/* ═══ TAB 6: Symptoms ═══ */}
          {activeTab === 6 && (
            <div className="p-5 rounded-xl border border-border/50 bg-card/50 space-y-4">
              <h3 className="text-sm font-bold flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500" />
                Chief Complaint
              </h3>
              <p className="text-[14px] text-foreground font-medium">{p.chiefComplaint}</p>
              <div className="grid grid-cols-2 gap-4 pt-3">
                <div className="p-3 rounded-lg bg-white/[0.02] border border-border/30">
                  <p className="text-[11px] text-muted-foreground mb-1">Symptom Onset</p>
                  <p className="text-[13px] font-semibold">{p.onsetTime}</p>
                </div>
                <div className="p-3 rounded-lg bg-white/[0.02] border border-border/30">
                  <p className="text-[11px] text-muted-foreground mb-1">Last Known Well</p>
                  <p className="text-[13px] font-semibold">{p.lastKnownWell || 'Not recorded'}</p>
                </div>
              </div>
            </div>
          )}

          {/* ═══ TAB 7: Audio Message ═══ */}
          {activeTab === 7 && (
            <div className="p-5 rounded-xl border border-border/50 bg-card/50">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                Audio Messages
              </h3>
              {/* Audio Player */}
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-border/30">
                  <button className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center hover:bg-blue-500 transition-colors shrink-0">
                    <svg className="w-4 h-4 text-white ml-0.5" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                  </button>
                  <div className="flex-1">
                    <div className="h-1.5 rounded-full bg-white/5 overflow-hidden">
                      <div className="h-full w-[35%] rounded-full bg-gradient-to-r from-blue-500 to-cyan-400" />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground">0:42</span>
                      <span className="text-[10px] text-muted-foreground">2:15</span>
                    </div>
                  </div>
                </div>
                <p className="text-[12px] text-muted-foreground">
                  <span className="font-semibold">Sarah Mitchell</span> · Recorded at field · 14:28
                </p>
                <p className="text-[12px] text-muted-foreground italic">
                  &ldquo;Dr. Chen, this is Sarah from MSU-001. 65-year-old male, sudden onset left-sided weakness approximately 2 hours ago. He has atrial fibrillation, is on Warfarin. NIHSS is 18. CT shows right MCA hyperdensity...&rdquo;
                </p>
              </div>
            </div>
          )}
        </div>
      </main>

      <ActionPanel
        selectedPatient={selectedPatient}
        patients={PATIENTS}
        onSelectPatient={handleSelectPatient}
      />
    </>
  );
}
