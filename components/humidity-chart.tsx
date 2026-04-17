'use client';

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const data = [
  { time: '00:00', humidity: 65 },
  { time: '04:00', humidity: 58 },
  { time: '08:00', humidity: 72 },
  { time: '12:00', humidity: 68 },
  { time: '16:00', humidity: 55 },
  { time: '20:00', humidity: 75 },
  { time: '23:59', humidity: 70 },
];

export function HumidityChart() {
  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h3 className="text-lg font-semibold text-foreground mb-6">Humedad del Suelo (últimas 24h)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="time" stroke="var(--text-secondary)" />
          <YAxis stroke="var(--text-secondary)" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: `1px solid var(--border)`,
              borderRadius: '8px',
              color: 'var(--foreground)',
            }}
          />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="var(--primary)"
            strokeWidth={3}
            dot={{ fill: 'var(--primary)', r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
