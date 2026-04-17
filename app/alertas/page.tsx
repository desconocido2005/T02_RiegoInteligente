'use client';

import { useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/form';
import { useStore } from '@/lib/store';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Bell,
  Droplets,
  WifiOff,
  Sparkles,
  AlertTriangle,
} from 'lucide-react';
import type { Alerta } from '@/lib/types';

export default function AlertasPage() {
  return (
    <AuthGuard>
      <AlertasContent />
    </AuthGuard>
  );
}

type AlertSeverity = 'critical' | 'warning' | 'info' | 'success';

function classifyAlert(a: Alerta): AlertSeverity {
  switch (a.tipo_alerta) {
    case 'humedad_critica':
      return 'critical';
    case 'falla_dispositivo':
      return 'warning';
    case 'riego_completado':
      return 'success';
    case 'riego_automatico':
      return 'info';
    case 'riego_detenido':
      return 'warning';
    default:
      return 'info';
  }
}

const ICONS: Record<AlertSeverity, typeof AlertCircle> = {
  critical: AlertCircle,
  warning: AlertTriangle,
  info: Droplets,
  success: Sparkles,
};

const STYLES: Record<AlertSeverity, { border: string; bg: string; iconBg: string; text: string; dot: string }> = {
  critical: {
    border: 'border-error/25',
    bg: 'bg-error/5',
    iconBg: 'bg-error/10',
    text: 'text-error',
    dot: 'bg-error',
  },
  warning: {
    border: 'border-warning/25',
    bg: 'bg-warning/5',
    iconBg: 'bg-warning/10',
    text: 'text-warning',
    dot: 'bg-warning',
  },
  info: {
    border: 'border-water/25',
    bg: 'bg-water/5',
    iconBg: 'bg-water/10',
    text: 'text-water',
    dot: 'bg-water',
  },
  success: {
    border: 'border-success/25',
    bg: 'bg-success/5',
    iconBg: 'bg-success/10',
    text: 'text-success',
    dot: 'bg-success',
  },
};

function formatRelative(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'Hace un momento';
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `Hace ${hrs} h`;
  const days = Math.round(hrs / 24);
  return `Hace ${days} d`;
}

function AlertasContent() {
  const { state, resolveAlerta, markAllRead } = useStore();

  const { active, resolved } = useMemo(() => {
    const active = state.alertas.filter((a) => !a.leido);
    const resolved = state.alertas.filter((a) => a.leido).slice(0, 10);
    return { active, resolved };
  }, [state.alertas]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-start justify-between gap-4 mb-8">
              <div>
                <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                  Notificaciones
                </p>
                <h1 className="font-display text-5xl text-foreground mb-2">Alertas</h1>
                <p className="text-text-secondary">
                  {active.length > 0
                    ? `${active.length} alerta${active.length === 1 ? '' : 's'} requiere${active.length === 1 ? '' : 'n'} atención.`
                    : 'Todo en orden. Sin alertas activas.'}
                </p>
              </div>
              {active.length > 0 && (
                <Button variant="outline" onClick={markAllRead}>
                  <CheckCircle className="w-4 h-4" />
                  Marcar todas como leídas
                </Button>
              )}
            </div>

            {/* Active */}
            <section className="mb-10">
              <h2 className="font-display text-2xl text-foreground mb-4">
                Alertas activas
              </h2>
              {active.length === 0 ? (
                <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
                  <div className="w-12 h-12 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Bell className="w-5 h-5 text-success" strokeWidth={1.75} />
                  </div>
                  <p className="text-text-secondary">
                    Nada pendiente por ahora. El sistema está monitoreando en segundo plano.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {active.map((a) => {
                    const sev = classifyAlert(a);
                    const style = STYLES[sev];
                    const Icon = ICONS[sev];
                    return (
                      <div
                        key={a.alerta_id}
                        className={`border rounded-xl p-5 flex items-start gap-4 ${style.border} ${style.bg}`}
                      >
                        <div
                          className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${style.iconBg}`}
                        >
                          <Icon className={`w-5 h-5 ${style.text}`} strokeWidth={1.75} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className={`w-1.5 h-1.5 rounded-full ${style.dot}`} />
                            <span className={`text-[10px] font-semibold uppercase tracking-widest ${style.text}`}>
                              {a.tipo_alerta?.replace(/_/g, ' ')}
                            </span>
                          </div>
                          <p className="text-sm text-foreground leading-relaxed">
                            {a.mensaje}
                          </p>
                          <p className="text-xs text-text-muted mt-2 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelative(a.fecha_creacion)}
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resolveAlerta(a.alerta_id)}
                        >
                          Resolver
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>

            {/* Resolved */}
            {resolved.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-foreground mb-4">
                  Historial reciente
                </h2>
                <div className="space-y-3">
                  {resolved.map((a) => {
                    const sev = classifyAlert(a);
                    const Icon = sev === 'success' ? Sparkles : sev === 'warning' ? WifiOff : CheckCircle;
                    return (
                      <div
                        key={a.alerta_id}
                        className="border border-border bg-card rounded-xl p-5 flex items-start gap-4 opacity-80"
                      >
                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center shrink-0">
                          <Icon className="w-5 h-5 text-text-muted" strokeWidth={1.75} />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-foreground">{a.mensaje}</p>
                          <p className="text-xs text-text-muted mt-1 inline-flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {formatRelative(a.fecha_creacion)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
