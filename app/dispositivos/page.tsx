'use client';

import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { Zap, Plus } from 'lucide-react';

const devices = [
  { id: 1, name: 'Sensor Humedad #1', zone: 'Zona Norte', type: 'Sensor', status: 'Conectado', battery: '95%' },
  { id: 2, name: 'Válvula Solenoide #1', zone: 'Zona Norte', type: 'Actuador', status: 'Conectado', battery: '100%' },
  { id: 3, name: 'Sensor Humedad #2', zone: 'Zona Sur', type: 'Sensor', status: 'Conectado', battery: '87%' },
  { id: 4, name: 'Válvula Solenoide #2', zone: 'Zona Sur', type: 'Actuador', status: 'Desconectado', battery: '45%' },
  { id: 5, name: 'Termómetro #1', zone: 'Zona Este', type: 'Sensor', status: 'Conectado', battery: '92%' },
  { id: 6, name: 'Válvula Solenoide #3', zone: 'Zona Este', type: 'Actuador', status: 'Conectado', battery: '88%' },
];

export default function DispositivosPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Dispositivos</h1>
                <p className="text-text-secondary">Gestiona sensores y actuadores</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                <Plus size={20} />
                Nuevo Dispositivo
              </button>
            </div>

            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Nombre</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Zona</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Tipo</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Estado</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">Batería</th>
                  </tr>
                </thead>
                <tbody>
                  {devices.map((device) => (
                    <tr key={device.id} className="border-b border-border hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 text-sm font-medium text-foreground flex items-center gap-2">
                        <Zap size={16} className="text-secondary" />
                        {device.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary">{device.zone}</td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-block px-3 py-1 rounded-full bg-secondary/10 text-secondary text-xs font-medium">
                          {device.type}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                          device.status === 'Conectado'
                            ? 'bg-success/10 text-success'
                            : 'bg-error/10 text-error'
                        }`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm font-medium text-foreground">{device.battery}</td>
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
