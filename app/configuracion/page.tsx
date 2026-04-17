'use client';

import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { Save, Bell, Lock, Zap } from 'lucide-react';

export default function ConfiguracionPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-8">Configuración</h1>
            </div>

            {/* Settings Sections */}
            <div className="space-y-8 max-w-2xl">
              {/* General Settings */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Zap size={20} className="text-primary" />
                  Configuración General
                </h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Nombre del Sistema
                    </label>
                    <input
                      type="text"
                      defaultValue="RiegoIA - Finca El Vergel"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Intervalo de Sincronización (segundos)
                    </label>
                    <input
                      type="number"
                      defaultValue="60"
                      className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Zona Horaria
                    </label>
                    <select className="w-full px-4 py-2 border border-border rounded-lg bg-white text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20 transition-colors">
                      <option>America/Bogota</option>
                      <option>America/Mexico_City</option>
                      <option>America/New_York</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Notification Settings */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Bell size={20} className="text-primary" />
                  Notificaciones
                </h2>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border" />
                    <span className="text-sm font-medium text-foreground">Alertas críticas por email</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-border" />
                    <span className="text-sm font-medium text-foreground">Alertas de humedad baja</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors">
                    <input type="checkbox" className="w-4 h-4 rounded border-border" />
                    <span className="text-sm font-medium text-foreground">Reportes semanales</span>
                  </label>
                </div>
              </div>

              {/* Security Settings */}
              <div className="bg-card border border-border rounded-lg p-6">
                <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
                  <Lock size={20} className="text-primary" />
                  Seguridad
                </h2>
                <div className="space-y-4">
                  <button className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-gray-50 transition-colors font-medium">
                    Cambiar Contraseña
                  </button>
                  <button className="w-full px-4 py-2 border border-border rounded-lg text-foreground hover:bg-gray-50 transition-colors font-medium">
                    Habilitar Autenticación de Dos Factores
                  </button>
                  <button className="w-full px-4 py-2 border border-error text-error rounded-lg hover:bg-error/5 transition-colors font-medium">
                    Cerrar todas las sesiones
                  </button>
                </div>
              </div>

              {/* Save Button */}
              <button className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-semibold">
                <Save size={20} />
                Guardar Cambios
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
