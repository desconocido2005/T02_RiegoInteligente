interface ZoneCardProps {
  id: string;
  name: string;
  humidity: number;
  temperature: number;
  soilMoisture: number;
  status: 'active' | 'idle' | 'alert';
  lastWatered: string;
}

export function ZoneCard({ 
  name, 
  humidity, 
  temperature, 
  soilMoisture, 
  status,
  lastWatered 
}: ZoneCardProps) {
  const statusColor = {
    active: 'bg-success/10 text-success border-success/30',
    idle: 'bg-accent/10 text-accent border-accent/30',
    alert: 'bg-warning/10 text-warning border-warning/30',
  };

  const statusLabel = {
    active: 'Regando',
    idle: 'En espera',
    alert: 'Alerta',
  };

  const getMoistureColor = (value: number) => {
    if (value < 30) return 'text-error';
    if (value < 60) return 'text-warning';
    return 'text-success';
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-md hover:border-primary/30 transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-foreground">{name}</h3>
          <p className="text-sm text-text-secondary mt-1">{lastWatered}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${statusColor[status]}`}>
          {statusLabel[status]}
        </span>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-background rounded p-3">
          <p className="text-xs text-text-secondary uppercase tracking-wide">Humedad</p>
          <p className="text-2xl font-bold text-primary mt-2">{humidity}%</p>
        </div>
        <div className="bg-background rounded p-3">
          <p className="text-xs text-text-secondary uppercase tracking-wide">Temperatura</p>
          <p className="text-2xl font-bold text-info mt-2">{temperature}°C</p>
        </div>
        <div className="bg-background rounded p-3">
          <p className="text-xs text-text-secondary uppercase tracking-wide">Humedad Suelo</p>
          <p className={`text-2xl font-bold mt-2 ${getMoistureColor(soilMoisture)}`}>
            {soilMoisture}%
          </p>
        </div>
      </div>

      <button className="w-full mt-4 bg-primary text-white py-2 rounded-lg font-medium hover:bg-opacity-90 transition-all duration-200">
        Controlar zona
      </button>
    </div>
  );
}
