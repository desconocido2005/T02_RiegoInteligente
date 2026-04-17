'use client';

import { Bell, Search, User, LogOut } from 'lucide-react';

export function TopBar() {
  return (
    <div className="h-20 bg-card border-b border-border px-8 flex items-center justify-between sticky top-0 z-30">
      {/* Search */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary"
          />
          <input
            type="text"
            placeholder="Buscar zonas, dispositivos..."
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-border rounded-lg text-sm text-foreground placeholder-text-secondary focus:outline-none focus:border-primary focus:bg-white transition-colors"
          />
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-4 ml-8">
        {/* Notifications */}
        <button className="relative p-2 rounded-lg hover:bg-gray-50 transition-colors">
          <Bell size={20} className="text-foreground" />
          <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-error rounded-full" />
        </button>

        {/* User menu */}
        <div className="flex items-center gap-3 pl-4 border-l border-border">
          <div className="text-right">
            <p className="text-sm font-semibold text-foreground">Juan Heras</p>
            <p className="text-xs text-text-secondary">Administrador</p>
          </div>
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
            JH
          </div>
        </div>

        {/* Logout button */}
        <button className="p-2 rounded-lg hover:bg-gray-50 transition-colors text-foreground hover:text-error">
          <LogOut size={20} />
        </button>
      </div>
    </div>
  );
}
