// Mock data seed + demo credentials for the intelligent irrigation platform.
// No database — everything lives in memory (with localStorage persistence).

import type {
  Alerta,
  ConfiguracionRiego,
  Dispositivo,
  HistorialRiego,
  LecturaHumedad,
  Usuario,
  Zona,
} from './types';

// --- Demo credentials (shown on login page) ---
export const DEMO_CREDENTIALS = [
  {
    email: 'admin@verdant.com',
    password: 'admin123',
    nombre: 'Juan Heras',
    rol: 'admin' as const,
  },
  {
    email: 'agricultor@verdant.com',
    password: 'agricultor123',
    nombre: 'María López',
    rol: 'agricultor' as const,
  },
];

// Stable UUID-ish ids for seeded data
const uid = (seed: string) => `00000000-0000-0000-0000-${seed.padStart(12, '0')}`;

// --- Users ---
export const seedUsuarios: Usuario[] = [
  {
    usuario_id: uid('1'),
    nombre: 'Juan Heras',
    email: 'admin@verdant.com',
    rol: 'admin',
    fecha_creacion: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    usuario_id: uid('2'),
    nombre: 'María López',
    email: 'agricultor@verdant.com',
    rol: 'agricultor',
    fecha_creacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    usuario_id: uid('3'),
    nombre: 'Carlos Ruiz',
    email: 'carlos@verdant.com',
    rol: 'agricultor',
    fecha_creacion: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// --- Zones ---
export const seedZonas: Zona[] = [
  {
    zona_id: uid('z1'),
    usuario_id: uid('1'),
    nombre: 'Zona Norte — Tomates',
    descripcion: 'Cultivo de tomates en campo abierto, exposición solar alta.',
    tipo_cultivo: 'Tomate',
    area_metros_cuadrados: 450,
    fecha_creacion: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    zona_id: uid('z2'),
    usuario_id: uid('1'),
    nombre: 'Zona Sur — Lechugas',
    descripcion: 'Huerto de lechugas con media sombra.',
    tipo_cultivo: 'Lechuga',
    area_metros_cuadrados: 280,
    fecha_creacion: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    zona_id: uid('z3'),
    usuario_id: uid('1'),
    nombre: 'Invernadero — Fresas',
    descripcion: 'Invernadero climatizado para fresas.',
    tipo_cultivo: 'Fresa',
    area_metros_cuadrados: 180,
    fecha_creacion: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    zona_id: uid('z4'),
    usuario_id: uid('1'),
    nombre: 'Zona Oeste — Maíz',
    descripcion: 'Maíz dulce, parcela amplia al oeste.',
    tipo_cultivo: 'Maíz',
    area_metros_cuadrados: 620,
    fecha_creacion: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

// --- Devices ---
export const seedDispositivos: Dispositivo[] = [
  {
    dispositivo_id: uid('d1'),
    zona_id: uid('z1'),
    codigo_hardware: 'ESP32-NORTE-S01',
    tipo_dispositivo: 'sensor_humedad',
    estado_actual: 'online',
    ultima_conexion: new Date().toISOString(),
  },
  {
    dispositivo_id: uid('d2'),
    zona_id: uid('z1'),
    codigo_hardware: 'VALV-NORTE-01',
    tipo_dispositivo: 'valvula_riego',
    estado_actual: 'online',
    ultima_conexion: new Date().toISOString(),
  },
  {
    dispositivo_id: uid('d3'),
    zona_id: uid('z2'),
    codigo_hardware: 'ESP32-SUR-S01',
    tipo_dispositivo: 'sensor_humedad',
    estado_actual: 'online',
    ultima_conexion: new Date().toISOString(),
  },
  {
    dispositivo_id: uid('d4'),
    zona_id: uid('z2'),
    codigo_hardware: 'VALV-SUR-01',
    tipo_dispositivo: 'valvula_riego',
    estado_actual: 'online',
    ultima_conexion: new Date().toISOString(),
  },
  {
    dispositivo_id: uid('d5'),
    zona_id: uid('z3'),
    codigo_hardware: 'ESP32-INV-S01',
    tipo_dispositivo: 'sensor_humedad',
    estado_actual: 'online',
    ultima_conexion: new Date().toISOString(),
  },
  {
    dispositivo_id: uid('d6'),
    zona_id: uid('z3'),
    codigo_hardware: 'VALV-INV-01',
    tipo_dispositivo: 'valvula_riego',
    estado_actual: 'online',
    ultima_conexion: new Date().toISOString(),
  },
  {
    dispositivo_id: uid('d7'),
    zona_id: uid('z4'),
    codigo_hardware: 'ESP32-OESTE-S01',
    tipo_dispositivo: 'sensor_humedad',
    estado_actual: 'offline',
    ultima_conexion: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    dispositivo_id: uid('d8'),
    zona_id: uid('z4'),
    codigo_hardware: 'VALV-OESTE-01',
    tipo_dispositivo: 'valvula_riego',
    estado_actual: 'online',
    ultima_conexion: new Date().toISOString(),
  },
];

// --- Irrigation configurations (one per zone) ---
export const seedConfiguraciones: ConfiguracionRiego[] = [
  {
    config_id: uid('c1'),
    zona_id: uid('z1'),
    umbral_min_humedad: 45,
    duracion_minutos: 12,
    es_automatico: true,
    activo: true,
  },
  {
    config_id: uid('c2'),
    zona_id: uid('z2'),
    umbral_min_humedad: 55,
    duracion_minutos: 8,
    es_automatico: true,
    activo: true,
  },
  {
    config_id: uid('c3'),
    zona_id: uid('z3'),
    umbral_min_humedad: 60,
    duracion_minutos: 10,
    es_automatico: true,
    activo: true,
  },
  {
    config_id: uid('c4'),
    zona_id: uid('z4'),
    umbral_min_humedad: 40,
    duracion_minutos: 15,
    es_automatico: false,
    activo: true,
  },
];

// --- Starter readings (last few hours per sensor) ---
function generarLecturasIniciales(): LecturaHumedad[] {
  const sensores = seedDispositivos.filter((d) => d.tipo_dispositivo === 'sensor_humedad');
  const readings: LecturaHumedad[] = [];
  let idCounter = 1;
  const now = Date.now();

  sensores.forEach((s) => {
    const base = 55 + Math.random() * 15;
    for (let i = 24; i >= 0; i--) {
      const noise = (Math.random() - 0.5) * 6;
      const valor = Math.max(20, Math.min(95, base + noise - i * 0.3));
      readings.push({
        lectura_id: idCounter++,
        dispositivo_id: s.dispositivo_id,
        valor_humedad: Number(valor.toFixed(1)),
        fecha_hora: new Date(now - i * 60 * 60 * 1000).toISOString(),
      });
    }
  });
  return readings;
}

export const seedLecturas: LecturaHumedad[] = generarLecturasIniciales();

// --- Starter history ---
export const seedHistorial: HistorialRiego[] = [
  {
    riego_id: uid('h1'),
    zona_id: uid('z1'),
    fecha_inicio: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    fecha_fin: new Date(Date.now() - 6 * 60 * 60 * 1000 + 12 * 60 * 1000).toISOString(),
    litros_consumidos: 132,
    activado_por: 'sistema',
  },
  {
    riego_id: uid('h2'),
    zona_id: uid('z2'),
    fecha_inicio: new Date(Date.now() - 10 * 60 * 60 * 1000).toISOString(),
    fecha_fin: new Date(Date.now() - 10 * 60 * 60 * 1000 + 8 * 60 * 1000).toISOString(),
    litros_consumidos: 78,
    activado_por: 'sistema',
  },
  {
    riego_id: uid('h3'),
    zona_id: uid('z3'),
    fecha_inicio: new Date(Date.now() - 14 * 60 * 60 * 1000).toISOString(),
    fecha_fin: new Date(Date.now() - 14 * 60 * 60 * 1000 + 10 * 60 * 1000).toISOString(),
    litros_consumidos: 95,
    activado_por: 'manual',
  },
  {
    riego_id: uid('h4'),
    zona_id: uid('z1'),
    fecha_inicio: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    fecha_fin: new Date(Date.now() - 24 * 60 * 60 * 1000 + 12 * 60 * 1000).toISOString(),
    litros_consumidos: 128,
    activado_por: 'sistema',
  },
];

// --- Starter alerts ---
export const seedAlertas: Alerta[] = [
  {
    alerta_id: uid('a1'),
    usuario_id: uid('1'),
    tipo_alerta: 'falla_dispositivo',
    mensaje: 'Sensor ESP32-OESTE-S01 sin conexión hace 3 horas.',
    leido: false,
    fecha_creacion: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
  },
  {
    alerta_id: uid('a2'),
    usuario_id: uid('1'),
    tipo_alerta: 'riego_completado',
    mensaje: 'Riego automático completado en Zona Norte — Tomates (132 L).',
    leido: true,
    fecha_creacion: new Date(Date.now() - 6 * 60 * 60 * 1000 + 12 * 60 * 1000).toISOString(),
  },
];
