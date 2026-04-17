'use client';

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

const data = [
  { day: 'Lun', consumption: 120 },
  { day: 'Mar', consumption: 145 },
  { day: 'Mié', consumption: 98 },
  { day: 'Jue', consumption: 167 },
  { day: 'Vie', consumption: 134 },
  { day: 'Sáb', consumption: 156 },
  { day: 'Dom', consumption: 142 },
];

export function ConsumptionChart() {
  const total = data.reduce((a, b) => a + b.consumption, 0);
  const max = Math.max(...data.map((d) => d.consumption));

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
                fill={entry.consumption === max ? '#B8935A' : '#1B3B36'}
                fillOpacity={entry.consumption === max ? 1 : 0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
