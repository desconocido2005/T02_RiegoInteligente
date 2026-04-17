'use client';

import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { AlertCircle, CheckCircle, Clock } from 'lucide-react';

const alerts = [
  {
    id: 1,
    title: 'Humedad baja en Zona Este',
    message: 'La humedad ha caído a 25%. Se requiere riego inmediato.',
    type: 'error',
    time: 'Hace 15 minutos',
    zone: 'Zona Este',
  },
  {
    id: 2,
    title: 'Temperatura elevada',
    message: 'Temperatura de 32°C en invernadero. Considera ventilación.',
    type: 'warning',
    time: 'Hace 1 hora',
    zone: 'Zona Este',
  },
  {
    id: 3,
    title: 'Dispositivo desconectado',
    message: 'Válvula Solenoide #2 se desconectó de la red.',
    type: 'error',
    time: 'Hace 3 horas',
    zone: 'Zona Sur',
  },
  {
    id: 4,
    title: 'Batería baja',
    message: 'Sensor Humedad #3 con batería al 15%.',
    type: 'warning',
    time: 'Hace 5 horas',
    zone: 'Zona Oeste',
  },
];

const resolvedAlerts = [
  {
    id: 5,
    title: 'Riego completado',
    message: 'Zona Norte ha alcanzado humedad óptima.',
    zone: 'Zona Norte',
    resolvedTime: 'Hace 2 horas',
  },
];

export default function AlertasPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Alertas del Sistema</h1>
              <p className="text-text-secondary mb-8">Monitorea todos los eventos importantes</p>
            </div>

            {/* Active Alerts */}
            <div className="mb-8">
              <h2 className="text-xl font-bold text-foreground mb-4">Alertas Activas</h2>
              <div className="space-y-4">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`border rounded-lg p-6 flex items-start gap-4 ${
                      alert.type === 'error'
                        ? 'bg-error/5 border-error/20'
                        : 'bg-warning/5 border-warning/20'
                    }`}
                  >
                    <div className={`p-3 rounded-lg ${
                      alert.type === 'error'
                        ? 'bg-error/10'
                        : 'bg-warning/10'
                    }`}>
                      <AlertCircle
                        size={24}
                        className={alert.type === 'error' ? 'text-error' : 'text-warning'}
                      />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
                      <p className="text-sm text-text-secondary mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span>{alert.zone}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {alert.time}
                        </span>
                      </div>
                    </div>
                    <button className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium text-sm whitespace-nowrap">
                      Resolver
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Resolved Alerts */}
            <div>
              <h2 className="text-xl font-bold text-foreground mb-4">Alertas Resueltas</h2>
              <div className="space-y-4">
                {resolvedAlerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="border border-success/20 bg-success/5 rounded-lg p-6 flex items-start gap-4"
                  >
                    <div className="p-3 rounded-lg bg-success/10">
                      <CheckCircle size={24} className="text-success" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-1">{alert.title}</h3>
                      <p className="text-sm text-text-secondary mb-2">{alert.message}</p>
                      <div className="flex items-center gap-4 text-xs text-text-secondary">
                        <span>{alert.zone}</span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} />
                          {alert.resolvedTime}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
