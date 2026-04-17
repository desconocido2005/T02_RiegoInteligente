'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { ZoneListCard } from '@/components/zone-list-card';
import { AuthGuard } from '@/components/auth-guard';
import { Button } from '@/components/ui/form';
import { ZoneForm } from '@/components/forms/zone-form';
import { useStore } from '@/lib/store';
import { Plus, MapPin } from 'lucide-react';

export default function ZonasPage() {
  return (
    <AuthGuard>
      <ZonasContent />
    </AuthGuard>
  );
}

function ZonasContent() {
  const { state } = useStore();
  const [openForm, setOpenForm] = useState(false);

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
                  Parcelas
                </p>
                <h1 className="font-display text-5xl text-foreground mb-2">
                  Zonas de riego
                </h1>
                <p className="text-text-secondary">
                  {state.zonas.length} zona{state.zonas.length === 1 ? '' : 's'} bajo
                  monitoreo continuo.
                </p>
              </div>
              <Button onClick={() => setOpenForm(true)} size="lg">
                <Plus className="w-4 h-4" />
                Nueva zona
              </Button>
            </div>

            {state.zonas.length === 0 ? (
              <div className="bg-card border border-dashed border-border rounded-xl p-16 text-center">
                <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-text-muted" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-2xl text-foreground mb-2">Sin zonas aún</h3>
                <p className="text-text-secondary mb-6 max-w-sm mx-auto">
                  Crea tu primera zona de riego para comenzar a monitorear la humedad del
                  suelo.
                </p>
                <Button onClick={() => setOpenForm(true)}>
                  <Plus className="w-4 h-4" />
                  Crear primera zona
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {state.zonas.map((zona) => (
                  <ZoneListCard key={zona.zona_id} zona={zona} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      <ZoneForm open={openForm} onClose={() => setOpenForm(false)} />
    </div>
  );
}
