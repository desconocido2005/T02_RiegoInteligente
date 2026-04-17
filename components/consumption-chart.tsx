'use client';

import { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { Droplet } from 'lucide-react';
import { useStore } from '@/lib/store';

const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function ConsumptionChart() {
  const { state } = useStore();

  const data = useMemo(() => {
    const today = new Date();
    const buckets: { day: string; consumption: number; ts: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      d.setHours(0, 0, 0, 0);
      buckets.push({ day: DIAS[d.getDay()], consumption: 0, ts: d.getTime() });
    }

    state.historial.forEach((h) => {
      const hDate = new Date(h.fecha_inicio);
      hDate.setHours(0, 0, 0, 0);
      const match = buckets.find((b) => b.ts === hDate.getTime());
      if (match) match.consumption += Number(h.litros_consumidos);
    });

    // Include current in-progress irrigations
    Object.values(state.runtime).forEach((r) => {
      if (r.regando && r.litros_en_curso > 0) {
        const today0 = new Date();
        today0.setHours(0, 0, 0, 0);
        const bucket = buckets.find((b) => b.ts === today0.getTime());
        if (bucket) bucket.consumption += r.litros_en_curso;
      }
    });

    return buckets.map((b) => ({
      day: b.day,
      consumption: Math.round(b.consumption),
    }));
  }, [state.historial, state.runtime]);

  const total = data.reduce((a, b) => a + b.consumption, 0);
  const max = Math.max(...data.map((d) => d.consumption), 1);

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-border-strong">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-1 rounded-full bg-primary" />
            <p className="text-xs font-medium tracking-wider uppercase text-text-muted">
              Consumo Semanal
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-4xl text-foreground leading-none">{total}</h3>
            <span className="text-sm text-text-secondary font-medium">litros</span>
          </div>
          <p className="text-xs text-text-secondary mt-2">Últimos 7 días</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-primary/8 flex items-center justify-center">
          <Droplet className="w-5 h-5 text-primary" strokeWidth={1.75} />
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5DFD3" vertical={false} />
          <XAxis
            dataKey="day"
            stroke="#9C9687"
            fontSize={11}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#9C9687"
            fontSize={11}
            tickLine={false}
            axisLine={false}
            unit="L"
          />
          <Tooltip
            cursor={{ fill: '#F0ECE2' }}
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5DFD3',
              borderRadius: '8px',
              fontSize: '12px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#6B6557', marginBottom: '4px' }}
            itemStyle={{ color: '#0F1F1C' }}
            formatter={(value) => [`${value} L`, 'Consumo']}
          />
          <Bar dataKey="consumption" radius={[6, 6, 0, 0]}>
            {data.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={entry.consumption === max && max > 0 ? '#B8935A' : '#1B3B36'}
                fillOpacity={entry.consumption === max && max > 0 ? 1 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
