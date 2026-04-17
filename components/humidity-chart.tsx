'use client';

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp } from 'lucide-react';

const data = [
  { time: '00:00', humidity: 62 },
  { time: '04:00', humidity: 58 },
  { time: '08:00', humidity: 55 },
  { time: '12:00', humidity: 48 },
  { time: '16:00', humidity: 52 },
  { time: '20:00', humidity: 65 },
  { time: '24:00', humidity: 68 },
];

export function HumidityChart() {
  const avg = Math.round(data.reduce((a, b) => a + b.humidity, 0) / data.length);

  return (
    <div className="bg-card border border-border rounded-xl p-6 hover:border-border-strong">
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-1 h-1 rounded-full bg-water" />
            <p className="text-xs font-medium tracking-wider uppercase text-text-muted">
              Humedad Promedio
            </p>
          </div>
          <div className="flex items-baseline gap-2">
            <h3 className="font-display text-4xl text-foreground leading-none">{avg}%</h3>
            <div className="flex items-center gap-1 text-success">
              <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
              <span className="text-xs font-medium">+4.2%</span>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-2">Últimas 24 horas</p>
        </div>
        <div className="flex gap-1">
          {['24H', '7D', '30D'].map((period, i) => (
            <button
              key={period}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                i === 0
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:bg-muted'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="humidityGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5B8FA8" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#5B8FA8" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5DFD3" vertical={false} />
          <XAxis
            dataKey="time"
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
            unit="%"
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5DFD3',
              borderRadius: '8px',
              fontSize: '12px',
              padding: '8px 12px',
            }}
            labelStyle={{ color: '#6B6557', marginBottom: '4px' }}
            itemStyle={{ color: '#0F1F1C' }}
          />
          <Area
            type="monotone"
            dataKey="humidity"
            stroke="#5B8FA8"
            strokeWidth={2}
            fill="url(#humidityGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
