'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/form';
import { DeviceForm } from '@/components/forms/device-form';
import { ConfirmDialog } from '@/components/ui/confirm';
import { useStore } from '@/lib/store';
import { Plus, Radio, Pencil, Trash2, Wifi, WifiOff, Activity } from 'lucide-react';
import type { Dispositivo } from '@/lib/types';

export default function DispositivosPage() {
  return (
    <AuthGuard>
      <DispositivosContent />
    </AuthGuard>
  );
}

function DispositivosContent() {
  const { state, deleteDispositivo } = useStore();
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Dispositivo | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Dispositivo | null>(null);

  const zonaNombre = (id: string) =>
    state.zonas.find((z) => z.zona_id === id)?.nombre || '—';

  const online = state.dispositivos.filter((d) => d.estado_actual === 'online').length;
  const sensores = state.dispositivos.filter(
    (d) => d.tipo_dispositivo === 'sensor_humedad',
  ).length;
  const valvulas = state.dispositivos.filter(
    (d) => d.tipo_dispositivo === 'valvula_riego',
  ).length;

  const handleOpenNew = () => {
    setEditing(null);
    setOpenForm(true);
  };

  const handleEdit = (d: Dispositivo) => {
    setEditing(d);
    setOpenForm(true);
  };

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
                  Red IoT
                </p>
                <h1 className="font-display text-5xl text-foreground mb-2">Dispositivos</h1>
                <p className="text-text-secondary">
                  Sensores de humedad y válvulas de riego conectados.
                </p>
              </div>
              <Button onClick={handleOpenNew} size="lg">
                <Plus className="w-4 h-4" />
                Nuevo dispositivo
              </Button>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              <StatMini
                icon={Activity}
                label="Online"
                value={`${online}/${state.dispositivos.length}`}
                color="success"
              />
              <StatMini icon={Radio} label="Sensores" value={`${sensores}`} color="water" />
              <StatMini icon={Wifi} label="Válvulas" value={`${valvulas}`} color="primary" />
            </div>

            {/* Table */}
            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Dispositivo
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Zona
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.dispositivos.length === 0 && (
                      <tr>
                        <td
                          colSpan={5}
                          className="px-6 py-16 text-center text-text-secondary"
                        >
                          Aún no hay dispositivos registrados.
                        </td>
                      </tr>
                    )}
                    {state.dispositivos.map((d) => {
                      const isOnline = d.estado_actual === 'online';
                      return (
                        <tr
                          key={d.dispositivo_id}
                          className="border-b border-border last:border-0 hover:bg-muted/30"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div
                                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                                  isOnline ? 'bg-success/10 text-success' : 'bg-error/10 text-error'
                                }`}
                              >
                                {isOnline ? (
                                  <Wifi className="w-4 h-4" strokeWidth={1.75} />
                                ) : (
                                  <WifiOff className="w-4 h-4" strokeWidth={1.75} />
                                )}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground">
                                  {d.codigo_hardware}
                                </p>
                                <p className="text-[11px] font-mono text-text-muted">
                                  ID: {d.dispositivo_id.slice(0, 8)}…
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {zonaNombre(d.zona_id)}
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-block px-3 py-1 rounded-full text-[11px] font-medium ${
                                d.tipo_dispositivo === 'sensor_humedad'
                                  ? 'bg-water/10 text-water'
                                  : 'bg-accent/15 text-accent'
                              }`}
                            >
                              {d.tipo_dispositivo === 'sensor_humedad'
                                ? 'Sensor humedad'
                                : 'Válvula riego'}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium capitalize ${
                                isOnline
                                  ? 'bg-success/10 text-success'
                                  : d.estado_actual === 'mantenimiento'
                                    ? 'bg-warning/10 text-warning'
                                    : 'bg-error/10 text-error'
                              }`}
                            >
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${
                                  isOnline
                                    ? 'bg-success'
                                    : d.estado_actual === 'mantenimiento'
                                      ? 'bg-warning'
                                      : 'bg-error'
                                }`}
                              />
                              {d.estado_actual}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEdit(d)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-muted hover:text-primary"
                                title="Editar"
                                aria-label="Editar"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(d)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-error/10 hover:text-error"
                                title="Eliminar"
                                aria-label="Eliminar"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </main>
      </div>

      <DeviceForm
        open={openForm}
        onClose={() => setOpenForm(false)}
        dispositivo={editing}
      />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="¿Eliminar dispositivo?"
        message={`Se eliminará "${deleteTarget?.codigo_hardware}" del sistema.`}
        confirmLabel="Eliminar"
        onConfirm={() => deleteTarget && deleteDispositivo(deleteTarget.dispositivo_id)}
      />
    </div>
  );
}

function StatMini({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Activity;
  label: string;
  value: string;
  color: 'success' | 'water' | 'primary';
}) {
  const bg = {
    success: 'bg-success/10 text-success',
    water: 'bg-water/10 text-water',
    primary: 'bg-primary/10 text-primary',
  }[color];
  return (
    <div className="bg-card border border-border rounded-xl p-5 flex items-center gap-4">
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${bg}`}>
        <Icon className="w-5 h-5" strokeWidth={1.75} />
      </div>
      <div>
        <p className="text-[10px] uppercase tracking-wider text-text-muted font-medium">
          {label}
        </p>
        <p className="font-display text-2xl text-foreground leading-tight">{value}</p>
      </div>
    </div>
  );
}
