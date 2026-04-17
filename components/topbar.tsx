'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bell, Sun, Plus, Activity } from 'lucide-react';
import { useStore } from '@/lib/store';
import { ZoneForm } from '@/components/forms/zone-form';

export function TopBar() {
  const { state, markAllRead } = useStore();
  const router = useRouter();
  const [openForm, setOpenForm] = useState(false);

  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  const unread = state.alertas.filter((a) => !a.leido).length;
  const activeIrrigations = Object.values(state.runtime).filter((r) => r.regando).length;

  return (
    <>
      <header className="h-20 bg-background border-b border-border px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
        {/* Left: date & live indicator */}
        <div className="flex items-center gap-4 ml-12 lg:ml-0">
          <div className="hidden md:flex items-center gap-2 text-text-secondary">
            <Sun className="w-4 h-4" strokeWidth={1.75} />
            <p className="text-sm capitalize">{today}</p>
          </div>
          {activeIrrigations > 0 && (
            <div className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-water/10 border border-water/20">
              <span className="relative flex items-center justify-center">
                <span className="absolute w-2.5 h-2.5 rounded-full bg-water/40 animate-ping" />
                <span className="w-1.5 h-1.5 rounded-full bg-water" />
              </span>
              <p className="text-xs font-medium text-water">
                {activeIrrigations} {activeIrrigations === 1 ? 'zona regando' : 'zonas regando'}
              </p>
            </div>
          )}
        </div>

        {/* Right section */}
        <div className="flex items-center gap-3">
          <div
            className="hidden md:flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg"
            title="Motor de riego en vivo"
          >
            <Activity className="w-4 h-4 text-success" strokeWidth={2} />
            <span className="text-xs font-medium text-text-secondary">Motor en vivo</span>
          </div>

          <button
            onClick={() => {
              if (unread > 0) markAllRead();
              router.push('/alertas');
            }}
            className="relative p-2.5 bg-card border border-border rounded-lg hover:border-border-strong"
            aria-label="Notificaciones"
          >
            <Bell className="w-4 h-4 text-foreground" strokeWidth={1.75} />
            {unread > 0 && (
              <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-error text-primary-foreground text-[10px] font-semibold flex items-center justify-center ring-2 ring-background">
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          <button
            onClick={() => setOpenForm(true)}
            className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent"
          >
            <Plus className="w-4 h-4" />
            Nueva Zona
          </button>
        </div>
      </header>

      <ZoneForm open={openForm} onClose={() => setOpenForm(false)} />
    </>
  );
}
