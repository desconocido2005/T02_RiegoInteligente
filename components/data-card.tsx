'use client';

import { LucideIcon } from 'lucide-react';

interface DataCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color: 'primary' | 'info' | 'success' | 'warning' | 'error';
}

const colorClasses = {
  primary: 'bg-primary/10 text-primary',
  info: 'bg-info/10 text-info',
  success: 'bg-success/10 text-success',
  warning: 'bg-warning/10 text-warning',
  error: 'bg-error/10 text-error',
};

const changeColors = {
  positive: 'text-success',
  negative: 'text-error',
  neutral: 'text-text-secondary',
};

export function DataCard({
  icon: Icon,
  label,
  value,
  change,
  changeType = 'neutral',
  color,
}: DataCardProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:border-primary/30 hover:shadow-lg transition-all duration-300">
      <div className="flex items-start justify-between mb-4">
        <div className={`p-3 rounded-lg ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        {change && (
          <span className={`text-sm font-semibold ${changeColors[changeType]}`}>
            {change}
          </span>
        )}
      </div>

      <p className="text-sm text-text-secondary font-medium uppercase tracking-wide mb-2">
        {label}
      </p>
      <p className="text-3xl font-bold text-foreground">{value}</p>
    </div>
  );
}
