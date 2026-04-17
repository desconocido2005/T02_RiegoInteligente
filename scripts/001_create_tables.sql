-- Sistema de Riego Inteligente - Esquema de Base de Datos
-- Motor: PostgreSQL (Supabase)

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Gestión de Usuarios
CREATE TABLE IF NOT EXISTS usuarios (
    usuario_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    nombre VARCHAR(100) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('admin', 'agricultor')) DEFAULT 'agricultor',
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. Zonas de Cultivo
CREATE TABLE IF NOT EXISTS zonas (
    zona_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    tipo_cultivo VARCHAR(50),
    area_metros_cuadrados DECIMAL(10,2),
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. Dispositivos IoT
CREATE TABLE IF NOT EXISTS dispositivos (
    dispositivo_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zona_id UUID REFERENCES zonas(zona_id) ON DELETE CASCADE,
    codigo_hardware VARCHAR(50) UNIQUE NOT NULL,
    tipo_dispositivo VARCHAR(20) CHECK (tipo_dispositivo IN ('sensor_humedad', 'valvula_riego')),
    estado_actual VARCHAR(20) DEFAULT 'offline',
    ultima_conexion TIMESTAMP WITH TIME ZONE
);

-- 4. Lecturas de Sensores
CREATE TABLE IF NOT EXISTS lecturas_humedad (
    lectura_id BIGSERIAL PRIMARY KEY,
    dispositivo_id UUID REFERENCES dispositivos(dispositivo_id) ON DELETE CASCADE,
    valor_humedad DECIMAL(5,2) NOT NULL,
    fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Configuración de Riego
CREATE TABLE IF NOT EXISTS configuracion_riego (
    config_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zona_id UUID REFERENCES zonas(zona_id) ON DELETE CASCADE,
    umbral_min_humedad DECIMAL(5,2) NOT NULL,
    duracion_minutos INTEGER NOT NULL,
    es_automatico BOOLEAN DEFAULT TRUE,
    activo BOOLEAN DEFAULT TRUE
);

-- 6. Historial de Riego
CREATE TABLE IF NOT EXISTS historial_riego (
    riego_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zona_id UUID REFERENCES zonas(zona_id) ON DELETE CASCADE,
    fecha_inicio TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    fecha_fin TIMESTAMP WITH TIME ZONE,
    litros_consumidos DECIMAL(12,2) DEFAULT 0,
    activado_por VARCHAR(20) CHECK (activado_por IN ('sistema', 'manual'))
);

-- 7. Alertas
CREATE TABLE IF NOT EXISTS alertas (
    alerta_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    usuario_id UUID REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    tipo_alerta VARCHAR(50),
    mensaje TEXT NOT NULL,
    leido BOOLEAN DEFAULT FALSE,
    fecha_creacion TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_lecturas_fecha ON lecturas_humedad(fecha_hora DESC);
CREATE INDEX IF NOT EXISTS idx_historial_zona_fecha ON historial_riego(zona_id, fecha_inicio DESC);
CREATE INDEX IF NOT EXISTS idx_dispositivos_zona ON dispositivos(zona_id);
CREATE INDEX IF NOT EXISTS idx_alertas_usuario ON alertas(usuario_id, leido);

-- Deshabilitar RLS para acceso público (demo)
ALTER TABLE usuarios DISABLE ROW LEVEL SECURITY;
ALTER TABLE zonas DISABLE ROW LEVEL SECURITY;
ALTER TABLE dispositivos DISABLE ROW LEVEL SECURITY;
ALTER TABLE lecturas_humedad DISABLE ROW LEVEL SECURITY;
ALTER TABLE configuracion_riego DISABLE ROW LEVEL SECURITY;
ALTER TABLE historial_riego DISABLE ROW LEVEL SECURITY;
ALTER TABLE alertas DISABLE ROW LEVEL SECURITY;
