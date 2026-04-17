'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Button, Field, Input, Select } from '@/components/ui/form';
import { useStore } from '@/lib/store';
import type { Usuario } from '@/lib/types';

interface UserFormProps {
  open: boolean;
  onClose: () => void;
  usuario?: Usuario | null;
}

export function UserForm({ open, onClose, usuario }: UserFormProps) {
  const { state, addUsuario, updateUsuario } = useStore();
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [rol, setRol] = useState<'admin' | 'agricultor'>('agricultor');
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre);
      setEmail(usuario.email);
      setRol(usuario.rol);
    } else {
      setNombre('');
      setEmail('');
      setRol('agricultor');
    }
    setErrors({});
  }, [usuario, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!nombre.trim()) errs.nombre = 'El nombre es obligatorio.';
    if (!email.trim()) errs.email = 'El correo es obligatorio.';
    else if (!/^\S+@\S+\.\S+$/.test(email)) errs.email = 'Correo inválido.';
    else if (
      !usuario &&
      state.usuarios.some((u) => u.email.toLowerCase() === email.trim().toLowerCase())
    ) {
      errs.email = 'Ese correo ya está registrado.';
    }
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const payload = { nombre: nombre.trim(), email: email.trim(), rol };
    if (usuario) updateUsuario(usuario.usuario_id, payload);
    else addUsuario(payload);
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={usuario ? 'Editar usuario' : 'Nuevo usuario'}
      description={
        usuario
          ? 'Modifica el perfil del usuario.'
          : 'Registra un nuevo miembro del equipo.'
      }
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit}>{usuario ? 'Guardar cambios' : 'Crear usuario'}</Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Nombre completo" htmlFor="usr-nombre" required error={errors.nombre}>
          <Input
            id="usr-nombre"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Ana García"
          />
        </Field>

        <Field label="Correo electrónico" htmlFor="usr-email" required error={errors.email}>
          <Input
            id="usr-email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="ana@ejemplo.com"
          />
        </Field>

        <Field label="Rol" htmlFor="usr-rol">
          <Select
            id="usr-rol"
            value={rol}
            onChange={(e) => setRol(e.target.value as 'admin' | 'agricultor')}
          >
            <option value="agricultor">Agricultor</option>
            <option value="admin">Administrador</option>
          </Select>
        </Field>

        <button type="submit" className="hidden" aria-hidden />
      </form>
    </Modal>
  );
}
