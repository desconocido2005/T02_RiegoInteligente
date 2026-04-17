'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/store';
import { Leaf } from 'lucide-react';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { state } = useStore();
  const router = useRouter();
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    // Give the store a tick to hydrate from localStorage
    const timer = setTimeout(() => {
      if (!state.auth) {
        router.replace('/login');
      } else {
        setChecked(true);
      }
    }, 120);
    return () => clearTimeout(timer);
  }, [state.auth, router]);

  if (!state.auth || !checked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3 text-text-secondary">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground animate-pulse" strokeWidth={2} />
          </div>
          <p className="text-xs uppercase tracking-widest">Cargando Verdant…</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
