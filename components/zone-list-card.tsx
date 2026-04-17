'use client';

import { useState } from 'react';
import {
  Droplets,
  Thermometer,
  Clock,
  Play,
  StopCircle,
  Settings as SettingsIcon,
  Trash2,
  Pencil,
  Sprout,
} from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button } from '@/components/ui/form';
import { ConfirmDialog } from '@/components/ui/confirm';
import { ZoneForm } from '@/components/forms/zone-form';
import { ConfigForm } from '@/components/forms/config-form';
import type { Zona } from '@/lib/types';

function formatRelative(iso: string | null) {
  if (!iso) return 'Sin registros';
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.round(diff / 60000);
  if (mins < 1) return 'Hace un momento';
  if (mins < 60) return `Hace ${mins} min`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `Hace ${hrs} h`;
  const days = Math.round(hrs / 24);
  return `Hace ${days} d`;
}

interface ZoneListCardProps {
  zona: Zona;
}

export function ZoneListCard({ zona }: ZoneListCardProps) {
  const { state, startManualIrrigation, stopIrrigation, deleteZona } = useStore();
  const runtime = state.runtime[zona.zona_id];
  const config = state.configs.find((c) => c.zona_id === zona.zona_id);

  const [editOpen, setEditOpen] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const humedad = runtime?.humedad_actual ?? 0;
  const temperatura = runtime?.temperatura ?? 0;
  const regando = runtime?.regando ?? false;

  let status: 'active' | 'idle' | 'alert' = 'idle';
  if (regando) status = 'active';
  else if (config && humedad < config.umbral_min_humedad) status = 'alert';

  const statusConfig = {
    active: { dot: 'bg-water', ring: 'bg-water/25', label: 'Regando', color: 'text-water' },
    idle: { dot: 'bg-success', ring: 'bg-success/20', label: 'Óptima', color: 'text-success' },
    alert: { dot: 'bg-warning', ring: 'bg-warning/25', label: 'Humedad baja', color: 'text-warning' },
  }[status];

  const moistureColor =
    humedad > 60 ? 'bg-success' : humedad > 40 ? 'bg-warning' : 'bg-error';

  return (
    <>
      <div className="group relative bg-card border border-border rounded-xl p-6 hover:border-border-strong overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-accent/40 to-transparent opacity-0 group-hover:opacity-100" />

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-2">
              <div className="relative flex items-center justify-center">
                <div className={`absolute w-3 h-3 rounded-full ${statusConfig.ring} animate-pulse`} />
                <div className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
              </div>
              <span className={`text-xs font-medium tracking-wide uppercase ${statusConfig.color}`}>
                {statusConfig.label}
              </span>
              {config?.es_automatico && config?.activo && (
                <span className="text-[10px] uppercase tracking-widest px-2 py-0.5 rounded bg-primary/10 text-primary font-semibold">
                  Auto
                </span>
              )}
            </div>
            <h3 className="font-display text-2xl text-foreground leading-tight truncate">
              {zona.nombre}
            </h3>
            {zona.tipo_cultivo && (
              <p className="text-xs text-text-secondary mt-1 flex items-center gap-1.5">
                <Sprout className="w-3.5 h-3.5 text-success" strokeWidth={1.75} />
                {zona.tipo_cultivo} · {zona.area_metros_cuadrados ?? 0} m²
              </p>
            )}
          </div>
          <div className="flex flex-col gap-1.5 shrink-0 ml-2">
            <button
              onClick={() => setEditOpen(true)}
              title="Editar zona"
              aria-label="Editar zona"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setConfigOpen(true)}
              title="Configurar riego"
              aria-label="Configurar riego"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted hover:border-primary hover:text-primary"
            >
              <SettingsIcon className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setDeleteOpen(true)}
              title="Eliminar zona"
              aria-label="Eliminar zona"
              className="w-8 h-8 rounded-lg border border-border flex items-center justify-center text-text-muted hover:border-error hover:text-error"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Moisture bar */}
        <div className="mb-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-1.5">
              <Droplets className="w-3.5 h-3.5 text-water" strokeWidth={1.75} />
              <span className="text-xs text-text-secondary font-medium">
                Humedad del suelo
              </span>
            </div>
            <span className="text-sm font-semibold text-foreground tabular-nums">
              {humedad.toFixed(1)}%
            </span>
          </div>
          <div className="h-2 bg-muted rounded-full overflow-hidden relative">
            <div
              className={`h-full ${moistureColor} rounded-full`}
              style={{ width: `${Math.min(100, humedad)}%` }}
            />
            {config && (
              <div
                className="absolute top-0 bottom-0 w-0.5 bg-foreground/50"
                style={{ left: `${config.umbral_min_humedad}%` }}
                title={`Umbral: ${config.umbral_min_humedad}%`}
              />
            )}
          </div>
          {config && (
            <p className="text-[10px] text-text-muted mt-1.5">
              Umbral de disparo: {config.umbral_min_humedad}% · Duración ciclo:{' '}
              {config.duracion_minutos} min
            </p>
          )}
        </div>

        {/* Details */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border mb-4">
          <div className="flex items-center gap-2.5">
            <Thermometer className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted">Temp.</p>
              <p className="text-sm font-semibold text-foreground tabular-nums">
                {temperatura.toFixed(1)}°C
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2.5">
            <Clock className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
            <div>
              <p className="text-[10px] uppercase tracking-wider text-text-muted">Último riego</p>
              <p className="text-sm font-semibold text-foreground">
                {formatRelative(runtime?.ultimo_riego_en || null)}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        {regando ? (
          <Button
            onClick={() => stopIrrigation(zona.zona_id)}
            variant="danger"
            className="w-full"
          >
            <StopCircle className="w-4 h-4" />
            Detener riego
          </Button>
        ) : (
          <Button
            onClick={() => startManualIrrigation(zona.zona_id)}
            variant="primary"
            className="w-full"
          >
            <Play className="w-4 h-4" />
            Regar ahora
          </Button>
        )}
      </div>

      <ZoneForm open={editOpen} onClose={() => setEditOpen(false)} zona={zona} />
      <ConfigForm
        open={configOpen}
        onClose={() => setConfigOpen(false)}
        zona={zona}
        config={config || null}
      />
      <ConfirmDialog
        open={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        title="¿Eliminar esta zona?"
        message={`Se eliminará "${zona.nombre}" y todos sus dispositivos y configuraciones asociadas. Esta acción no se puede deshacer.`}
        confirmLabel="Eliminar zona"
        onConfirm={() => deleteZona(zona.zona_id)}
      />
    </>
  );
}
