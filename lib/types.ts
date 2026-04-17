export type Usuario = {
  usuario_id: string;
  nombre: string;
  email: string;
  rol: 'admin' | 'agricultor';
  fecha_creacion: string;
};

export type Zona = {
  zona_id: string;
  usuario_id: string;
  nombre: string;
  descripcion: string | null;
  tipo_cultivo: string | null;
  area_metros_cuadrados: number | null;
  fecha_creacion: string;
};

export type Dispositivo = {
  dispositivo_id: string;
  zona_id: string;
  codigo_hardware: string;
  tipo_dispositivo: 'sensor_humedad' | 'valvula_riego';
  estado_actual: string;
  ultima_conexion: string | null;
};

export type LecturaHumedad = {
  lectura_id: number;
  dispositivo_id: string;
  valor_humedad: number;
  fecha_hora: string;
};

export type ConfiguracionRiego = {
  config_id: string;
  zona_id: string;
  umbral_min_humedad: number;
  duracion_minutos: number;
  es_automatico: boolean;
  activo: boolean;
};

export type HistorialRiego = {
  riego_id: string;
  zona_id: string;
  fecha_inicio: string;
  fecha_fin: string | null;
  litros_consumidos: number;
  activado_por: 'sistema' | 'manual';
};

export type Alerta = {
  alerta_id: string;
  usuario_id: string;
  tipo_alerta: string | null;
  mensaje: string;
  leido: boolean;
  fecha_creacion: string;
};
