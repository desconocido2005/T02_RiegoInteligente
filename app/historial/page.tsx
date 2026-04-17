'use client';

import { useMemo, useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { AuthGuard } from '@/components/auth-guard';
import { ConsumptionChart } from '@/components/consumption-chart';
import { useStore } from '@/lib/store';
import { Calendar, Droplet, Cpu, User } from 'lucide-react';

export default function HistorialPage() {
  return (
    <AuthGuard>
      <HistorialContent />
    </AuthGuard>
  );
}

function HistorialContent() {
  const { state } = useStore();
  const [filter, setFilter] = useState<'all' | 'sistema' | 'manual'>('all');

  const filtered = useMemo(() => {
    const base = filter === 'all' ? state.historial : state.historial.filter((h) => h.activado_por === filter);
    return base.slice(0, 100);
  }, [state.historial, filter]);

  const totalLitros = state.historial.reduce((a, h) => a + Number(h.litros_consumidos), 0);

  const zonaNombre = (id: string) =>
    state.zonas.find((z) => z.zona_id === id)?.nombre || 'Zona eliminada';

  const formatDateTime = (iso: string) =>
    new Date(iso).toLocaleString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });

  const computeDuration = (start: string, end: string | null) => {
    if (!end) return 'En curso';
    const mins = Math.round((new Date(end).getTime() - new Date(start).getTime()) / 60000);
    return `${mins} min`;
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-72">
        <TopBar />
        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                Registro
              </p>
              <h1 className="font-display text-5xl text-foreground mb-2">Historial de riego</h1>
              <p className="text-text-secondary">
                {state.historial.length} ciclos registrados · {Math.round(totalLitros)} L
                consumidos en total.
              </p>
            </div>

            <div className="mb-8">
              <ConsumptionChart />
            </div>

            <div className="flex items-center gap-2 mb-4">
              {[
                { v: 'all' as const, label: 'Todos' },
                { v: 'sistema' as const, label: 'Automáticos' },
                { v: 'manual' as const, label: 'Manuales' },
              ].map((f) => (
                <button
                  key={f.v}
                  onClick={() => setFilter(f.v)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium ${
                    filter === f.v
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-text-secondary hover:border-border-strong'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        <span className="inline-flex items-center gap-2">
                          <Calendar className="w-3.5 h-3.5" /> Fecha
                        </span>
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Zona
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Activación
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Duración
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Consumo
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center text-text-secondary">
                          No hay registros para este filtro.
                        </td>
                      </tr>
                    )}
                    {filtered.map((h) => (
                      <tr
                        key={h.riego_id}
                        className="border-b border-border last:border-0 hover:bg-muted/30"
                      >
                        <td className="px-6 py-4 text-sm text-foreground font-medium">
                          {formatDateTime(h.fecha_inicio)}
                        </td>
                        <td className="px-6 py-4 text-sm text-text-secondary">
                          {zonaNombre(h.zona_id)}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium ${
                              h.activado_por === 'sistema'
                                ? 'bg-primary/10 text-primary'
                                : 'bg-accent/15 text-accent'
                            }`}
                          >
                            {h.activado_por === 'sistema' ? (
                              <Cpu className="w-3 h-3" strokeWidth={2} />
                            ) : (
                              <User className="w-3 h-3" strokeWidth={2} />
                            )}
                            {h.activado_por === 'sistema' ? 'Automático' : 'Manual'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-foreground">
                          {computeDuration(h.fecha_inicio, h.fecha_fin)}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-foreground tabular-nums">
                            <Droplet className="w-3.5 h-3.5 text-water" strokeWidth={1.75} />
                            {Math.round(Number(h.litros_consumidos))} L
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
