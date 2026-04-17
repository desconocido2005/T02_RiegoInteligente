'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

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
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Consumo de agua semanal</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="day" stroke="var(--text-secondary)" />
          <YAxis stroke="var(--text-secondary)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`,
              borderRadius: '8px',
              color: 'var(--foreground)',
            }}
          />
          <Bar
            dataKey="consumption"
            fill="var(--secondary)"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
