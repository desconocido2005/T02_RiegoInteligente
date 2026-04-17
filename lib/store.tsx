'use client';

// Global in-memory store + Intelligent Irrigation Engine.
// Acts as a client-side fake backend with a tick loop that:
//  - simulates humidity evolution per zone (evaporation + irrigation)
//  - decides when to auto-water based on thresholds
//  - generates alerts and history records
// Persists everything to localStorage so the simulation survives reloads.

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import type {
  Alerta,
  ConfiguracionRiego,
  Dispositivo,
  HistorialRiego,
  LecturaHumedad,
  Usuario,
  Zona,
} from './types';
import {
  DEMO_CREDENTIALS,
  seedAlertas,
  seedConfiguraciones,
  seedDispositivos,
  seedHistorial,
  seedLecturas,
  seedUsuarios,
  seedZonas,
} from './mock-data';

// ------------------------- Types -------------------------

export type AuthUser = {
  usuario_id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'agricultor';
};

// Runtime zone state (not persisted in DB schema, used by the engine)
export type ZonaRuntime = {
  zona_id: string;
  humedad_actual: number; // 0-100
  temperatura: number; // C
  regando: boolean;
  riego_iniciado_en: string | null;
  riego_termina_en: string | null;
  activado_por: 'sistema' | 'manual' | null;
  ultimo_riego_en: string | null;
  litros_en_curso: number;
};

type State = {
  usuarios: Usuario[];
  zonas: Zona[];
  dispositivos: Dispositivo[];
  lecturas: LecturaHumedad[];
  configs: ConfiguracionRiego[];
  historial: HistorialRiego[];
  alertas: Alerta[];
  runtime: Record<string, ZonaRuntime>;
  auth: AuthUser | null;
};

// ------------------------- Helpers -------------------------

const uuid = () =>
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? (crypto as Crypto).randomUUID()
    : 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      });

const STORAGE_KEY = 'verdant:v1';

function buildInitialState(): State {
  const runtime: Record<string, ZonaRuntime> = {};
  seedZonas.forEach((z) => {
    const sensores = seedDispositivos.filter(
      (d) => d.zona_id === z.zona_id && d.tipo_dispositivo === 'sensor_humedad',
    );
    let humedad = 60;
    if (sensores.length) {
      const ids = new Set(sensores.map((s) => s.dispositivo_id));
      const latest = seedLecturas
        .filter((l) => ids.has(l.dispositivo_id))
        .sort((a, b) => +new Date(b.fecha_hora) - +new Date(a.fecha_hora))[0];
      if (latest) humedad = latest.valor_humedad;
    }
    runtime[z.zona_id] = {
      zona_id: z.zona_id,
      humedad_actual: humedad,
      temperatura: 22 + Math.random() * 10,
      regando: false,
      riego_iniciado_en: null,
      riego_termina_en: null,
      activado_por: null,
      ultimo_riego_en: null,
      litros_en_curso: 0,
    };
  });

  return {
    usuarios: seedUsuarios,
    zonas: seedZonas,
    dispositivos: seedDispositivos,
    lecturas: seedLecturas,
    configs: seedConfiguraciones,
    historial: seedHistorial,
    alertas: seedAlertas,
    runtime,
    auth: null,
  };
}

// ------------------------- Context -------------------------

type ToastInput = { type: 'success' | 'error' | 'info' | 'warning'; message: string };

export type StoreContextValue = {
  state: State;
  // auth
  login: (email: string, password: string) => { ok: boolean; error?: string };
  logout: () => void;
  register: (args: {
    nombre: string;
    email: string;
    password: string;
    rol: 'admin' | 'agricultor';
  }) => { ok: boolean; error?: string };
  // zones
  addZona: (z: Omit<Zona, 'zona_id' | 'fecha_creacion' | 'usuario_id'>) => void;
  updateZona: (id: string, patch: Partial<Zona>) => void;
  deleteZona: (id: string) => void;
  // devices
  addDispositivo: (d: Omit<Dispositivo, 'dispositivo_id' | 'ultima_conexion'>) => void;
  updateDispositivo: (id: string, patch: Partial<Dispositivo>) => void;
  deleteDispositivo: (id: string) => void;
  // users
  addUsuario: (
    u: Omit<Usuario, 'usuario_id' | 'fecha_creacion'> & { password?: string },
  ) => void;
  updateUsuario: (id: string, patch: Partial<Usuario>) => void;
  deleteUsuario: (id: string) => void;
  // config
  upsertConfig: (zona_id: string, patch: Partial<ConfiguracionRiego>) => void;
  // irrigation actions
  startManualIrrigation: (zona_id: string) => void;
  stopIrrigation: (zona_id: string) => void;
  // alerts
  resolveAlerta: (id: string) => void;
  markAllRead: () => void;
  // toast bridge
  toast: (t: ToastInput) => void;
  // toast consumer
  _consumeToast: () => ToastInput | null;
};

const StoreContext = createContext<StoreContextValue | null>(null);

// ------------------------- Provider -------------------------

// Simulation parameters
const TICK_MS = 2000; // real-time tick
const SIM_MINUTES_PER_TICK = 5; // each tick = 5 simulated minutes
const IRRIGATION_RISE_PER_TICK = 4.5; // % humidity gained per tick while watering
const LITROS_PER_TICK = 5.5; // liters consumed per tick while watering
const EVAP_BASE = 0.6; // base % humidity lost per tick
const EVAP_PER_DEGREE = 0.08; // additional loss per °C over 20°C
const MAX_HUMIDITY = 95;
const CRITICAL_LOW = 25;
const MAX_READINGS = 500;

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<State>(() => buildInitialState());
  const [hydrated, setHydrated] = useState(false);
  const toastQueue = useRef<ToastInput[]>([]);
  const readingIdRef = useRef<number>(
    seedLecturas.length ? Math.max(...seedLecturas.map((l) => l.lectura_id)) + 1 : 1,
  );

  // --- Hydrate from localStorage ---
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<State>;
        setState((prev) => ({ ...prev, ...parsed }));
        if (parsed.lecturas?.length) {
          readingIdRef.current = Math.max(...parsed.lecturas.map((l) => l.lectura_id)) + 1;
        }
      }
    } catch {
      /* ignore corrupt storage */
    }
    setHydrated(true);
  }, []);

  // --- Persist on change (debounced) ---
  useEffect(() => {
    if (!hydrated) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      } catch {
        /* quota error, ignore */
      }
    }, 400);
    return () => clearTimeout(id);
  }, [state, hydrated]);

  // --- Toast bridge ---
  const toast = useCallback((t: ToastInput) => {
    toastQueue.current.push(t);
  }, []);
  const _consumeToast = useCallback(() => {
    return toastQueue.current.shift() || null;
  }, []);

  // --- Auth ---
  const login = useCallback((email: string, password: string) => {
    const demo = DEMO_CREDENTIALS.find(
      (d) => d.email.toLowerCase() === email.toLowerCase() && d.password === password,
    );
    if (demo) {
      const existing = seedUsuarios.find((u) => u.email === demo.email);
      const authUser: AuthUser = {
        usuario_id: existing?.usuario_id || uuid(),
        nombre: demo.nombre,
        email: demo.email,
        rol: demo.rol,
      };
      setState((s) => ({ ...s, auth: authUser }));
      toast({ type: 'success', message: `Bienvenido, ${demo.nombre}` });
      return { ok: true };
    }
    return { ok: false, error: 'Credenciales inválidas' };
  }, [toast]);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, auth: null }));
    toast({ type: 'info', message: 'Sesión cerrada' });
  }, [toast]);

  const register = useCallback(
    (args: { nombre: string; email: string; password: string; rol: 'admin' | 'agricultor' }) => {
      // Simulated registration (no real credential storage — in-memory only)
      if (!args.email || !args.password) {
        return { ok: false, error: 'Email y contraseña son obligatorios' };
      }
      if (state.usuarios.some((u) => u.email.toLowerCase() === args.email.toLowerCase())) {
        return { ok: false, error: 'El email ya está registrado' };
      }
      const newUser: Usuario = {
        usuario_id: uuid(),
        nombre: args.nombre,
        email: args.email,
        rol: args.rol,
        fecha_creacion: new Date().toISOString(),
      };
      setState((s) => ({
        ...s,
        usuarios: [newUser, ...s.usuarios],
        auth: {
          usuario_id: newUser.usuario_id,
          nombre: newUser.nombre,
          email: newUser.email,
          rol: newUser.rol,
        },
      }));
      toast({ type: 'success', message: 'Cuenta creada correctamente' });
      return { ok: true };
    },
    [state.usuarios, toast],
  );

  // --- CRUD: Zonas ---
  const addZona = useCallback<StoreContextValue['addZona']>((z) => {
    setState((s) => {
      const zona_id = uuid();
      const nuevaZona: Zona = {
        zona_id,
        usuario_id: s.auth?.usuario_id || seedUsuarios[0].usuario_id,
        fecha_creacion: new Date().toISOString(),
        ...z,
      };
      const runtime = {
        ...s.runtime,
        [zona_id]: {
          zona_id,
          humedad_actual: 60,
          temperatura: 24,
          regando: false,
          riego_iniciado_en: null,
          riego_termina_en: null,
          activado_por: null,
          ultimo_riego_en: null,
          litros_en_curso: 0,
        },
      };
      return { ...s, zonas: [nuevaZona, ...s.zonas], runtime };
    });
    toast({ type: 'success', message: 'Zona creada correctamente' });
  }, [toast]);

  const updateZona = useCallback((id: string, patch: Partial<Zona>) => {
    setState((s) => ({
      ...s,
      zonas: s.zonas.map((z) => (z.zona_id === id ? { ...z, ...patch } : z)),
    }));
    toast({ type: 'success', message: 'Zona actualizada' });
  }, [toast]);

  const deleteZona = useCallback((id: string) => {
    setState((s) => {
      const runtime = { ...s.runtime };
      delete runtime[id];
      return {
        ...s,
        zonas: s.zonas.filter((z) => z.zona_id !== id),
        dispositivos: s.dispositivos.filter((d) => d.zona_id !== id),
        configs: s.configs.filter((c) => c.zona_id !== id),
        runtime,
      };
    });
    toast({ type: 'info', message: 'Zona eliminada' });
  }, [toast]);

  // --- CRUD: Dispositivos ---
  const addDispositivo = useCallback<StoreContextValue['addDispositivo']>((d) => {
    setState((s) => ({
      ...s,
      dispositivos: [
        {
          dispositivo_id: uuid(),
          ultima_conexion: new Date().toISOString(),
          ...d,
        },
        ...s.dispositivos,
      ],
    }));
    toast({ type: 'success', message: 'Dispositivo registrado' });
  }, [toast]);

  const updateDispositivo = useCallback((id: string, patch: Partial<Dispositivo>) => {
    setState((s) => ({
      ...s,
      dispositivos: s.dispositivos.map((d) =>
        d.dispositivo_id === id ? { ...d, ...patch } : d,
      ),
    }));
    toast({ type: 'success', message: 'Dispositivo actualizado' });
  }, [toast]);

  const deleteDispositivo = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      dispositivos: s.dispositivos.filter((d) => d.dispositivo_id !== id),
    }));
    toast({ type: 'info', message: 'Dispositivo eliminado' });
  }, [toast]);

  // --- CRUD: Usuarios ---
  const addUsuario = useCallback<StoreContextValue['addUsuario']>((u) => {
    setState((s) => ({
      ...s,
      usuarios: [
        {
          usuario_id: uuid(),
          fecha_creacion: new Date().toISOString(),
          nombre: u.nombre,
          email: u.email,
          rol: u.rol,
        },
        ...s.usuarios,
      ],
    }));
    toast({ type: 'success', message: 'Usuario creado' });
  }, [toast]);

  const updateUsuario = useCallback((id: string, patch: Partial<Usuario>) => {
    setState((s) => ({
      ...s,
      usuarios: s.usuarios.map((u) => (u.usuario_id === id ? { ...u, ...patch } : u)),
    }));
    toast({ type: 'success', message: 'Usuario actualizado' });
  }, [toast]);

  const deleteUsuario = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      usuarios: s.usuarios.filter((u) => u.usuario_id !== id),
    }));
    toast({ type: 'info', message: 'Usuario eliminado' });
  }, [toast]);

  // --- Configs ---
  const upsertConfig = useCallback((zona_id: string, patch: Partial<ConfiguracionRiego>) => {
    setState((s) => {
      const existing = s.configs.find((c) => c.zona_id === zona_id);
      if (existing) {
        return {
          ...s,
          configs: s.configs.map((c) => (c.zona_id === zona_id ? { ...c, ...patch } : c)),
        };
      }
      const nuevo: ConfiguracionRiego = {
        config_id: uuid(),
        zona_id,
        umbral_min_humedad: patch.umbral_min_humedad ?? 50,
        duracion_minutos: patch.duracion_minutos ?? 10,
        es_automatico: patch.es_automatico ?? true,
        activo: patch.activo ?? true,
      };
      return { ...s, configs: [nuevo, ...s.configs] };
    });
    toast({ type: 'success', message: 'Configuración guardada' });
  }, [toast]);

  // --- Irrigation control ---
  const startManualIrrigation = useCallback((zona_id: string) => {
    setState((s) => {
      const rt = s.runtime[zona_id];
      if (!rt || rt.regando) return s;
      const config = s.configs.find((c) => c.zona_id === zona_id);
      const duracion = config?.duracion_minutos ?? 10;
      const now = new Date();
      const ends = new Date(now.getTime() + duracion * 60 * 1000);
      return {
        ...s,
        runtime: {
          ...s.runtime,
          [zona_id]: {
            ...rt,
            regando: true,
            riego_iniciado_en: now.toISOString(),
            riego_termina_en: ends.toISOString(),
            activado_por: 'manual',
            litros_en_curso: 0,
          },
        },
      };
    });
    toast({ type: 'info', message: 'Riego manual iniciado' });
  }, [toast]);

  const stopIrrigation = useCallback((zona_id: string) => {
    setState((s) => {
      const rt = s.runtime[zona_id];
      if (!rt || !rt.regando) return s;
      const zona = s.zonas.find((z) => z.zona_id === zona_id);
      const nuevoHistorial: HistorialRiego = {
        riego_id: uuid(),
        zona_id,
        fecha_inicio: rt.riego_iniciado_en || new Date().toISOString(),
        fecha_fin: new Date().toISOString(),
        litros_consumidos: Math.round(rt.litros_en_curso),
        activado_por: rt.activado_por || 'manual',
      };
      const alerta: Alerta = {
        alerta_id: uuid(),
        usuario_id: s.auth?.usuario_id || seedUsuarios[0].usuario_id,
        tipo_alerta: 'riego_detenido',
        mensaje: `Riego detenido manualmente en ${zona?.nombre || 'la zona'}.`,
        leido: false,
        fecha_creacion: new Date().toISOString(),
      };
      return {
        ...s,
        runtime: {
          ...s.runtime,
          [zona_id]: {
            ...rt,
            regando: false,
            riego_iniciado_en: null,
            riego_termina_en: null,
            activado_por: null,
            ultimo_riego_en: new Date().toISOString(),
            litros_en_curso: 0,
          },
        },
        historial: [nuevoHistorial, ...s.historial].slice(0, 200),
        alertas: [alerta, ...s.alertas].slice(0, 100),
      };
    });
    toast({ type: 'warning', message: 'Riego detenido' });
  }, [toast]);

  // --- Alerts ---
  const resolveAlerta = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      alertas: s.alertas.map((a) => (a.alerta_id === id ? { ...a, leido: true } : a)),
    }));
  }, []);

  const markAllRead = useCallback(() => {
    setState((s) => ({
      ...s,
      alertas: s.alertas.map((a) => ({ ...a, leido: true })),
    }));
  }, []);

  // ------------------------- INTELLIGENT IRRIGATION TICK -------------------------
  useEffect(() => {
    if (!hydrated) return;
    const interval = setInterval(() => {
      setState((s) => {
        if (!s.auth) return s; // pause simulation when logged out

        const now = new Date();
        const nowIso = now.toISOString();
        const newRuntime = { ...s.runtime };
        const newReadings: LecturaHumedad[] = [];
        const newHistory: HistorialRiego[] = [];
        const newAlerts: Alerta[] = [];
        const triggeredToasts: ToastInput[] = [];

        s.zonas.forEach((zona) => {
          const rt = newRuntime[zona.zona_id];
          if (!rt) return;
          const config = s.configs.find((c) => c.zona_id === zona.zona_id);
          const sensores = s.dispositivos.filter(
            (d) =>
              d.zona_id === zona.zona_id &&
              d.tipo_dispositivo === 'sensor_humedad' &&
              d.estado_actual === 'online',
          );

          // Temperature drift
          let temp = rt.temperatura + (Math.random() - 0.5) * 0.8;
          temp = Math.max(14, Math.min(38, temp));

          let humedad = rt.humedad_actual;
          let regando = rt.regando;
          let riego_iniciado_en = rt.riego_iniciado_en;
          let riego_termina_en = rt.riego_termina_en;
          let activado_por = rt.activado_por;
          let litros_en_curso = rt.litros_en_curso;
          let ultimo_riego_en = rt.ultimo_riego_en;

          if (regando) {
            // Currently watering → humidity rises
            humedad = Math.min(MAX_HUMIDITY, humedad + IRRIGATION_RISE_PER_TICK + Math.random() * 0.5);
            litros_en_curso += LITROS_PER_TICK;

            const shouldStopByTime = riego_termina_en && now >= new Date(riego_termina_en);
            const shouldStopByTarget = config && humedad >= config.umbral_min_humedad + 20;

            if (shouldStopByTime || shouldStopByTarget) {
              const hist: HistorialRiego = {
                riego_id: uuid(),
                zona_id: zona.zona_id,
                fecha_inicio: riego_iniciado_en || nowIso,
                fecha_fin: nowIso,
                litros_consumidos: Math.round(litros_en_curso),
                activado_por: activado_por || 'sistema',
              };
              newHistory.push(hist);
              newAlerts.push({
                alerta_id: uuid(),
                usuario_id: s.auth!.usuario_id,
                tipo_alerta: 'riego_completado',
                mensaje: `Riego completado en ${zona.nombre} — ${Math.round(
                  litros_en_curso,
                )} L consumidos.`,
                leido: false,
                fecha_creacion: nowIso,
              });
              triggeredToasts.push({
                type: 'success',
                message: `Riego completado: ${zona.nombre}`,
              });
              regando = false;
              riego_iniciado_en = null;
              riego_termina_en = null;
              activado_por = null;
              litros_en_curso = 0;
              ultimo_riego_en = nowIso;
            }
          } else {
            // Evaporation — depends on temperature
            const evap = EVAP_BASE + Math.max(0, temp - 20) * EVAP_PER_DEGREE;
            humedad = Math.max(5, humedad - evap - Math.random() * 0.3);

            // Intelligent auto-watering decision
            if (
              config?.es_automatico &&
              config?.activo &&
              sensores.length > 0 &&
              humedad < config.umbral_min_humedad
            ) {
              // Avoid re-watering too soon (within last 20 simulated minutes)
              const recentlyWatered =
                ultimo_riego_en &&
                now.getTime() - new Date(ultimo_riego_en).getTime() <
                  20 * 60 * 1000;
              if (!recentlyWatered) {
                const endsAt = new Date(now.getTime() + config.duracion_minutos * 60 * 1000);
                regando = true;
                riego_iniciado_en = nowIso;
                riego_termina_en = endsAt.toISOString();
                activado_por = 'sistema';
                litros_en_curso = 0;
                newAlerts.push({
                  alerta_id: uuid(),
                  usuario_id: s.auth!.usuario_id,
                  tipo_alerta: 'riego_automatico',
                  mensaje: `Riego automático iniciado en ${zona.nombre} (humedad ${humedad.toFixed(
                    0,
                  )}% / umbral ${config.umbral_min_humedad}%).`,
                  leido: false,
                  fecha_creacion: nowIso,
                });
                triggeredToasts.push({
                  type: 'info',
                  message: `Riego inteligente activado en ${zona.nombre}`,
                });
              }
            }

            // Critical humidity alert
            if (humedad < CRITICAL_LOW && (!config?.es_automatico || !config?.activo)) {
              const alreadyAlerted = s.alertas.some(
                (a) =>
                  a.tipo_alerta === 'humedad_critica' &&
                  a.mensaje.includes(zona.nombre) &&
                  !a.leido,
              );
              if (!alreadyAlerted) {
                newAlerts.push({
                  alerta_id: uuid(),
                  usuario_id: s.auth!.usuario_id,
                  tipo_alerta: 'humedad_critica',
                  mensaje: `Humedad crítica en ${zona.nombre}: ${humedad.toFixed(0)}%. Requiere atención.`,
                  leido: false,
                  fecha_creacion: nowIso,
                });
              }
            }
          }

          // Emit reading from a sensor (average effectively)
          if (sensores.length > 0) {
            newReadings.push({
              lectura_id: readingIdRef.current++,
              dispositivo_id: sensores[0].dispositivo_id,
              valor_humedad: Number(humedad.toFixed(1)),
              fecha_hora: nowIso,
            });
          }

          newRuntime[zona.zona_id] = {
            ...rt,
            humedad_actual: Number(humedad.toFixed(1)),
            temperatura: Number(temp.toFixed(1)),
            regando,
            riego_iniciado_en,
            riego_termina_en,
            activado_por,
            litros_en_curso,
            ultimo_riego_en,
          };
        });

        // Advance "virtual" SIM_MINUTES_PER_TICK: readings already timestamped real-time.
        void SIM_MINUTES_PER_TICK;

        // Queue toasts
        triggeredToasts.forEach((t) => toastQueue.current.push(t));

        return {
          ...s,
          runtime: newRuntime,
          lecturas: [...newReadings, ...s.lecturas].slice(0, MAX_READINGS),
          historial: [...newHistory, ...s.historial].slice(0, 200),
          alertas: [...newAlerts, ...s.alertas].slice(0, 100),
        };
      });
    }, TICK_MS);
    return () => clearInterval(interval);
  }, [hydrated]);

  const value = useMemo<StoreContextValue>(
    () => ({
      state,
      login,
      logout,
      register,
      addZona,
      updateZona,
      deleteZona,
      addDispositivo,
      updateDispositivo,
      deleteDispositivo,
      addUsuario,
      updateUsuario,
      deleteUsuario,
      upsertConfig,
      startManualIrrigation,
      stopIrrigation,
      resolveAlerta,
      markAllRead,
      toast,
      _consumeToast,
    }),
    [
      state,
      login,
      logout,
      register,
      addZona,
      updateZona,
      deleteZona,
      addDispositivo,
      updateDispositivo,
      deleteDispositivo,
      addUsuario,
      updateUsuario,
      deleteUsuario,
      upsertConfig,
      startManualIrrigation,
      stopIrrigation,
      resolveAlerta,
      markAllRead,
      toast,
      _consumeToast,
    ],
  );

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}

// Selector helpers
export function useZonaRuntime(zona_id: string) {
  const { state } = useStore();
  return state.runtime[zona_id];
}
