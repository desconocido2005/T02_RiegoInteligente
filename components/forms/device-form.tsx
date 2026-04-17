'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button, Field, Input, Select } from '@/components/ui/form';
import { useStore } from '@/lib/store';
import type { Dispositivo } from '@/lib/types';

interface DeviceFormProps {
  open: boolean;
  onClose: () => void;
  dispositivo?: Dispositivo | null;
}

export function DeviceForm({ open, onClose, dispositivo }: DeviceFormProps) {
  const { state, addDispositivo, updateDispositivo } = useStore();
  const [zonaId, setZonaId] = useState('');
  const [codigo, setCodigo] = useState('');
  const [tipo, setTipo] = useState<'sensor_humedad' | 'valvula_riego'>('sensor_humedad');
  const [estado, setEstado] = useState('online');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (dispositivo) {
      setZonaId(dispositivo.zona_id);
      setCodigo(dispositivo.codigo_hardware);
      setTipo(dispositivo.tipo_dispositivo);
      setEstado(dispositivo.estado_actual);
    } else {
      setZonaId(state.zonas[0]?.zona_id || '');
      setCodigo('');
      setTipo('sensor_humedad');
      setEstado('online');
    }
    setErrors({});
  }, [dispositivo, open, state.zonas]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!codigo.trim()) errs.codigo = 'El código es obligatorio.';
    if (!zonaId) errs.zona = 'Selecciona una zona.';
    if (
      !dispositivo &&
      state.dispositivos.some((d) => d.codigo_hardware === codigo.trim())
    ) {
      errs.codigo = 'Ya existe un dispositivo con ese código.';
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = {
      zona_id: zonaId,
      codigo_hardware: codigo.trim(),
      tipo_dispositivo: tipo,
      estado_actual: estado,
    };
    if (dispositivo) updateDispositivo(dispositivo.dispositivo_id, payload);
    else addDispositivo(payload);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={dispositivo ? 'Editar dispositivo' : 'Nuevo dispositivo'}
      description={
        dispositivo
          ? 'Actualiza los datos del dispositivo IoT.'
          : 'Registra un sensor o válvula de tu red.'
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{dispositivo ? 'Guardar cambios' : 'Registrar'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field
          label="Código de hardware"
          htmlFor="dev-codigo"
          required
          error={errors.codigo}
          hint="MAC address o identificador único del ESP32/Arduino"
        >
          <Input
            id="dev-codigo"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value.toUpperCase())}
            placeholder="ESP32-XXX-001"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipo" htmlFor="dev-tipo">
            <Select
              id="dev-tipo"
              value={tipo}
              onChange={(e) => setTipo(e.target.value as 'sensor_humedad' | 'valvula_riego')}
            >
              <option value="sensor_humedad">Sensor de humedad</option>
              <option value="valvula_riego">Válvula de riego</option>
            </Select>
          </Field>

          <Field label="Estado actual" htmlFor="dev-estado">
            <Select id="dev-estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="mantenimiento">Mantenimiento</option>
            </Select>
          </Field>
        </div>

        <Field label="Zona asignada" htmlFor="dev-zona" required error={errors.zona}>
          <Select id="dev-zona" value={zonaId} onChange={(e) => setZonaId(e.target.value)}>
            <option value="">— Selecciona una zona —</option>
            {state.zonas.map((z) => (
              <option key={z.zona_id} value={z.zona_id}>
                {z.nombre}
              </option>
            ))}
          </Select>
        </Field>

        <button type="submit" className="hidden" aria-hidden />
      </form>
    </Modal>
  );
}
