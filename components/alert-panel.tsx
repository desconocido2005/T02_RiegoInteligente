interface Alert {
  id: string;
  type: 'error' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
}

interface AlertPanelProps {
  alerts: Alert[];
}

export function AlertPanel({ alerts }: AlertPanelProps) {
  const alertStyles = {
    error: {
      bg: 'bg-error/10',
      border: 'border-error/30',
      icon: '🔴',
      text: 'text-error',
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning/30',
      icon: '⚠️',
      text: 'text-warning',
    },
    info: {
      bg: 'bg-info/10',
      border: 'border-info/30',
      icon: 'ℹ️',
      text: 'text-info',
    },
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
        <span className="text-2xl">📢</span>
        Alertas del Sistema
      </h2>

      {alerts.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-text-secondary">No hay alertas activas</p>
          <p className="text-sm text-text-secondary mt-1">Todo está funcionando correctamente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alerts.map((alert) => {
            const style = alertStyles[alert.type];
            return (
              <div 
                key={alert.id}
                className={`${style.bg} border ${style.border} rounded-lg p-4 hover:shadow-sm transition-all duration-200`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl mt-0.5">{style.icon}</span>
                  <div className="flex-1">
                    <p className={`font-medium ${style.text}`}>{alert.title}</p>
                    <p className="text-sm text-foreground mt-1">{alert.message}</p>
                    <p className="text-xs text-text-secondary mt-2">{alert.time}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
