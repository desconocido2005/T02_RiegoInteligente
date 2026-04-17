'use client';

import { useMemo } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { DataCard } from '@/components/data-card';
import { ZoneListCard } from '@/components/zone-list-card';
import { HumidityChart } from '@/components/humidity-chart';
import { ConsumptionChart } from '@/components/consumption-chart';
import { AuthGuard } from '@/components/auth-guard';
import { useStore } from '@/lib/store';
import { Droplet, Zap, TrendingUp, AlertCircle, Leaf } from 'lucide-react';

export default function Dashboard() {
  return (
    <AuthGuard>
      <DashboardContent />
    </AuthGuard>
  );
}

function DashboardContent() {
  const { state } = useStore();

  const kpis = useMemo(() => {
    const dispositivosOnline = state.dispositivos.filter(
      (d) => d.estado_actual === 'online',
    ).length;
    const totalDispositivos = state.dispositivos.length;
    const alertasActivas = state.alertas.filter((a) => !a.leido).length;
    const alertasCriticas = state.alertas.filter(
      (a) => !a.leido && a.tipo_alerta === 'humedad_critica',
    ).length;

    const today0 = new Date();
    today0.setHours(0, 0, 0, 0);
    const consumoHoy = state.historial
      .filter((h) => new Date(h.fecha_inicio).getTime() >= today0.getTime())
      .reduce((a, b) => a + Number(b.litros_consumidos), 0);
    const consumoEnCurso = Object.values(state.runtime).reduce(
      (a, r) => a + (r.regando ? r.litros_en_curso : 0),
      0,
    );

    const humedades = Object.values(state.runtime).map((r) => r.humedad_actual);
    const promedio = humedades.length
      ? Math.round(humedades.reduce((a, b) => a + b, 0) / humedades.length)
      : 0;

    return {
      consumoHoy: Math.round(consumoHoy + consumoEnCurso),
      promedio,
      dispositivosOnline,
      totalDispositivos,
      alertasActivas,
      alertasCriticas,
    };
  }, [state]);

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                Panel general
              </p>
              <h1 className="font-display text-5xl text-foreground mb-2">
                Hola, {state.auth?.nombre.split(' ')[0] || 'usuario'}.
              </h1>
              <p className="text-text-secondary text-lg">
                Tu sistema de riego inteligente está monitoreando{' '}
                <strong className="text-foreground">{state.zonas.length} zonas</strong> en
                tiempo real.
              </p>
            </div>

            {/* KPIs */}
            <section className="mb-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <DataCard
                  icon={Droplet}
                  label="Consumo hoy"
                  value={`${kpis.consumoHoy}`}
                  unit="L"
                  color="water"
                />
                <DataCard
                  icon={TrendingUp}
                  label="Humedad promedio"
                  value={`${kpis.promedio}`}
                  unit="%"
                  color="primary"
                />
                <DataCard
                  icon={Zap}
                  label="Dispositivos online"
                  value={`${kpis.dispositivosOnline}/${kpis.totalDispositivos}`}
                  change={
                    kpis.dispositivosOnline === kpis.totalDispositivos
                      ? 'Todos operativos'
                      : 'Revisar red'
                  }
                  changeType={
                    kpis.dispositivosOnline === kpis.totalDispositivos ? 'positive' : 'negative'
                  }
                  color="success"
                />
                <DataCard
                  icon={AlertCircle}
                  label="Alertas activas"
                  value={`${kpis.alertasActivas}`}
                  change={
                    kpis.alertasCriticas > 0 ? `${kpis.alertasCriticas} crítica(s)` : 'Sin críticas'
                  }
                  changeType={kpis.alertasCriticas > 0 ? 'negative' : 'positive'}
                  color={kpis.alertasCriticas > 0 ? 'error' : 'accent'}
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
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-display text-3xl text-foreground">Zonas de riego</h2>
                  <p className="text-sm text-text-secondary mt-1">
                    Monitoreo en vivo. El motor inteligente decide cuándo regar según los
                    umbrales configurados.
                  </p>
                </div>
              </div>
              {state.zonas.length === 0 ? (
                <div className="bg-card border border-dashed border-border rounded-xl p-12 text-center">
                  <Leaf className="w-8 h-8 text-text-muted mx-auto mb-3" strokeWidth={1.5} />
                  <p className="text-text-secondary">
                    Aún no tienes zonas. Crea tu primera desde el botón "Nueva Zona" arriba.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {state.zonas.map((zona) => (
                    <ZoneListCard key={zona.zona_id} zona={zona} />
                  ))}
                </div>
              )}
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
