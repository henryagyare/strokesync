import Link from 'next/link';

export default function HomePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-background relative overflow-hidden">
      {/* Background gradient effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-stroke-purple/20 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-stroke-info/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 text-center space-y-8 px-6">
        {/* Logo & Brand */}
        <div className="space-y-4">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-primary/20 bg-primary/5 text-sm text-primary">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            HIPAA Compliant
          </div>
          
          <h1 className="text-6xl font-extrabold tracking-tight">
            <span className="bg-gradient-to-r from-primary via-stroke-purple to-stroke-info bg-clip-text text-transparent">
              StrokeSync
            </span>
          </h1>
          
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Mobile Stroke Unit + Remote Neurologist Consultation System.
            <br />
            Real-time stroke care coordination, from scene to treatment.
          </p>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25 hover:-translate-y-0.5"
          >
            🧠 Neurologist Dashboard
          </Link>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl border border-border bg-card text-foreground font-semibold text-lg hover:bg-accent transition-all hover:-translate-y-0.5"
          >
            🔐 Sign In
          </Link>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto pt-8">
          {[
            { label: 'Active Patients', value: '4', icon: '👤' },
            { label: 'Avg Response', value: '< 8 min', icon: '⚡' },
            { label: 'tPA Eligible', value: '3', icon: '💉' },
            { label: 'Pending Review', value: '2', icon: '📋' },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center p-4 rounded-xl border border-border/50 bg-card/50 backdrop-blur-sm"
            >
              <span className="text-2xl mb-1">{stat.icon}</span>
              <span className="text-2xl font-bold text-foreground">{stat.value}</span>
              <span className="text-xs text-muted-foreground">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
