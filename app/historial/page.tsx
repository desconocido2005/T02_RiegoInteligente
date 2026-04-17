'use client';

import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { ConsumptionChart } from '@/components/consumption-chart';
import { Calendar } from 'lucide-react';

const history = [
  { id: 1, date: '2024-03-15', event: 'Riego automático', zone: 'Zona Norte', duration: '45 min', waterUsed: '120L' },
  { id: 2, date: '2024-03-15', event: 'Calibración de sensor', zone: 'Zona Sur', duration: '-', waterUsed: '-' },
  { id: 3, date: '2024-03-14', event: 'Riego manual', zone: 'Zona Este', duration: '30 min', waterUsed: '85L' },
  { id: 4, date: '2024-03-14', event: 'Alerta resuelta', zone: 'Zona Oeste', duration: '-', waterUsed: '-' },
  { id: 5, date: '2024-03-13', event: 'Riego automático', zone: 'Zona Norte', duration: '50 min', waterUsed: '135L' },
  { id: 6, date: '2024-03-13', event: 'Cambio de configuración', zone: 'Sistema', duration: '-', waterUsed: '-' },
];

export default function HistorialPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Historial de Eventos</h1>
              <p className="text-text-secondary mb-8">Revisa el registro completo de actividades</p>
            </div>

            {/* Chart */}
            <div className="mb-8">
              <ConsumptionChart />
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground flex items-center gap-2">
                      <Calendar size={16} />
                      Fecha
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Evento</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Zona</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Duración</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Agua Usada</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((item) => (
                    <tr key={item.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.date}</td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{item.event}</td>
                      <td className="px-6 py-4 text-sm text-foreground">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                          {item.zone}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.duration}</td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{item.waterUsed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
