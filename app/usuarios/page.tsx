'use client';

import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { Plus, Mail, Shield } from 'lucide-react';

const users = [
  { id: 1, name: 'Juan Heras', email: 'juan@riegos.com', role: 'Administrador', status: 'Activo' },
  { id: 2, name: 'María López', email: 'maria@riegos.com', role: 'Operador', status: 'Activo' },
  { id: 3, name: 'Carlos Ruiz', email: 'carlos@riegos.com', role: 'Técnico', status: 'Inactivo' },
  { id: 4, name: 'Ana García', email: 'ana@riegos.com', role: 'Operador', status: 'Activo' },
];

export default function UsuariosPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">Usuarios</h1>
                <p className="text-text-secondary">Gestiona los usuarios del sistema</p>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium">
                <Plus size={20} />
                Nuevo Usuario
              </button>
            </div>

            {/* Users Table */}
            <div className="bg-card border border-border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-gray-50">
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Nombre
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Email
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Rol
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Estado
                    </th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-foreground">
                      Acciones
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr
                      key={user.id}
                      className="border-b border-border hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-sm font-medium text-foreground">
                        {user.name}
                      </td>
                      <td className="px-6 py-4 text-sm text-text-secondary flex items-center gap-2">
                        <Mail size={16} />
                        {user.email}
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                          <Shield size={14} />
                          {user.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            user.status === 'Activo'
                              ? 'bg-success/10 text-success'
                              : 'bg-gray-100 text-gray-600'
                          }`}
                        >
                          {user.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm">
                        <button className="text-primary hover:underline font-medium">
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
