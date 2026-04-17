'use client';

import { useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { AuthGuard } from '@/components/auth-guard';
import { HumidityChart } from '@/components/humidity-chart';
import { DataCard } from '@/components/data-card';
import { useStore } from '@/lib/store';
import { TrendingUp, TrendingDown, Droplets, Activity } from 'lucide-react';

export default function HumedadPage() {
  return (
    <AuthGuard>
      <HumedadContent />
    </AuthGuard>
  );
}

function HumedadContent() {
  const { state } = useStore();

  const kpis = useMemo(() => {
    const valores = state.lecturas.map((l) => Number(l.valor_humedad));
    const actuales = Object.values(state.runtime).map((r) => r.humedad_actual);
    const promedio = actuales.length
      ? Math.round(actuales.reduce((a, b) => a + b, 0) / actuales.length)
      : 0;
    const max = valores.length ? Math.max(...valores) : 0;
    const min = valores.length ? Math.min(...valores) : 0;
    const variabilidad = max - min;
    return { promedio, max: Math.round(max), min: Math.round(min), variabilidad: Math.round(variabilidad) };
  }, [state.lecturas, state.runtime]);

  // Per-zone breakdown
  const zonasBreakdown = state.zonas.map((z) => {
    const rt = state.runtime[z.zona_id];
    const config = state.configs.find((c) => c.zona_id === z.zona_id);
    return {
      ...z,
      humedad: rt?.humedad_actual || 0,
      temperatura: rt?.temperatura || 0,
      regando: rt?.regando || false,
      umbral: config?.umbral_min_humedad || 0,
    };
  });

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                Sensores
              </p>
              <h1 className="font-display text-5xl text-foreground mb-2">
                Análisis de humedad
              </h1>
              <p className="text-text-secondary">
                Lecturas agregadas del suelo en tiempo real.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DataCard
                icon={Droplets}
                label="Humedad actual"
                value={`${kpis.promedio}`}
                unit="%"
                color="primary"
              />
              <DataCard
                icon={TrendingUp}
                label="Máxima registrada"
                value={`${kpis.max}`}
                unit="%"
                color="success"
              />
              <DataCard
                icon={TrendingDown}
                label="Mínima registrada"
                value={`${kpis.min}`}
                unit="%"
                color="warning"
              />
              <DataCard
                icon={Activity}
                label="Variabilidad"
                value={`${kpis.variabilidad}`}
                unit="%"
                color="water"
              />
            </div>

            <div className="mb-8">
              <HumidityChart />
            </div>

            <section>
              <h2 className="font-display text-2xl text-foreground mb-4">
                Humedad por zona
              </h2>
              <div className="bg-card border border-border rounded-xl p-2">
                {zonasBreakdown.length === 0 ? (
                  <div className="p-12 text-center text-text-secondary">
                    No hay zonas para mostrar.
                  </div>
                ) : (
                  <div className="divide-y divide-border">
                    {zonasBreakdown.map((z) => {
                      const barColor =
                        z.humedad > 60
                          ? 'bg-success'
                          : z.humedad > 40
                            ? 'bg-warning'
                            : 'bg-error';
                      return (
                        <div key={z.zona_id} className="p-5">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="text-sm font-semibold text-foreground">
                                {z.nombre}
                              </p>
                              <p className="text-xs text-text-muted mt-0.5">
                                {z.tipo_cultivo || 'Sin cultivo'} · {z.temperatura.toFixed(1)}°C
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-2xl font-display text-foreground tabular-nums">
                                {z.humedad.toFixed(1)}%
                              </p>
                              {z.regando && (
                                <span className="text-[10px] uppercase tracking-widest text-water font-semibold">
                                  Regando ahora
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
                            <div
                              className={`h-full ${barColor} rounded-full`}
                              style={{ width: `${Math.min(100, z.humedad)}%` }}
                            />
                            {z.umbral > 0 && (
                              <div
                                className="absolute top-0 bottom-0 w-0.5 bg-foreground/40"
                                style={{ left: `${z.umbral}%` }}
                                title={`Umbral: ${z.umbral}%`}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
