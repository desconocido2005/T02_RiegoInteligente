-- Seed data para el Sistema de Riego Inteligente
-- Primero limpiamos datos existentes

DELETE FROM alertas;
DELETE FROM historial_riego;
DELETE FROM configuracion_riego;
DELETE FROM lecturas_humedad;
DELETE FROM dispositivos;
DELETE FROM zonas;
DELETE FROM usuarios;

-- 1. Usuarios
INSERT INTO usuarios (usuario_id, nombre, email, password_hash, rol) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Jhon Silva', 'jhon@riego.com', 'hash_demo_admin', 'admin'),
  ('22222222-2222-2222-2222-222222222222', 'Maria Gomez', 'maria@riego.com', 'hash_demo_user1', 'agricultor'),
  ('33333333-3333-3333-3333-333333333333', 'Carlos Ruiz', 'carlos@riego.com', 'hash_demo_user2', 'agricultor'),
  ('44444444-4444-4444-4444-444444444444', 'Ana Torres', 'ana@riego.com', 'hash_demo_user3', 'agricultor');

-- 2. Zonas
INSERT INTO zonas (zona_id, usuario_id, nombre, descripcion, tipo_cultivo, area_metros_cuadrados) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Zona Norte - Cultivos A', 'Sector dedicado a cultivo de maiz', 'Maiz', 1500.50),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '11111111-1111-1111-1111-111111111111', 'Zona Sur - Cultivos B', 'Sector de hortalizas variadas', 'Hortalizas', 800.25),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Zona Este - Invernadero', 'Invernadero de tomates organicos', 'Tomate', 450.00),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '22222222-2222-2222-2222-222222222222', 'Zona Oeste - Frutales', 'Arboles frutales variados', 'Frutales', 2000.00);

-- 3. Dispositivos
INSERT INTO dispositivos (dispositivo_id, zona_id, codigo_hardware, tipo_dispositivo, estado_actual, ultima_conexion) VALUES
  ('d1111111-1111-1111-1111-111111111111', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ESP32-NORTE-001', 'sensor_humedad', 'online', CURRENT_TIMESTAMP),
  ('d2222222-2222-2222-2222-222222222222', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'ESP32-NORTE-VAL1', 'valvula_riego', 'online', CURRENT_TIMESTAMP),
  ('d3333333-3333-3333-3333-333333333333', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ESP32-SUR-001', 'sensor_humedad', 'online', CURRENT_TIMESTAMP - INTERVAL '5 minutes'),
  ('d4444444-4444-4444-4444-444444444444', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'ESP32-SUR-VAL1', 'valvula_riego', 'online', CURRENT_TIMESTAMP),
  ('d5555555-5555-5555-5555-555555555555', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'ESP32-ESTE-001', 'sensor_humedad', 'online', CURRENT_TIMESTAMP),
  ('d6666666-6666-6666-6666-666666666666', 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'ESP32-ESTE-VAL1', 'valvula_riego', 'offline', CURRENT_TIMESTAMP - INTERVAL '2 hours'),
  ('d7777777-7777-7777-7777-777777777777', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'ESP32-OESTE-001', 'sensor_humedad', 'online', CURRENT_TIMESTAMP),
  ('d8888888-8888-8888-8888-888888888888', 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'ESP32-OESTE-VAL1', 'valvula_riego', 'online', CURRENT_TIMESTAMP);

-- 4. Lecturas de humedad (ultimas 24 horas)
-- Zona Norte
INSERT INTO lecturas_humedad (dispositivo_id, valor_humedad, fecha_hora)
SELECT 'd1111111-1111-1111-1111-111111111111', 55 + random() * 20, CURRENT_TIMESTAMP - (n || ' hours')::interval
FROM generate_series(0, 23) n;

-- Zona Sur
INSERT INTO lecturas_humedad (dispositivo_id, valor_humedad, fecha_hora)
SELECT 'd3333333-3333-3333-3333-333333333333', 45 + random() * 25, CURRENT_TIMESTAMP - (n || ' hours')::interval
FROM generate_series(0, 23) n;

-- Zona Este (humedad baja - alerta)
INSERT INTO lecturas_humedad (dispositivo_id, valor_humedad, fecha_hora)
SELECT 'd5555555-5555-5555-5555-555555555555', 20 + random() * 15, CURRENT_TIMESTAMP - (n || ' hours')::interval
FROM generate_series(0, 23) n;

-- Zona Oeste
INSERT INTO lecturas_humedad (dispositivo_id, valor_humedad, fecha_hora)
SELECT 'd7777777-7777-7777-7777-777777777777', 60 + random() * 20, CURRENT_TIMESTAMP - (n || ' hours')::interval
FROM generate_series(0, 23) n;

-- 5. Configuracion de riego
INSERT INTO configuracion_riego (zona_id, umbral_min_humedad, duracion_minutos, es_automatico, activo) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 40.00, 15, true, true),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 35.00, 20, true, true),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', 50.00, 10, true, true),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', 45.00, 25, false, true);

-- 6. Historial de riego (ultimos 7 dias)
INSERT INTO historial_riego (zona_id, fecha_inicio, fecha_fin, litros_consumidos, activado_por) VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_TIMESTAMP - INTERVAL '2 hours', CURRENT_TIMESTAMP - INTERVAL '1 hour 45 minutes', 120.50, 'sistema'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_TIMESTAMP - INTERVAL '4 hours', CURRENT_TIMESTAMP - INTERVAL '3 hours 40 minutes', 95.25, 'sistema'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', CURRENT_TIMESTAMP - INTERVAL '6 hours', CURRENT_TIMESTAMP - INTERVAL '5 hours 50 minutes', 45.75, 'manual'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', CURRENT_TIMESTAMP - INTERVAL '1 day', CURRENT_TIMESTAMP - INTERVAL '23 hours 35 minutes', 180.00, 'sistema'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_TIMESTAMP - INTERVAL '1 day 3 hours', CURRENT_TIMESTAMP - INTERVAL '1 day 2 hours 45 minutes', 115.30, 'sistema'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_TIMESTAMP - INTERVAL '2 days', CURRENT_TIMESTAMP - INTERVAL '1 day 23 hours 40 minutes', 88.90, 'sistema'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', CURRENT_TIMESTAMP - INTERVAL '2 days 4 hours', CURRENT_TIMESTAMP - INTERVAL '2 days 3 hours 50 minutes', 52.15, 'manual'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', CURRENT_TIMESTAMP - INTERVAL '3 days', CURRENT_TIMESTAMP - INTERVAL '2 days 23 hours 35 minutes', 165.40, 'sistema'),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', CURRENT_TIMESTAMP - INTERVAL '4 days', CURRENT_TIMESTAMP - INTERVAL '3 days 23 hours 45 minutes', 130.00, 'sistema'),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP - INTERVAL '4 days 23 hours 40 minutes', 102.55, 'sistema'),
  ('cccccccc-cccc-cccc-cccc-cccccccccccc', CURRENT_TIMESTAMP - INTERVAL '6 days', CURRENT_TIMESTAMP - INTERVAL '5 days 23 hours 50 minutes', 48.00, 'manual'),
  ('dddddddd-dddd-dddd-dddd-dddddddddddd', CURRENT_TIMESTAMP - INTERVAL '7 days', CURRENT_TIMESTAMP - INTERVAL '6 days 23 hours 35 minutes', 175.80, 'sistema');

-- 7. Alertas
INSERT INTO alertas (usuario_id, tipo_alerta, mensaje, leido, fecha_creacion) VALUES
  ('11111111-1111-1111-1111-111111111111', 'humedad_critica', 'La humedad en Zona Este - Invernadero ha caido por debajo del 30%. Se recomienda riego inmediato.', false, CURRENT_TIMESTAMP - INTERVAL '15 minutes'),
  ('11111111-1111-1111-1111-111111111111', 'falla_dispositivo', 'La valvula ESP32-ESTE-VAL1 esta offline desde hace 2 horas.', false, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
  ('22222222-2222-2222-2222-222222222222', 'humedad_critica', 'Temperatura elevada detectada en Zona Este - Invernadero.', false, CURRENT_TIMESTAMP - INTERVAL '1 hour'),
  ('11111111-1111-1111-1111-111111111111', 'riego_completado', 'Riego automatico completado en Zona Norte - 120.50L consumidos.', true, CURRENT_TIMESTAMP - INTERVAL '2 hours'),
  ('22222222-2222-2222-2222-222222222222', 'riego_completado', 'Riego automatico completado en Zona Sur - 95.25L consumidos.', true, CURRENT_TIMESTAMP - INTERVAL '4 hours');
