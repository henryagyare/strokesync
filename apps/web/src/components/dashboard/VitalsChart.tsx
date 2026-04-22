'use client';

import { useEffect, useRef } from 'react';

interface VitalsChartProps {
  data: Array<{
    time: string;
    systolicBP?: number;
    diastolicBP?: number;
    heartRate?: number;
    oxygenSaturation?: number;
  }>;
}

export default function VitalsChart({ data }: VitalsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;
    const pad = { top: 20, right: 16, bottom: 30, left: 45 };
    const chartW = w - pad.left - pad.right;
    const chartH = h - pad.top - pad.bottom;

    // Clear
    ctx.clearRect(0, 0, w, h);

    // Y-axis range
    const allBP = data.flatMap((d) => [d.systolicBP, d.diastolicBP].filter(Boolean) as number[]);
    const allHR = data.map((d) => d.heartRate).filter(Boolean) as number[];
    const yMin = Math.min(40, ...allBP, ...allHR) - 10;
    const yMax = Math.max(200, ...allBP, ...allHR) + 10;
    const yRange = yMax - yMin;

    const toX = (i: number) => pad.left + (i / Math.max(1, data.length - 1)) * chartW;
    const toY = (v: number) => pad.top + (1 - (v - yMin) / yRange) * chartH;

    // Grid lines
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let v = Math.ceil(yMin / 20) * 20; v <= yMax; v += 20) {
      const y = toY(v);
      ctx.beginPath(); ctx.moveTo(pad.left, y); ctx.lineTo(w - pad.right, y); ctx.stroke();
      ctx.fillStyle = 'rgba(255,255,255,0.25)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(v.toString(), pad.left - 6, y + 3);
    }

    // Critical zones
    ctx.fillStyle = 'rgba(239,68,68,0.04)';
    ctx.fillRect(pad.left, toY(180), chartW, toY(160) - toY(180));

    // Draw line
    function drawLine(key: keyof (typeof data)[0], color: string, dashed = false) {
      const pts = data.map((d, i) => ({ x: toX(i), y: toY((d[key] as number) || 0), v: d[key] })).filter((p) => p.v != null);
      if (pts.length < 2) return;

      // Gradient fill
      const grad = ctx!.createLinearGradient(0, pad.top, 0, pad.top + chartH);
      grad.addColorStop(0, color.replace(')', ',0.15)').replace('rgb', 'rgba'));
      grad.addColorStop(1, color.replace(')', ',0)').replace('rgb', 'rgba'));

      ctx!.beginPath();
      ctx!.moveTo(pts[0].x, pad.top + chartH);
      pts.forEach((p) => ctx!.lineTo(p.x, p.y));
      ctx!.lineTo(pts[pts.length - 1].x, pad.top + chartH);
      ctx!.fillStyle = grad;
      ctx!.fill();

      // Line
      ctx!.beginPath();
      if (dashed) ctx!.setLineDash([4, 4]); else ctx!.setLineDash([]);
      ctx!.lineWidth = 2;
      ctx!.strokeStyle = color;
      pts.forEach((p, i) => (i === 0 ? ctx!.moveTo(p.x, p.y) : ctx!.lineTo(p.x, p.y)));
      ctx!.stroke();
      ctx!.setLineDash([]);

      // Dots
      pts.forEach((p) => {
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, 3, 0, Math.PI * 2);
        ctx!.fillStyle = color;
        ctx!.fill();
        ctx!.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx!.lineWidth = 1;
        ctx!.stroke();
      });
    }

    drawLine('systolicBP', 'rgb(239,68,68)');
    drawLine('diastolicBP', 'rgb(239,68,68)', true);
    drawLine('heartRate', 'rgb(59,130,246)');

    // X-axis labels
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '10px Inter, sans-serif';
    ctx.textAlign = 'center';
    data.forEach((d, i) => {
      if (i % Math.max(1, Math.floor(data.length / 5)) === 0) {
        ctx.fillText(d.time, toX(i), h - 8);
      }
    });

    // Legend
    const legendY = 10;
    [
      { label: 'Systolic', color: 'rgb(239,68,68)' },
      { label: 'Diastolic', color: 'rgb(239,68,68)' },
      { label: 'Heart Rate', color: 'rgb(59,130,246)' },
    ].forEach((item, i) => {
      const x = pad.left + i * 100;
      ctx.beginPath();
      ctx.arc(x, legendY, 3, 0, Math.PI * 2);
      ctx.fillStyle = item.color;
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(item.label, x + 7, legendY + 3);
    });
  }, [data]);

  return (
    <div className="p-4 rounded-xl border border-border bg-card">
      <h4 className="text-sm font-semibold mb-3">Vital Signs Trend</h4>
      <canvas ref={canvasRef} className="w-full h-[200px]" style={{ width: '100%', height: '200px' }} />
    </div>
  );
}
