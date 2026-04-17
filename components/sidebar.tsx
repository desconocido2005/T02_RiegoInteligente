'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  MapPin,
  Radio,
  Droplets,
  Bell,
  History,
  Settings,
  Leaf,
  Menu,
  X,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useStore } from '@/lib/store';

const navigation = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Zonas', href: '/zonas', icon: MapPin },
  { name: 'Dispositivos', href: '/dispositivos', icon: Radio },
  { name: 'Humedad', href: '/humedad', icon: Droplets },
  { name: 'Alertas', href: '/alertas', icon: Bell },
  { name: 'Historial', href: '/historial', icon: History },
  { name: 'Usuarios', href: '/usuarios', icon: Users },
  { name: 'Configuración', href: '/configuracion', icon: Settings },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const { state, logout } = useStore();
  const router = useRouter();

  const unreadAlerts = state.alertas.filter((a) => !a.leido).length;
  const user = state.auth;
  const initials = user
    ? user.nombre
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : '—';

  const handleLogout = () => {
    logout();
    router.replace('/login');
  };

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2.5 bg-card border border-border rounded-lg hover:border-primary"
        aria-label="Toggle menu"
      >
        {isOpen ? (
          <X className="w-5 h-5 text-foreground" />
        ) : (
          <Menu className="w-5 h-5 text-foreground" />
        )}
      </button>

      {/* Backdrop */}
      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-foreground/20 backdrop-blur-sm z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-72 bg-card border-r border-border
          transform transition-transform duration-300 ease-out z-40
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
      >
        {/* Brand */}
        <div className="px-8 pt-8 pb-6 border-b border-border">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center group-hover:bg-accent">
              <Leaf className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
            </div>
            <div>
              <h1 className="font-display text-2xl leading-none text-foreground">Verdant</h1>
              <p className="text-[11px] text-text-muted tracking-widest uppercase mt-1">
                Riego Inteligente
              </p>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6">
          <p className="px-4 mb-3 text-[10px] font-medium tracking-widest uppercase text-text-muted">
            Navegación
          </p>
          <ul className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              const Icon = item.icon;
              const showBadge = item.href === '/alertas' && unreadAlerts > 0;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className={`
                      group flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm
                      ${
                        isActive
                          ? 'bg-primary text-primary-foreground'
                          : 'text-text-secondary hover:bg-muted hover:text-foreground'
                      }
                    `}
                  >
                    <Icon
                      className={`w-4 h-4 shrink-0 ${
                        isActive
                          ? 'text-primary-foreground'
                          : 'text-text-muted group-hover:text-foreground'
                      }`}
                      strokeWidth={1.75}
                    />
                    <span className="font-medium flex-1">{item.name}</span>
                    {showBadge && (
                      <span
                        className={`inline-flex items-center justify-center min-w-[22px] h-5 px-1.5 rounded-full text-[10px] font-semibold ${
                          isActive
                            ? 'bg-primary-foreground text-primary'
                            : 'bg-error text-primary-foreground'
                        }`}
                      >
                        {unreadAlerts}
                      </span>
                    )}
                    {isActive && !showBadge && (
                      <ChevronRight className="w-3.5 h-3.5 text-primary-foreground/70" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User card */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/40">
            <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-accent-foreground font-semibold text-sm shrink-0">
              {initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">
                {user?.nombre || 'Invitado'}
              </p>
              <p className="text-xs text-text-muted capitalize">
                {user?.rol || 'sin sesión'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Cerrar sesión"
              aria-label="Cerrar sesión"
              className="w-9 h-9 rounded-lg flex items-center justify-center text-text-muted hover:bg-error/10 hover:text-error"
            >
              <LogOut className="w-4 h-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
