'use client';

import { useMemo, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStore } from '@/lib/store';

const PERIODS = {
  '24H': 24,
  '7D': 24 * 7,
  '30D': 24 * 30,
} as const;

type Period = keyof typeof PERIODS;

export function HumidityChart() {
  const { state } = useStore();
  const [period, setPeriod] = useState<Period>('24H');

  const data = useMemo(() => {
    const hours = PERIODS[period];
    const now = Date.now();
    const since = now - hours * 60 * 60 * 1000;
    const byBucket = new Map<string, { sum: number; count: number; ts: number }>();

    const isShortPeriod = period === '24H';

    state.lecturas
      .filter((l) => new Date(l.fecha_hora).getTime() >= since)
      .forEach((l) => {
        const d = new Date(l.fecha_hora);
        const key = isShortPeriod
          ? `${d.getHours().toString().padStart(2, '0')}:00`
          : `${d.getMonth() + 1}/${d.getDate()}`;
        const bucket = byBucket.get(key);
        if (bucket) {
          bucket.sum += l.valor_humedad;
          bucket.count += 1;
        } else {
          byBucket.set(key, { sum: l.valor_humedad, count: 1, ts: d.getTime() });
        }
      });

    return Array.from(byBucket.entries())
      .map(([time, v]) => ({ time, humidity: Math.round(v.sum / v.count), ts: v.ts }))
      .sort((a, b) => a.ts - b.ts);
  }, [state.lecturas, period]);

  const avg = data.length
    ? Math.round(data.reduce((a, b) => a + b.humidity, 0) / data.length)
    : 0;

  const trend = data.length >= 2 ? data[data.length - 1].humidity - data[0].humidity : 0;
  const trendPositive = trend >= 0;

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
            <div
              className={`flex items-center gap-1 ${
                trendPositive ? 'text-success' : 'text-warning'
              }`}
            >
              {trendPositive ? (
                <TrendingUp className="w-3.5 h-3.5" strokeWidth={2} />
              ) : (
                <TrendingDown className="w-3.5 h-3.5" strokeWidth={2} />
              )}
              <span className="text-xs font-medium">
                {trendPositive ? '+' : ''}
                {trend.toFixed(1)}%
              </span>
            </div>
          </div>
          <p className="text-xs text-text-secondary mt-2">
            {period === '24H'
              ? 'Últimas 24 horas'
              : period === '7D'
                ? 'Últimos 7 días'
                : 'Últimos 30 días'}
          </p>
        </div>
        <div className="flex gap-1">
          {(['24H', '7D', '30D'] as Period[]).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-md ${
                period === p
                  ? 'bg-primary text-primary-foreground'
                  : 'text-text-secondary hover:bg-muted'
              }`}
            >
              {p}
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
            domain={[0, 100]}
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
            formatter={(value) => [`${value}%`, 'Humedad']}
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
