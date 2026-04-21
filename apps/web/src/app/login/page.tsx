export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-stroke-purple/15 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md p-8">
        <div className="rounded-2xl border border-border bg-card/80 backdrop-blur-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-stroke-purple bg-clip-text text-transparent">
              StrokeSync
            </h1>
            <p className="text-sm text-muted-foreground mt-2">Sign in to your account</p>
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
              <input
                id="email"
                type="email"
                placeholder="neuro@strokesync.com"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
              <input
                id="password"
                type="password"
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full px-4 py-3 rounded-xl bg-primary text-primary-foreground font-semibold hover:bg-primary/90 transition-all hover:shadow-lg hover:shadow-primary/25"
            >
              Sign In
            </button>
          </form>

          {/* Demo Credentials */}
          <div className="mt-6 p-4 rounded-xl bg-muted/50 border border-border/50">
            <p className="text-xs text-muted-foreground font-medium mb-2">Demo Credentials:</p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>🩺 <span className="text-foreground">tech@strokesync.com</span></p>
              <p>🧠 <span className="text-foreground">neuro@strokesync.com</span></p>
              <p>🔑 Password: <span className="text-foreground">StrokeSync2024!</span></p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
