'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';
import { useStore } from '@/lib/store';

type ToastItem = {
  id: number;
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
};

const ICONS = {
  success: CheckCircle2,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
};

const STYLES = {
  success: 'border-success/30 bg-card text-foreground',
  error: 'border-error/30 bg-card text-foreground',
  info: 'border-border-strong bg-card text-foreground',
  warning: 'border-warning/30 bg-card text-foreground',
};

const ICON_COLOR = {
  success: 'text-success',
  error: 'text-error',
  info: 'text-water',
  warning: 'text-warning',
};

let toastIdCounter = 1;

export function ToastContainer() {
  const { _consumeToast } = useStore();
  const [items, setItems] = useState<ToastItem[]>([]);

  // Drain the toast queue periodically.
  useEffect(() => {
    const interval = setInterval(() => {
      const next = _consumeToast();
      if (next) {
        const id = toastIdCounter++;
        setItems((prev) => [...prev, { id, ...next }]);
        // Auto-dismiss
        setTimeout(() => {
          setItems((prev) => prev.filter((t) => t.id !== id));
        }, 4200);
      }
    }, 200);
    return () => clearInterval(interval);
  }, [_consumeToast]);

  const dismiss = (id: number) => setItems((prev) => prev.filter((t) => t.id !== id));

  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {items.map((t) => {
        const Icon = ICONS[t.type];
        return (
          <div
            key={t.id}
            className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg shadow-foreground/5 backdrop-blur-sm ${STYLES[t.type]} animate-[slideIn_0.25s_ease-out]`}
            role="status"
          >
            <Icon className={`w-5 h-5 shrink-0 mt-0.5 ${ICON_COLOR[t.type]}`} strokeWidth={2} />
            <p className="text-sm flex-1 leading-relaxed">{t.message}</p>
            <button
              onClick={() => dismiss(t.id)}
              className="shrink-0 text-text-muted hover:text-foreground"
              aria-label="Cerrar notificación"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
      <style jsx>{`
        @keyframes slideIn {
          from {
            transform: translateX(20px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
