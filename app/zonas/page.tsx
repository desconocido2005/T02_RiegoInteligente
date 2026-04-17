'use client';

import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { ZoneListCard } from '@/components/zone-list-card';
import { Plus } from 'lucide-react';

const zones = [
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
  {
    id: '4',
    name: 'Zona Oeste - Huerto',
    humidity: 68,
    temperature: 25,
    status: 'active' as const,
    lastWatered: 'Hace 1 hora',
  },
];

export default function ZonasPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Zonas de Riego</h1>
                <p className="text-text-secondary">Monitorea todas tus zonas en tiempo real</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                <Plus size={20} />
                Nueva Zona
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {zones.map((zone) => (
                <ZoneListCard key={zone.id} {...zone} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
