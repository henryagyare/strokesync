'use client';

interface ActionPanelProps {
  selectedPatient: any;
  patients: any[];
  onSelectPatient: (patient: any) => void;
}

export default function ActionPanel({ selectedPatient, patients, onSelectPatient }: ActionPanelProps) {
  const otherPatients = patients.filter((p) => p.id !== selectedPatient?.id);

  return (
    <aside className="w-[280px] min-w-[280px] border-l border-border/50 flex flex-col bg-card/50 backdrop-blur-sm">
      {/* Quick Actions Header */}
      <div className="px-5 py-4 border-b border-border/50">
        <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Quick Actions</h3>
      </div>

      {/* Action Buttons */}
      <div className="p-4 space-y-2.5 border-b border-border/50">
        <button className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold text-[13px] hover:from-green-500 hover:to-emerald-500 transition-all shadow-lg shadow-green-600/20 active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
          Call Technician
        </button>
        <button className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold text-[13px] hover:from-blue-500 hover:to-indigo-500 transition-all shadow-lg shadow-blue-600/20 active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
          Send Message
        </button>
        <button className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-border/80 bg-white/[0.02] text-foreground font-semibold text-[13px] hover:bg-white/[0.05] transition-all active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
          New Order
        </button>
        <button className="w-full flex items-center justify-center gap-2.5 px-4 py-3 rounded-xl border border-border/80 bg-white/[0.02] text-foreground font-semibold text-[13px] hover:bg-white/[0.05] transition-all active:scale-[0.98]">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
          Add Notes
        </button>
      </div>

      {/* Other Patients List */}
      <div className="flex-1 overflow-y-auto">
        <div className="px-5 py-3">
          <h4 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">Other Patients</h4>
        </div>
        <div className="px-3 pb-3 space-y-1.5">
          {otherPatients.map((p) => (
            <button
              key={p.id || p.name}
              onClick={() => onSelectPatient(p)}
              className="w-full text-left p-3 rounded-xl border border-border/30 hover:border-border/60 hover:bg-white/[0.02] transition-all group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-[13px] font-semibold group-hover:text-primary transition-colors">{p.name || `${p.firstName} ${p.lastName}`}</span>
                <span className="text-[11px] text-muted-foreground">{p.age}{p.gender === 'MALE' ? 'M' : 'F'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className={`text-[11px] font-medium ${
                  p.priority === 'CRITICAL' ? 'text-red-500' : p.priority === 'HIGH' ? 'text-amber-500' : 'text-blue-400'
                }`}>
                  {(p.status || '').replace(/_/g, ' ')}
                </span>
                <span className={`text-[11px] font-mono font-bold ${
                  (p.nihss || 0) >= 16 ? 'text-red-500' : (p.nihss || 0) >= 5 ? 'text-amber-500' : 'text-emerald-500'
                }`}>
                  NIHSS {p.nihss ?? '—'}
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </aside>
  );
}
