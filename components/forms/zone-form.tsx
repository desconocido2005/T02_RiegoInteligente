'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button, Field, Input, Select, Textarea } from '@/components/ui/form';
import { useStore } from '@/lib/store';
import type { Zona } from '@/lib/types';

interface ZoneFormProps {
  open: boolean;
  onClose: () => void;
  zona?: Zona | null;
}

const TIPOS_CULTIVO = [
  'Tomate',
  'Lechuga',
  'Fresa',
  'Maíz',
  'Papa',
  'Zanahoria',
  'Pimiento',
  'Cebolla',
  'Café',
  'Otro',
];

export function ZoneForm({ open, onClose, zona }: ZoneFormProps) {
  const { addZona, updateZona } = useStore();
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [tipoCultivo, setTipoCultivo] = useState('Tomate');
  const [area, setArea] = useState('100');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (zona) {
      setNombre(zona.nombre);
      setDescripcion(zona.descripcion || '');
      setTipoCultivo(zona.tipo_cultivo || 'Tomate');
      setArea(String(zona.area_metros_cuadrados || 100));
    } else {
      setNombre('');
      setDescripcion('');
      setTipoCultivo('Tomate');
      setArea('100');
    }
    setErrors({});
  }, [zona, open]);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!nombre.trim()) e.nombre = 'El nombre es obligatorio.';
    if (nombre.length > 100) e.nombre = 'Máximo 100 caracteres.';
    const areaNum = Number(area);
    if (!areaNum || areaNum <= 0) e.area = 'Ingresa un área válida.';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const payload = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      tipo_cultivo: tipoCultivo,
      area_metros_cuadrados: Number(area),
    };
    if (zona) {
      updateZona(zona.zona_id, payload);
    } else {
      addZona(payload);
    }
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={zona ? 'Editar zona' : 'Nueva zona de riego'}
      description={
        zona
          ? 'Actualiza la información de esta parcela.'
          : 'Define una nueva parcela para monitorear y automatizar su riego.'
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{zona ? 'Guardar cambios' : 'Crear zona'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Nombre de la zona" htmlFor="zona-nombre" required error={errors.nombre}>
          <Input
            id="zona-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ej. Zona Norte — Tomates"
          />
        </Field>

        <div className="grid grid-cols-2 gap-4">
          <Field label="Tipo de cultivo" htmlFor="zona-cultivo">
            <Select
              id="zona-cultivo"
              value={tipoCultivo}
              onChange={(e) => setTipoCultivo(e.target.value)}
            >
              {TIPOS_CULTIVO.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
          <Field
            label="Área (m²)"
            htmlFor="zona-area"
            required
            error={errors.area}
            hint="Superficie total de la parcela"
          >
            <Input
              id="zona-area"
              type="number"
              min="1"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            />
          </Field>
        </div>

        <Field label="Descripción" htmlFor="zona-desc" hint="Opcional — notas sobre esta zona">
          <Textarea
            id="zona-desc"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
            placeholder="Exposición solar, características del suelo, observaciones…"
          />
        </Field>

        <button type="submit" className="hidden" aria-hidden />
      </form>
    </Modal>
  );
}
