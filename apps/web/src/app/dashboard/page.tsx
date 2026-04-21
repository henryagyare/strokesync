export default function DashboardPage() {
  return (
    <>
      {/* ─── Left Sidebar (Dark) ──────────────────────────── */}
      <aside className="w-64 bg-[hsl(222,47%,8%)] text-[hsl(215,20%,75%)] flex flex-col border-r border-white/5">
        {/* Brand */}
        <div className="p-5 border-b border-white/5">
          <h1 className="text-xl font-bold text-white tracking-tight">
            🧠 StrokeSync
          </h1>
          <p className="text-xs text-[hsl(215,20%,55%)] mt-1">Neurologist Console</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1">
          {[
            { icon: '👥', label: 'My Patients', active: true, badge: '4' },
            { icon: '💬', label: 'Messages', active: false, badge: '2' },
            { icon: '🔔', label: 'Alerts', active: false, badge: '3' },
            { icon: '📋', label: 'Consultations', active: false },
            { icon: '📊', label: 'Analytics', active: false },
            { icon: '⚙️', label: 'Settings', active: false },
          ].map((item) => (
            <button
              key={item.label}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${
                item.active
                  ? 'bg-primary/15 text-primary font-medium'
                  : 'hover:bg-white/5 text-[hsl(215,20%,65%)]'
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                  item.active ? 'bg-primary/20 text-primary' : 'bg-white/10 text-[hsl(215,20%,55%)]'
                }`}>
                  {item.badge}
                </span>
              )}
            </button>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-sm font-medium text-primary">
              MC
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">Dr. Michael Chen</p>
              <p className="text-xs text-[hsl(215,20%,55%)]">Vascular Neurology</p>
            </div>
          </div>
        </div>
      </aside>

      {/* ─── Center Panel (Patient Details) ───────────────── */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <div>
            <h2 className="text-lg font-semibold">Selected Patient Details</h2>
            <p className="text-xs text-muted-foreground">John Doe — 65M — MRN: SS-JD-65M-001</p>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-semibold animate-pulse-critical">
              ● CRITICAL
            </span>
            <span className="text-sm text-muted-foreground">
              Time from onset: <span className="text-foreground font-semibold">2h 15m</span>
            </span>
          </div>
        </header>

        {/* Tabs */}
        <div className="border-b border-border">
          <div className="flex px-6 gap-1">
            {['Patient Notes', 'Medical History', 'CT/Imaging', 'NIHSS', 'Vitals', 'Labs', 'Symptoms', 'Audio Message'].map((tab, i) => (
              <button
                key={tab}
                className={`px-4 py-3 text-sm transition-colors border-b-2 ${
                  i === 0
                    ? 'border-primary text-primary font-medium'
                    : 'border-transparent text-muted-foreground hover:text-foreground'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Vitals Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'Blood Pressure', value: '178/95', unit: 'mmHg', status: 'critical' },
              { label: 'Heart Rate', value: '88', unit: 'bpm', status: 'normal' },
              { label: 'O₂ Saturation', value: '96', unit: '%', status: 'normal' },
              { label: 'Blood Glucose', value: '165', unit: 'mg/dL', status: 'abnormal' },
            ].map((vital) => (
              <div key={vital.label} className="p-4 rounded-xl border border-border bg-card">
                <p className="text-xs text-muted-foreground mb-1">{vital.label}</p>
                <p className={`vital-value ${
                  vital.status === 'critical' ? 'vital-value--critical' :
                  vital.status === 'abnormal' ? 'vital-value--abnormal' : 'vital-value--normal'
                }`}>
                  {vital.value}
                  <span className="text-sm font-normal text-muted-foreground ml-1">{vital.unit}</span>
                </p>
              </div>
            ))}
          </div>

          {/* NIHSS Score */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">NIHSS Score</p>
                <p className="text-4xl font-bold text-red-500">18</p>
                <p className="text-sm text-red-400 mt-1">Moderate to Severe Stroke</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Assessed 1.5h ago</p>
                <p className="text-xs text-muted-foreground">By: Sarah Mitchell, EMT</p>
              </div>
            </div>
          </div>

          {/* Clinical Notes */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-3">Clinical Impression</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Large right MCA territory infarct suspected. Presenting with left hemiparesis (arm &gt; leg), 
              left facial droop, dysarthria, and left-sided neglect. CT shows hyperdense right MCA sign 
              with early ischemic changes. ASPECTS score: 6. Patient is within tPA window (2h from onset). 
              Currently on Warfarin — INR check critical before tPA administration.
            </p>
          </div>

          {/* Treatment Orders */}
          <div className="p-4 rounded-xl border border-border bg-card">
            <h3 className="font-semibold mb-3">Active Orders</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <span className="mt-0.5 px-2 py-0.5 rounded text-xs font-semibold bg-red-500/10 text-red-500">
                  EMERGENCY
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Alteplase (tPA) — 0.9 mg/kg IV</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    10% bolus over 1 min, remainder over 60 min. Hold warfarin. Monitor for hemorrhagic conversion.
                  </p>
                </div>
                <span className="text-xs text-amber-500 font-medium">IN PROGRESS</span>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
                <span className="mt-0.5 px-2 py-0.5 rounded text-xs font-semibold bg-amber-500/10 text-amber-500">
                  URGENT
                </span>
                <div className="flex-1">
                  <p className="text-sm font-medium">Transfer to Neuro ICU — University Hospital</p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Continuous cardiac monitoring, neuro checks q15min x 24h
                  </p>
                </div>
                <span className="text-xs text-blue-400 font-medium">PENDING</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ─── Right Panel (Actions) ────────────────────────── */}
      <aside className="w-72 border-l border-border flex flex-col bg-card">
        <div className="p-5 border-b border-border">
          <h3 className="font-semibold">Quick Actions</h3>
        </div>

        <div className="p-4 space-y-3">
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-green-600 text-white font-medium hover:bg-green-700 transition-colors">
            📞 Call Technician
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-primary text-primary-foreground font-medium hover:bg-primary/90 transition-colors">
            💬 Send Message
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-accent transition-colors">
            📋 New Order
          </button>
          <button className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-accent transition-colors">
            📝 Add Notes
          </button>
        </div>

        {/* Patient List (mini) */}
        <div className="flex-1 border-t border-border overflow-y-auto">
          <div className="p-4">
            <h4 className="text-sm font-medium text-muted-foreground mb-3">Other Patients</h4>
            <div className="space-y-2">
              {[
                { name: 'Jane Smith', age: '50F', nihss: 6, status: 'TREATMENT_ORDERED', priority: 'HIGH' },
                { name: 'Bob Johnson', age: '70M', nihss: 22, status: 'PENDING_REVIEW', priority: 'CRITICAL' },
                { name: 'Maria Rodriguez', age: '40F', nihss: 4, status: 'INTAKE', priority: 'HIGH' },
              ].map((p) => (
                <button
                  key={p.name}
                  className="w-full text-left p-3 rounded-lg border border-border/50 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">{p.name}</span>
                    <span className="text-xs text-muted-foreground">{p.age}</span>
                  </div>
                  <div className="flex items-center justify-between mt-1">
                    <span className={`text-xs ${p.priority === 'CRITICAL' ? 'text-red-500 font-semibold' : 'text-amber-500'}`}>
                      {p.status.replace(/_/g, ' ')}
                    </span>
                    <span className={`text-xs font-mono ${p.nihss >= 16 ? 'text-red-500' : p.nihss >= 5 ? 'text-amber-500' : 'text-green-500'}`}>
                      NIHSS: {p.nihss}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
