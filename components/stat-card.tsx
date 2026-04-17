interface StatCardProps {
  label: string;
  value: string;
  icon: string;
  color: 'primary' | 'secondary' | 'info' | 'success' | 'warning';
}

export function StatCard({ label, value, icon, color }: StatCardProps) {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    info: 'bg-info/10 text-info',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/30 transition-all duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-text-secondary uppercase tracking-wide font-medium">{label}</p>
          <p className="text-3xl font-bold text-foreground mt-2">{value}</p>
        </div>
        <div className={`${colorClasses[color]} p-4 rounded-lg text-2xl`}>
          {icon}
        </div>
      </div>
    </div>
  );
}
