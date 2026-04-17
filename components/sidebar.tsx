'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  Users,
  Droplet,
  Zap,
  TrendingUp,
  Settings,
  History,
  AlertCircle,
  ChevronDown,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Usuarios', href: '/usuarios', icon: Users },
  { name: 'Zonas', href: '/zonas', icon: Droplet },
  { name: 'Dispositivos', href: '/dispositivos', icon: Zap },
  { name: 'Humedad', href: '/humedad', icon: TrendingUp },
  { name: 'Alertas', href: '/alertas', icon: AlertCircle },
  { name: 'Historial', href: '/historial', icon: History },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-card border border-border hover:bg-gray-50"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay para mobile */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/20 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed left-0 top-0 h-screen w-64 bg-card border-r border-border
          transform transition-transform duration-300 z-40
          lg:translate-x-0 lg:relative lg:h-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="h-20 flex items-center justify-center border-b border-border lg:mt-0 mt-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Droplet size={20} className="text-white" />
            </div>
            <span className="font-bold text-lg text-primary">RiegoIA</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-4 py-6 space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={`
                  flex items-center gap-3 px-4 py-3 rounded-lg font-medium
                  transition-all duration-300
                  ${
                    isActive
                      ? 'bg-primary text-white shadow-lg shadow-primary/20'
                      : 'text-foreground hover:bg-gray-50 border border-transparent hover:border-border'
                  }
                `}
              >
                <Icon size={20} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User section at bottom */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-border bg-gray-50">
          <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-white font-bold">
              JH
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">Juan Heras</p>
              <p className="text-xs text-text-secondary">Admin</p>
            </div>
            <ChevronDown size={16} className="text-text-secondary" />
          </div>
        </div>
      </aside>
    </>
  );
}
