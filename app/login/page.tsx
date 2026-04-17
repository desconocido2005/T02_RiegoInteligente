'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Leaf, Lock, Mail, Droplets, Sprout, CloudSun, User } from 'lucide-react';
import { useStore } from '@/lib/store';
import { Button, Field, Input, Select } from '@/components/ui/form';
import { DEMO_CREDENTIALS } from '@/lib/mock-data';

export default function LoginPage() {
  const router = useRouter();
  const { state, login, register } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('admin@verdant.com');
  const [password, setPassword] = useState('admin123');
  const [nombre, setNombre] = useState('');
  const [rol, setRol] = useState<'admin' | 'agricultor'>('agricultor');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Redirect once authenticated
  useEffect(() => {
    if (state.auth) router.replace('/');
  }, [state.auth, router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    setTimeout(() => {
      if (mode === 'login') {
        const res = login(email, password);
        if (!res.ok) setError(res.error || 'Error al iniciar sesión');
      } else {
        const res = register({ nombre, email, password, rol });
        if (!res.ok) setError(res.error || 'Error al crear la cuenta');
      }
      setSubmitting(false);
    }, 400);
  };

  const useDemo = (cred: (typeof DEMO_CREDENTIALS)[number]) => {
    setMode('login');
    setEmail(cred.email);
    setPassword(cred.password);
    setError(null);
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left — brand panel */}
      <aside className="hidden lg:flex w-[48%] xl:w-[52%] flex-col justify-between p-12 bg-primary text-primary-foreground relative overflow-hidden">
        {/* Animated background image (Ken Burns effect) */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-cover bg-center animate-ken-burns"
          style={{ backgroundImage: "url('/images/login-bg.jpg')" }}
        />

        {/* Dark green overlay for contrast */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/80 to-primary/95"
        />

        {/* Subtle leaf pattern */}
        <div className="absolute inset-0 opacity-[0.06] pointer-events-none">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="leafgrid" width="64" height="64" patternUnits="userSpaceOnUse">
                <path
                  d="M32 8 Q44 20 32 32 Q20 20 32 8 Z"
                  fill="currentColor"
                  opacity="0.4"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#leafgrid)" />
          </svg>
        </div>

        {/* Floating droplets animation */}
        <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
          {[
            { left: '12%', delay: '0s', duration: '7s', size: 'w-2 h-2' },
            { left: '28%', delay: '2s', duration: '9s', size: 'w-1.5 h-1.5' },
            { left: '44%', delay: '4s', duration: '8s', size: 'w-2.5 h-2.5' },
            { left: '62%', delay: '1s', duration: '10s', size: 'w-1.5 h-1.5' },
            { left: '78%', delay: '3s', duration: '7.5s', size: 'w-2 h-2' },
            { left: '88%', delay: '5s', duration: '9.5s', size: 'w-1 h-1' },
          ].map((d, i) => (
            <span
              key={i}
              className={`absolute ${d.size} rounded-full bg-accent/60 animate-float-up`}
              style={{
                left: d.left,
                bottom: '-10px',
                animationDelay: d.delay,
                animationDuration: d.duration,
              }}
            />
          ))}
        </div>

        <div className="relative flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-accent flex items-center justify-center">
            <Leaf className="w-5 h-5 text-accent-foreground" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-3xl leading-none">Verdant</h1>
            <p className="text-xs tracking-widest uppercase opacity-70 mt-1">
              Riego Inteligente
            </p>
          </div>
        </div>

        <div className="relative max-w-lg">
          <h2 className="font-display text-5xl xl:text-6xl leading-[1.05] mb-5">
            Cultiva con precisión.
            <br />
            <span className="text-accent">Conserva cada gota.</span>
          </h2>
          <p className="text-primary-foreground/75 text-lg leading-relaxed">
            Plataforma de gestión automatizada que monitorea la humedad del suelo y activa
            el riego exactamente cuando tus cultivos lo necesitan.
          </p>

          <div className="mt-10 grid grid-cols-3 gap-3">
            {[
              { icon: Droplets, label: 'Sensores IoT' },
              { icon: Sprout, label: 'Riego Adaptativo' },
              { icon: CloudSun, label: 'Clima en Vivo' },
            ].map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="border border-primary-foreground/15 rounded-xl p-4 backdrop-blur-sm"
              >
                <Icon className="w-5 h-5 mb-3 text-accent" strokeWidth={1.75} />
                <p className="text-xs font-medium uppercase tracking-wide opacity-85">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative text-xs opacity-60">
          © {new Date().getFullYear()} Verdant Systems — Todos los derechos reservados.
        </div>
      </aside>

      {/* Right — form panel */}
      <main className="flex-1 flex flex-col">
        <div className="lg:hidden flex items-center gap-3 p-6 border-b border-border">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Leaf className="w-5 h-5 text-primary-foreground" strokeWidth={2} />
          </div>
          <div>
            <h1 className="font-display text-2xl leading-none text-foreground">Verdant</h1>
            <p className="text-[10px] tracking-widest uppercase text-text-muted mt-0.5">
              Riego Inteligente
            </p>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center p-6 md:p-10">
          <div className="w-full max-w-md">
            <div className="mb-8">
              <p className="text-xs uppercase tracking-widest text-text-muted mb-2">
                {mode === 'login' ? 'Bienvenido de vuelta' : 'Crear una cuenta'}
              </p>
              <h3 className="font-display text-4xl text-foreground leading-tight">
                {mode === 'login' ? 'Accede a tu panel.' : 'Únete a Verdant.'}
              </h3>
              <p className="text-sm text-text-secondary mt-2 leading-relaxed">
                {mode === 'login'
                  ? 'Inicia sesión para monitorear y controlar tu sistema de riego.'
                  : 'Crea tu cuenta para comenzar a gestionar tus cultivos.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5" noValidate>
              {mode === 'register' && (
                <Field label="Nombre completo" required htmlFor="nombre">
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <Input
                      id="nombre"
                      required
                      value={nombre}
                      onChange={(e) => setNombre(e.target.value)}
                      placeholder="Tu nombre"
                      className="pl-10"
                    />
                  </div>
                </Field>
              )}

              <Field label="Correo electrónico" required htmlFor="email">
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input
                    id="email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    className="pl-10"
                  />
                </div>
              </Field>

              <Field label="Contraseña" required htmlFor="password">
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                  <Input
                    id="password"
                    type="password"
                    required
                    autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="pl-10"
                  />
                </div>
              </Field>

              {mode === 'register' && (
                <Field label="Rol" htmlFor="rol">
                  <Select
                    id="rol"
                    value={rol}
                    onChange={(e) => setRol(e.target.value as 'admin' | 'agricultor')}
                  >
                    <option value="agricultor">Agricultor</option>
                    <option value="admin">Administrador</option>
                  </Select>
                </Field>
              )}

              {error && (
                <div className="rounded-lg border border-error/30 bg-error/5 p-3 text-sm text-error">
                  {error}
                </div>
              )}

              <Button type="submit" size="lg" className="w-full" loading={submitting}>
                {mode === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </Button>

              <p className="text-sm text-text-secondary text-center">
                {mode === 'login' ? '¿Aún no tienes cuenta?' : '¿Ya tienes cuenta?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode(mode === 'login' ? 'register' : 'login');
                    setError(null);
                  }}
                  className="font-semibold text-primary hover:text-accent"
                >
                  {mode === 'login' ? 'Regístrate' : 'Inicia sesión'}
                </button>
              </p>
            </form>

            {mode === 'login' && (
              <div className="mt-10 pt-6 border-t border-border">
                <p className="text-[10px] font-semibold uppercase tracking-widest text-text-muted mb-3">
                  Credenciales de demostración
                </p>
                <div className="space-y-2">
                  {DEMO_CREDENTIALS.map((c) => (
                    <button
                      key={c.email}
                      onClick={() => useDemo(c)}
                      type="button"
                      className="w-full flex items-center justify-between px-4 py-3 border border-border rounded-lg hover:border-primary hover:bg-muted group text-left"
                    >
                      <div>
                        <p className="text-sm font-medium text-foreground">{c.nombre}</p>
                        <p className="text-xs text-text-secondary font-mono">{c.email}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] uppercase tracking-wider px-2 py-1 rounded bg-muted text-text-secondary group-hover:bg-card">
                          {c.rol}
                        </span>
                        <span className="text-xs text-primary font-medium opacity-0 group-hover:opacity-100">
                          Usar →
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-text-muted mt-3 leading-relaxed">
                  Esta es una demostración en memoria. Los datos no se envían a ningún servidor
                  y persisten localmente en tu navegador.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
