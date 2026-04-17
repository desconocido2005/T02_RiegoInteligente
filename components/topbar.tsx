'use client';

import { Bell, Search, Sun, Command } from 'lucide-react';

export function TopBar({ title }: { title?: string }) {
  const today = new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <header className="h-20 bg-background border-b border-border px-6 lg:px-10 flex items-center justify-between sticky top-0 z-20 backdrop-blur-sm">
      {/* Left: date & context */}
      <div className="flex items-center gap-4 ml-12 lg:ml-0">
        <div className="hidden md:flex items-center gap-2 text-text-secondary">
          <Sun className="w-4 h-4" strokeWidth={1.75} />
          <p className="text-sm capitalize">{today}</p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:flex items-center gap-2 px-3 py-2 bg-card border border-border rounded-lg hover:border-border-strong cursor-pointer group min-w-[280px]">
          <Search className="w-4 h-4 text-text-muted" strokeWidth={1.75} />
          <span className="text-sm text-text-muted flex-1">Buscar zonas, dispositivos...</span>
          <div className="flex items-center gap-0.5 text-text-muted">
            <Command className="w-3 h-3" />
            <span className="text-[11px] font-mono">K</span>
          </div>
        </div>

        {/* Notifications */}
        <button
          className="relative p-2.5 bg-card border border-border rounded-lg hover:border-border-strong"
          aria-label="Notificaciones"
        >
          <Bell className="w-4 h-4 text-foreground" strokeWidth={1.75} />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-error rounded-full ring-2 ring-background" />
        </button>

        {/* Action button */}
        <button className="hidden md:inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-accent">
          Nueva Zona
        </button>
      </div>
    </header>
  );
}
