'use client';

interface NIHSSDisplayProps {
  score: number;
  assessedAt?: string;
  assessedBy?: string;
  components?: Record<string, number>;
}

function getSeverity(score: number) {
  if (score === 0) return { label: 'No Stroke Symptoms', color: 'text-emerald-500', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20' };
  if (score <= 4) return { label: 'Minor Stroke', color: 'text-emerald-400', bg: 'bg-emerald-500/10', ring: 'ring-emerald-500/20' };
  if (score <= 15) return { label: 'Moderate Stroke', color: 'text-amber-500', bg: 'bg-amber-500/10', ring: 'ring-amber-500/20' };
  if (score <= 20) return { label: 'Moderate-Severe', color: 'text-orange-500', bg: 'bg-orange-500/10', ring: 'ring-orange-500/20' };
  return { label: 'Severe Stroke', color: 'text-red-500', bg: 'bg-red-500/10', ring: 'ring-red-500/20' };
}

const NIHSS_ITEMS = [
  { key: 'levelOfConsciousness', label: '1a. LOC', max: 3 },
  { key: 'locQuestions', label: '1b. LOC Questions', max: 2 },
  { key: 'locCommands', label: '1c. LOC Commands', max: 2 },
  { key: 'bestGaze', label: '2. Best Gaze', max: 2 },
  { key: 'visualFields', label: '3. Visual Fields', max: 3 },
  { key: 'facialPalsy', label: '4. Facial Palsy', max: 3 },
  { key: 'motorLeftArm', label: '5a. Motor L Arm', max: 4 },
  { key: 'motorRightArm', label: '5b. Motor R Arm', max: 4 },
  { key: 'motorLeftLeg', label: '6a. Motor L Leg', max: 4 },
  { key: 'motorRightLeg', label: '6b. Motor R Leg', max: 4 },
  { key: 'limbAtaxia', label: '7. Limb Ataxia', max: 2 },
  { key: 'sensory', label: '8. Sensory', max: 2 },
  { key: 'bestLanguage', label: '9. Best Language', max: 3 },
  { key: 'dysarthria', label: '10. Dysarthria', max: 2 },
  { key: 'extinctionInattention', label: '11. Extinction', max: 2 },
];

export default function NIHSSDisplay({ score, assessedAt, assessedBy, components }: NIHSSDisplayProps) {
  const severity = getSeverity(score);

  return (
    <div className="space-y-4">
      {/* Score Header */}
      <div className={`flex items-center justify-between p-5 rounded-xl ${severity.bg} ring-1 ${severity.ring}`}>
        <div>
          <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mb-1">NIHSS Total Score</p>
          <p className={`text-5xl font-black tabular-nums ${severity.color}`}>{score}</p>
          <p className={`text-sm font-semibold mt-1 ${severity.color}`}>{severity.label}</p>
        </div>
        <div className="text-right space-y-1">
          {assessedAt && <p className="text-xs text-muted-foreground">Assessed {assessedAt}</p>}
          {assessedBy && <p className="text-xs text-muted-foreground">By: {assessedBy}</p>}
          <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${severity.bg} ${severity.color}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${score >= 16 ? 'animate-pulse' : ''}`} style={{ backgroundColor: 'currentColor' }} />
            {score >= 16 ? 'tPA Indicated' : score >= 5 ? 'tPA Candidate' : 'Consider'}
          </div>
        </div>
      </div>

      {/* Component Breakdown */}
      {components && (
        <div className="grid grid-cols-3 gap-2">
          {NIHSS_ITEMS.map((item) => {
            const val = (components as any)[item.key] ?? 0;
            const pct = (val / item.max) * 100;
            return (
              <div key={item.key} className="p-2.5 rounded-lg border border-border/50 bg-card/50">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] text-muted-foreground truncate pr-1">{item.label}</span>
                  <span className={`text-xs font-bold tabular-nums ${val > 0 ? (pct >= 75 ? 'text-red-500' : 'text-amber-500') : 'text-emerald-500'}`}>
                    {val}/{item.max}
                  </span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${pct >= 75 ? 'bg-red-500' : pct > 0 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
