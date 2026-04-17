'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/form';
import { UserForm } from '@/components/forms/user-form';
import { ConfirmDialog } from '@/components/ui/confirm';
import { useStore } from '@/lib/store';
import { Plus, Mail, Shield, Pencil, Trash2, Users } from 'lucide-react';
import type { Usuario } from '@/lib/types';

export default function UsuariosPage() {
  return (
    <AuthGuard>
      <UsuariosContent />
    </AuthGuard>
  );
}

function UsuariosContent() {
  const { state, deleteUsuario } = useStore();
  const [openForm, setOpenForm] = useState(false);
  const [editing, setEditing] = useState<Usuario | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Usuario | null>(null);

  const handleOpenNew = () => {
    setEditing(null);
    setOpenForm(true);
  };
  const handleEdit = (u: Usuario) => {
    setEditing(u);
    setOpenForm(true);
  };

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

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
                  Equipo
                </p>
                <h1 className="font-display text-5xl text-foreground mb-2">Usuarios</h1>
                <p className="text-text-secondary">
                  Gestiona los miembros con acceso al sistema.
                </p>
              </div>
              <Button onClick={handleOpenNew} size="lg">
                <Plus className="w-4 h-4" />
                Nuevo usuario
              </Button>
            </div>

            <div className="bg-card border border-border rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Usuario
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Correo
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Rol
                      </th>
                      <th className="px-6 py-4 text-left text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Registrado
                      </th>
                      <th className="px-6 py-4 text-right text-[10px] font-semibold uppercase tracking-wider text-text-muted">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {state.usuarios.length === 0 && (
                      <tr>
                        <td colSpan={5} className="px-6 py-16 text-center">
                          <Users className="w-8 h-8 text-text-muted mx-auto mb-2" strokeWidth={1.5} />
                          <p className="text-text-secondary">No hay usuarios registrados.</p>
                        </td>
                      </tr>
                    )}
                    {state.usuarios.map((u) => {
                      const initials = u.nombre
                        .split(' ')
                        .map((n) => n[0])
                        .slice(0, 2)
                        .join('')
                        .toUpperCase();
                      const isSelf = u.email === state.auth?.email;
                      return (
                        <tr
                          key={u.usuario_id}
                          className="border-b border-border last:border-0 hover:bg-muted/30"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-full bg-accent/20 text-accent flex items-center justify-center font-semibold text-xs">
                                {initials}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-foreground flex items-center gap-2">
                                  {u.nombre}
                                  {isSelf && (
                                    <span className="text-[10px] uppercase tracking-wider bg-primary/10 text-primary px-1.5 py-0.5 rounded">
                                      Tú
                                    </span>
                                  )}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="text-sm text-text-secondary inline-flex items-center gap-1.5">
                              <Mail className="w-3.5 h-3.5" strokeWidth={1.75} />
                              {u.email}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <span
                              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-medium ${
                                u.rol === 'admin'
                                  ? 'bg-primary/10 text-primary'
                                  : 'bg-accent/15 text-accent'
                              }`}
                            >
                              <Shield className="w-3 h-3" strokeWidth={2} />
                              {u.rol === 'admin' ? 'Administrador' : 'Agricultor'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-text-secondary">
                            {formatDate(u.fecha_creacion)}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => handleEdit(u)}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-muted hover:text-primary"
                                aria-label="Editar usuario"
                              >
                                <Pencil className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => setDeleteTarget(u)}
                                disabled={isSelf}
                                className="w-8 h-8 rounded-lg flex items-center justify-center text-text-muted hover:bg-error/10 hover:text-error disabled:opacity-30 disabled:cursor-not-allowed"
                                aria-label="Eliminar usuario"
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

      <UserForm open={openForm} onClose={() => setOpenForm(false)} usuario={editing} />
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        title="¿Eliminar usuario?"
        message={`Se eliminará el acceso de "${deleteTarget?.nombre}" al sistema.`}
        confirmLabel="Eliminar"
        onConfirm={() => deleteTarget && deleteUsuario(deleteTarget.usuario_id)}
      />
    </div>
  );
}
