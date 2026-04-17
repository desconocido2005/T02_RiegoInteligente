'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button, Field, Input, Switch } from '@/components/ui/form';
import { useStore } from '@/lib/store';
import type { ConfiguracionRiego, Zona } from '@/lib/types';

interface ConfigFormProps {
  open: boolean;
  onClose: () => void;
  zona: Zona;
  config?: ConfiguracionRiego | null;
}

export function ConfigForm({ open, onClose, zona, config }: ConfigFormProps) {
  const { upsertConfig } = useStore();
  const [umbral, setUmbral] = useState('50');
  const [duracion, setDuracion] = useState('10');
  const [auto, setAuto] = useState(true);
  const [activo, setActivo] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (config) {
      setUmbral(String(config.umbral_min_humedad));
      setDuracion(String(config.duracion_minutos));
      setAuto(config.es_automatico);
      setActivo(config.activo);
    } else {
      setUmbral('50');
      setDuracion('10');
      setAuto(true);
      setActivo(true);
    }
    setErrors({});
  }, [config, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    const u = Number(umbral);
    const d = Number(duracion);
    if (!u || u < 10 || u > 90) errs.umbral = 'Debe estar entre 10% y 90%.';
    if (!d || d < 1 || d > 120) errs.duracion = 'Debe estar entre 1 y 120 minutos.';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    upsertConfig(zona.zona_id, {
      umbral_min_humedad: u,
      duracion_minutos: d,
      es_automatico: auto,
      activo,
    });
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Configuración de riego"
      description={`Parámetros inteligentes para ${zona.nombre}.`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>Guardar configuración</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <Field
            label="Umbral de humedad"
            htmlFor="cfg-umbral"
            required
            error={errors.umbral}
            hint="Se activa el riego si la humedad cae por debajo de este valor."
          >
            <div className="relative">
              <Input
                id="cfg-umbral"
                type="number"
                min="10"
                max="90"
                value={umbral}
                onChange={(e) => setUmbral(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                %
              </span>
            </div>
          </Field>
          <Field
            label="Duración por ciclo"
            htmlFor="cfg-duracion"
            required
            error={errors.duracion}
            hint="Tiempo máximo de riego por activación."
          >
            <div className="relative">
              <Input
                id="cfg-duracion"
                type="number"
                min="1"
                max="120"
                value={duracion}
                onChange={(e) => setDuracion(e.target.value)}
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">
                min
              </span>
            </div>
          </Field>
        </div>

        <div className="space-y-4 pt-2 border-t border-border">
          <div className="pt-4">
            <Switch
              checked={auto}
              onChange={setAuto}
              label="Riego automático inteligente"
              description="El sistema monitoreará la humedad y activará el riego automáticamente cuando sea necesario."
            />
          </div>
          <Switch
            checked={activo}
            onChange={setActivo}
            label="Configuración activa"
            description="Desactívala temporalmente sin borrar los parámetros."
          />
        </div>

        <button type="submit" className="hidden" aria-hidden />
      </form>
    </Modal>
  );
}
