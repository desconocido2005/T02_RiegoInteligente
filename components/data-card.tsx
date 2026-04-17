'use client';

import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface DataCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  unit?: string;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  color?: 'primary' | 'water' | 'success' | 'warning' | 'error' | 'accent';
}

const iconBg = {
  primary: 'bg-primary/8 text-primary',
  water: 'bg-water/8 text-water',
  success: 'bg-success/8 text-success',
  warning: 'bg-warning/8 text-warning',
  error: 'bg-error/8 text-error',
  accent: 'bg-accent/8 text-accent',
};

export function DataCard({
  icon: Icon,
  label,
  value,
  unit,
  change,
  changeType = 'neutral',
  color = 'primary',
}: DataCardProps) {
  const isPositive = changeType === 'positive';
  const isNegative = changeType === 'negative';

  return (
    <div className="group bg-card border border-border rounded-xl p-6 hover:border-border-strong hover:-translate-y-0.5 cursor-pointer">
      <div className="flex items-start justify-between mb-6">
        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${iconBg[color]}`}>
          <Icon className="w-5 h-5" strokeWidth={1.75} />
        </div>
        {change && (
          <div
            className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium ${
              isPositive
                ? 'bg-success/8 text-success'
                : isNegative
                ? 'bg-error/8 text-error'
                : 'bg-muted text-text-secondary'
            }`}
          >
            {isPositive && <ArrowUpRight className="w-3 h-3" strokeWidth={2.5} />}
            {isNegative && <ArrowDownRight className="w-3 h-3" strokeWidth={2.5} />}
            <span>{change}</span>
          </div>
        )}
      </div>

      <p className="text-xs font-medium tracking-wider uppercase text-text-muted mb-2">
        {label}
      </p>
      <div className="flex items-baseline gap-1.5">
        <p className="font-display text-4xl text-foreground leading-none">{value}</p>
        {unit && <span className="text-sm text-text-secondary font-medium">{unit}</span>}
      </div>
    </div>
  );
}
