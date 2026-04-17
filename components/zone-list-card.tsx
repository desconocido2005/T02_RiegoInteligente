'use client';

import { ChevronRight, AlertCircle, CheckCircle, Clock } from 'lucide-react';

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
    bg: 'bg-success/10',
    text: 'text-success',
    label: 'Activo',
    icon: CheckCircle,
  },
  idle: {
    bg: 'bg-gray-100',
    text: 'text-gray-600',
    label: 'En reposo',
    icon: Clock,
  },
  alert: {
    bg: 'bg-error/10',
    text: 'text-error',
    label: 'Alerta',
    icon: AlertCircle,
  },
};

export function ZoneListCard({ name, humidity, temperature, status, lastWatered }: ZoneListCardProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300 cursor-pointer group">
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1">
          <h3 className="font-semibold text-foreground mb-2">{name}</h3>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg}`}>
            <Icon size={16} className={config.text} />
            <span className={`text-sm font-medium ${config.text}`}>{config.label}</span>
          </div>
        </div>
        <ChevronRight
          size={20}
          className="text-text-secondary group-hover:text-primary transition-colors"
        />
      </div>

      <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wide font-medium mb-1">
            Humedad
          </p>
          <p className="text-2xl font-bold text-foreground">{humidity}%</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wide font-medium mb-1">
            Temperatura
          </p>
          <p className="text-2xl font-bold text-foreground">{temperature}°C</p>
        </div>
        <div>
          <p className="text-xs text-text-secondary uppercase tracking-wide font-medium mb-1">
            Último riego
          </p>
          <p className="text-sm font-semibold text-foreground">{lastWatered}</p>
        </div>
      </div>
    </div>
  );
}
