'use client';

interface VitalCardProps {
  label: string;
  value: string;
  unit: string;
  status: 'critical' | 'abnormal' | 'normal';
  icon?: string;
  trend?: 'up' | 'down' | 'stable';
}

export default function VitalCard({ label, value, unit, status, icon, trend }: VitalCardProps) {
  const statusColors = {
    critical: { bg: 'bg-red-500/[0.08]', border: 'border-red-500/20', text: 'text-red-500', glow: 'shadow-red-500/10' },
    abnormal: { bg: 'bg-amber-500/[0.08]', border: 'border-amber-500/20', text: 'text-amber-500', glow: 'shadow-amber-500/10' },
    normal: { bg: 'bg-emerald-500/[0.08]', border: 'border-emerald-500/20', text: 'text-emerald-500', glow: 'shadow-emerald-500/10' },
  };
  const c = statusColors[status];
  const trendArrow = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→';
  const trendLabel = trend === 'up' ? 'Rising' : trend === 'down' ? 'Falling' : 'Stable';

  return (
    <div className={`relative p-4 rounded-xl border ${c.border} ${c.bg} shadow-lg ${c.glow} backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-xl`}>
      {status === 'critical' && (
        <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-lg shadow-red-500/50" />
      )}
      <div className="flex items-center justify-between mb-2">
        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
        {icon && <span className="text-sm opacity-60">{icon}</span>}
      </div>
      <div className="flex items-baseline gap-1.5">
        <span className={`text-[28px] font-bold tabular-nums leading-none ${c.text}`}>{value}</span>
        <span className="text-[11px] text-muted-foreground font-medium">{unit}</span>
      </div>
      {trend && (
        <div className={`mt-2 flex items-center gap-1 text-[10px] font-medium ${c.text} opacity-70`}>
          <span>{trendArrow}</span>
          <span>{trendLabel}</span>
        </div>
      )}
    </div>
  );
}
