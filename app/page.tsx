'use client';

import { Header } from '@/components/header';
import { ZoneCard } from '@/components/zone-card';
import { AlertPanel } from '@/components/alert-panel';
import { StatCard } from '@/components/stat-card';

const mockZones = [
  {
    id: '1',
    name: 'Zona Norte - Cultivos A',
    humidity: 65,
    temperature: 28,
    soilMoisture: 75,
    status: 'active' as const,
    lastWatered: 'Hace 2 horas',
  },
  {
    id: '2',
    name: 'Zona Sur - Cultivos B',
    humidity: 58,
    temperature: 26,
    soilMoisture: 45,
    status: 'idle' as const,
    lastWatered: 'Hace 4 horas',
  },
  {
    id: '3',
    name: 'Zona Este - Invernadero',
    humidity: 72,
    temperature: 30,
    soilMoisture: 25,
    status: 'alert' as const,
    lastWatered: 'Hace 6 horas',
  },
];

const mockAlerts = [
  {
    id: '1',
    type: 'error' as const,
    title: 'Humedad baja en Zona Este',
    message: 'La humedad del suelo ha caído por debajo del 30%. Se recomienda riego inmediato.',
    time: 'Hace 15 minutos',
  },
  {
    id: '2',
    type: 'warning' as const,
    title: 'Temperatura elevada',
    message: 'La temperatura en el invernadero supera los 30°C. Considera activar ventilación.',
    time: 'Hace 1 hora',
  },
];

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Estadísticas generales */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Resumen del Sistema</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <StatCard 
              label="Zonas Activas" 
              value="1" 
              icon="🌱"
              color="primary"
            />
            <StatCard 
              label="Consumo Hoy" 
              value="245L" 
              icon="💧"
              color="info"
            />
            <StatCard 
              label="Promedio Humedad" 
              value="65%" 
              icon="💨"
              color="secondary"
            />
            <StatCard 
              label="Sistema Operativo" 
              value="100%" 
              icon="✅"
              color="success"
            />
          </div>
        </section>

        {/* Zonas de riego */}
        <section className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-6">Zonas de Riego</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mockZones.map((zone) => (
              <ZoneCard key={zone.id} {...zone} />
            ))}
          </div>
        </section>

        {/* Alertas */}
        <section>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <AlertPanel alerts={mockAlerts} />
            </div>

            {/* Panel lateral de información */}
            <div className="bg-card border border-border rounded-lg p-6">
              <h2 className="text-xl font-semibold text-foreground mb-4 flex items-center gap-2">
                <span className="text-2xl">⚙️</span>
                Sistema
              </h2>
              <div className="space-y-4">
                <div className="pb-4 border-b border-border">
                  <p className="text-sm text-text-secondary uppercase tracking-wide">Última sincronización</p>
                  <p className="text-lg font-semibold text-foreground mt-1">Hace 2 minutos</p>
                </div>
                <div className="pb-4 border-b border-border">
                  <p className="text-sm text-text-secondary uppercase tracking-wide">Próxima evaluación</p>
                  <p className="text-lg font-semibold text-foreground mt-1">En 5 minutos</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary uppercase tracking-wide">Versión del sistema</p>
                  <p className="text-lg font-semibold text-foreground mt-1">v2.1.0</p>
                </div>
              </div>

              <button className="w-full mt-6 bg-accent text-primary font-medium py-2 rounded-lg hover:opacity-90 transition-all duration-200">
                Configurar Sistema
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white mt-12">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <p className="text-center text-sm text-green-100">
            © 2024 Sistema de Riego Inteligente. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
