'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { AuthGuard } from '@/components/auth-guard';
import { Button, Field, Input, Select, Switch } from '@/components/ui/form';
import { ConfigForm } from '@/components/forms/config-form';
import { ConfirmDialog } from '@/components/ui/confirm';
import { useStore } from '@/lib/store';
import { Save, Bell, Lock, Zap, Settings as Cog, Sprout, Sparkles, RotateCcw } from 'lucide-react';
import type { Zona } from '@/lib/types';

export default function ConfiguracionPage() {
  return (
    <AuthGuard>
      <ConfiguracionContent />
    </AuthGuard>
  );
}

const STORAGE_RESET_KEY = 'verdant:v1';

function ConfiguracionContent() {
  const { state, toast } = useStore();

  // General settings (stored only in this component's state — demo)
  const [nombreSistema, setNombreSistema] = useState('Verdant — Finca El Vergel');
  const [intervalo, setIntervalo] = useState('60');
  const [timezone, setTimezone] = useState('America/Lima');
  const [notifCriticas, setNotifCriticas] = useState(true);
  const [notifHumedad, setNotifHumedad] = useState(true);
  const [notifReportes, setNotifReportes] = useState(false);

  const [editing, setEditing] = useState<Zona | null>(null);
  const [resetOpen, setResetOpen] = useState(false);

  const configOf = (zonaId: string) => state.configs.find((c) => c.zona_id === zonaId);

  const handleSaveGeneral = (e: React.FormEvent) => {
    e.preventDefault();
    toast({ type: 'success', message: 'Preferencias generales guardadas' });
  };

  const handleReset = () => {
    try {
      localStorage.removeItem(STORAGE_RESET_KEY);
      toast({ type: 'info', message: 'Simulación reiniciada. Recargando…' });
      setTimeout(() => window.location.reload(), 600);
    } catch {
      toast({ type: 'error', message: 'No se pudo reiniciar la simulación' });
    }
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-8 max-w-4xl">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                Ajustes
              </p>
              <h1 className="font-display text-5xl text-foreground mb-2">Configuración</h1>
              <p className="text-text-secondary">
                Preferencias del sistema y riego inteligente por zona.
              </p>
            </div>

            <div className="space-y-6">
              {/* Riego inteligente por zona */}
              <section className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Sparkles className="w-5 h-5 text-primary" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-foreground leading-tight">
                      Riego inteligente por zona
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Define umbrales y modos automáticos para cada parcela.
                    </p>
                  </div>
                </div>

                {state.zonas.length === 0 ? (
                  <p className="text-sm text-text-secondary py-6 text-center">
                    Crea una zona primero para configurarla.
                  </p>
                ) : (
                  <div className="divide-y divide-border">
                    {state.zonas.map((z) => {
                      const cfg = configOf(z.zona_id);
                      return (
                        <div
                          key={z.zona_id}
                          className="py-4 flex items-center justify-between gap-4"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                              <Sprout className="w-4 h-4 text-success" strokeWidth={1.75} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-foreground truncate">
                                {z.nombre}
                              </p>
                              <div className="flex items-center gap-3 mt-0.5 text-xs text-text-secondary">
                                {cfg ? (
                                  <>
                                    <span>Umbral: {cfg.umbral_min_humedad}%</span>
                                    <span>·</span>
                                    <span>{cfg.duracion_minutos} min</span>
                                    <span>·</span>
                                    <span
                                      className={`font-medium ${
                                        cfg.es_automatico && cfg.activo
                                          ? 'text-success'
                                          : 'text-text-muted'
                                      }`}
                                    >
                                      {cfg.es_automatico && cfg.activo
                                        ? 'Auto activo'
                                        : cfg.es_automatico
                                          ? 'Auto pausado'
                                          : 'Manual'}
                                    </span>
                                  </>
                                ) : (
                                  <span className="text-warning">Sin configurar</span>
                                )}
                              </div>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" onClick={() => setEditing(z)}>
                            <Cog className="w-3.5 h-3.5" />
                            Configurar
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </section>

              {/* Preferencias generales */}
              <form
                onSubmit={handleSaveGeneral}
                className="bg-card border border-border rounded-xl p-6"
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-accent/15 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-accent" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-foreground leading-tight">
                      Preferencias generales
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Identidad y sincronización del sistema.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <Field label="Nombre del sistema" htmlFor="cfg-nombre">
                    <Input
                      id="cfg-nombre"
                      value={nombreSistema}
                      onChange={(e) => setNombreSistema(e.target.value)}
                    />
                  </Field>
                  <Field
                    label="Intervalo de sincronización"
                    htmlFor="cfg-interval"
                    hint="Segundos entre lecturas de sensores"
                  >
                    <Input
                      id="cfg-interval"
                      type="number"
                      min="10"
                      value={intervalo}
                      onChange={(e) => setIntervalo(e.target.value)}
                    />
                  </Field>
                  <Field label="Zona horaria" htmlFor="cfg-tz">
                    <Select
                      id="cfg-tz"
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                    >
                      <option>America/Lima</option>
                      <option>America/Bogota</option>
                      <option>America/Mexico_City</option>
                      <option>America/Buenos_Aires</option>
                      <option>Europe/Madrid</option>
                    </Select>
                  </Field>
                </div>

                <div className="flex justify-end mt-6 pt-5 border-t border-border">
                  <Button type="submit">
                    <Save className="w-4 h-4" />
                    Guardar preferencias
                  </Button>
                </div>
              </form>

              {/* Notificaciones */}
              <section className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-water/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-water" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-foreground leading-tight">
                      Notificaciones
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Controla qué alertas recibes.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <Switch
                    checked={notifCriticas}
                    onChange={setNotifCriticas}
                    label="Alertas críticas por email"
                    description="Falla de dispositivo, humedad crítica, etc."
                  />
                  <Switch
                    checked={notifHumedad}
                    onChange={setNotifHumedad}
                    label="Avisos de humedad baja"
                    description="Notificación cuando se activa riego automático."
                  />
                  <Switch
                    checked={notifReportes}
                    onChange={setNotifReportes}
                    label="Reportes semanales"
                    description="Resumen de consumo y eficiencia cada lunes."
                  />
                </div>
              </section>

              {/* Seguridad */}
              <section className="bg-card border border-border rounded-xl p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Lock className="w-5 h-5 text-primary" strokeWidth={1.75} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl text-foreground leading-tight">
                      Seguridad y datos
                    </h2>
                    <p className="text-xs text-text-secondary">
                      Acciones sobre tu cuenta y la simulación local.
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    variant="outline"
                    onClick={() => toast({ type: 'info', message: 'Función disponible próximamente' })}
                    className="w-full justify-start"
                  >
                    <Lock className="w-4 h-4" />
                    Cambiar contraseña
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() =>
                      toast({ type: 'info', message: 'Autenticación 2FA — próximamente' })
                    }
                    className="w-full justify-start"
                  >
                    <Lock className="w-4 h-4" />
                    Habilitar autenticación de dos factores
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setResetOpen(true)}
                    className="w-full justify-start border-error/30 text-error hover:bg-error/5 hover:border-error"
                  >
                    <RotateCcw className="w-4 h-4" />
                    Reiniciar datos de simulación
                  </Button>
                </div>
              </section>
            </div>
          </div>
        </main>
      </div>

      {editing && (
        <ConfigForm
          open={!!editing}
          onClose={() => setEditing(null)}
          zona={editing}
          config={configOf(editing.zona_id) || null}
        />
      )}

      <ConfirmDialog
        open={resetOpen}
        onClose={() => setResetOpen(false)}
        title="¿Reiniciar simulación?"
        message="Se borrarán todas las zonas, dispositivos, lecturas, alertas e historial, volviendo a los datos de ejemplo iniciales. Tu sesión continuará activa."
        confirmLabel="Reiniciar ahora"
        onConfirm={handleReset}
      />
    </div>
  );
}
