'use client';

import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { DataCard } from '@/components/data-card';
import { ZoneListCard } from '@/components/zone-list-card';
import { HumidityChart } from '@/components/humidity-chart';
import { ConsumptionChart } from '@/components/consumption-chart';
import {
  Droplet,
  Zap,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';

const mockZones = [
  {
    id: '1',
    name: 'Zona Norte - Cultivos A',
    humidity: 65,
    temperature: 28,
    status: 'active' as const,
    lastWatered: 'Hace 2 horas',
  },
  {
    id: '2',
    name: 'Zona Sur - Cultivos B',
    humidity: 58,
    temperature: 26,
    status: 'idle' as const,
    lastWatered: 'Hace 4 horas',
  },
  {
    id: '3',
    name: 'Zona Este - Invernadero',
    humidity: 72,
    temperature: 30,
    status: 'alert' as const,
    lastWatered: 'Hace 6 horas',
  },
];

export default function Dashboard() {
  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        {/* TopBar */}
        <TopBar />

        {/* Content */}
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard</h1>
              <p className="text-text-secondary">
                Bienvenido al sistema de riego inteligente
              </p>
            </div>

            {/* KPIs */}
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DataCard
                  icon={Droplet}
                  label="Consumo Hoy"
                  value="245L"
                  change="+12%"
                  changeType="positive"
                  color="info"
                />
                <DataCard
                  icon={TrendingUp}
                  label="Promedio Humedad"
                  value="65%"
                  change="-3%"
                  changeType="negative"
                  color="primary"
                />
                <DataCard
                  icon={Zap}
                  label="Dispositivos Activos"
                  value="8"
                  change="Todos bien"
                  changeType="positive"
                  color="success"
                />
                <DataCard
                  icon={AlertCircle}
                  label="Alertas Activas"
                  value="2"
                  change="1 crítica"
                  changeType="negative"
                  color="error"
                />
              </div>
            </section>

            {/* Charts */}
            <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <HumidityChart />
              <ConsumptionChart />
            </section>

            {/* Zonas */}
            <section>
              <h2 className="text-2xl font-bold text-foreground mb-6">Zonas de Riego</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockZones.map((zone) => (
                  <ZoneListCard key={zone.id} {...zone} />
                ))}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
