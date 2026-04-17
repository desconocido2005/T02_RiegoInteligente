'use client';

import { ArrowUpRight, Droplets, Thermometer, Clock } from 'lucide-react';

interface ZoneListCardProps {
  id: string;
  name: string;
  humidity: number;
  temperature: number;
  status: 'active' | 'idle' | 'alert';
  lastWatered: string;
}

const statusConfig = {
  active: {
    dot: 'bg-success',
    ring: 'bg-success/20',
    label: 'Activa',
    color: 'text-success',
  },
  idle: {
    dot: 'bg-text-muted',
    ring: 'bg-text-muted/20',
    label: 'En reposo',
    color: 'text-text-secondary',
  },
  alert: {
    dot: 'bg-error',
    ring: 'bg-error/20',
    label: 'Atención',
    color: 'text-error',
  },
};

export function ZoneListCard({ name, humidity, temperature, status, lastWatered }: ZoneListCardProps) {
  const config = statusConfig[status];

  // Moisture bar
  const moistureColor =
    humidity > 60 ? 'bg-success' : humidity > 40 ? 'bg-warning' : 'bg-error';

  return (
    <div className="group relative bg-card border border-border rounded-xl p-6 hover:border-border-strong hover:-translate-y-0.5 cursor-pointer overflow-hidden">
      {/* Subtle accent line */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100" />

      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <div className="relative flex items-center justify-center">
              <div className={`absolute w-3 h-3 rounded-full ${config.ring} animate-pulse`} />
              <div className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
            </div>
            <span className={`text-xs font-medium tracking-wide uppercase ${config.color}`}>
              {config.label}
            </span>
          </div>
          <h3 className="font-display text-2xl text-foreground leading-tight truncate">
            {name}
          </h3>
        </div>
        <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center group-hover:bg-primary group-hover:border-primary shrink-0 ml-3">
          <ArrowUpRight
            className="w-3.5 h-3.5 text-text-secondary group-hover:text-primary-foreground"
            strokeWidth={2}
          />
        </div>
      </div>

      {/* Moisture bar */}
      <div className="mb-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <Droplets className="w-3.5 h-3.5 text-water" strokeWidth={1.75} />
            <span className="text-xs text-text-secondary font-medium">Humedad del suelo</span>
          </div>
          <span className="text-sm font-semibold text-foreground">{humidity}%</span>
        </div>
        <div className="h-1.5 bg-muted rounded-full overflow-hidden">
          <div
            className={`h-full ${moistureColor} rounded-full`}
            style={{ width: `${humidity}%` }}
          />
        </div>
      </div>

      {/* Details */}
      <div className="grid grid-cols-2 gap-4 pt-5 border-t border-border">
        <div className="flex items-center gap-2.5">
          <Thermometer className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Temp.</p>
            <p className="text-sm font-semibold text-foreground">{temperature}°C</p>
          </div>
        </div>
        <div className="flex items-center gap-2.5">
          <Clock className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
          <div>
            <p className="text-[10px] uppercase tracking-wider text-text-muted">Último riego</p>
            <p className="text-sm font-semibold text-foreground">{lastWatered}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
