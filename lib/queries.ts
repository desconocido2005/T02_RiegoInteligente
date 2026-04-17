import { createClient } from '@/lib/supabase/server';

// ============ DASHBOARD / STATS ============

export async function getDashboardStats() {
  const supabase = await createClient();

  const [zonasRes, dispositivosRes, alertasRes, consumoHoyRes] = await Promise.all([
    supabase.from('zonas').select('zona_id', { count: 'exact', head: true }),
    supabase.from('dispositivos').select('dispositivo_id, estado_actual'),
    supabase.from('alertas').select('alerta_id, leido').eq('leido', false),
    supabase
      .from('historial_riego')
      .select('litros_consumidos')
      .gte('fecha_inicio', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()),
  ]);

  const dispositivosOnline = dispositivosRes.data?.filter(d => d.estado_actual === 'online').length || 0;
  const totalDispositivos = dispositivosRes.data?.length || 0;
  const alertasActivas = alertasRes.data?.length || 0;
  const consumoHoy = consumoHoyRes.data?.reduce((sum, r) => sum + Number(r.litros_consumidos), 0) || 0;

  return {
    totalZonas: zonasRes.count || 0,
    dispositivosOnline,
    totalDispositivos,
    alertasActivas,
    consumoHoy: Math.round(consumoHoy),
  };
}

export async function getPromedioHumedad() {
  const supabase = await createClient();

  const since = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { data } = await supabase
    .from('lecturas_humedad')
    .select('valor_humedad')
    .gte('fecha_hora', since);

  if (!data || data.length === 0) return 0;
  const avg = data.reduce((a, b) => a + Number(b.valor_humedad), 0) / data.length;
  return Math.round(avg);
}

// ============ CHARTS DATA ============

export async function getHumidityChartData() {
  const supabase = await createClient();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('lecturas_humedad')
    .select('valor_humedad, fecha_hora')
    .gte('fecha_hora', since)
    .order('fecha_hora', { ascending: true });

  if (!data) return [];

  // Group by hour
  const byHour = new Map<string, { sum: number; count: number }>();
  data.forEach(d => {
    const hour = new Date(d.fecha_hora).getHours().toString().padStart(2, '0') + ':00';
    const existing = byHour.get(hour) || { sum: 0, count: 0 };
    byHour.set(hour, {
      sum: existing.sum + Number(d.valor_humedad),
      count: existing.count + 1,
    });
  });

  return Array.from(byHour.entries())
    .map(([time, { sum, count }]) => ({
      time,
      humidity: Math.round(sum / count),
    }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

export async function getConsumptionChartData() {
  const supabase = await createClient();
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  const { data } = await supabase
    .from('historial_riego')
    .select('litros_consumidos, fecha_inicio')
    .gte('fecha_inicio', since)
    .order('fecha_inicio', { ascending: true });

  if (!data) return [];

  const diasSemana = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const byDay = new Map<number, number>();

  data.forEach(d => {
    const dayIdx = new Date(d.fecha_inicio).getDay();
    byDay.set(dayIdx, (byDay.get(dayIdx) || 0) + Number(d.litros_consumidos));
  });

  // Get last 7 days ordered
  const result = [];
  const today = new Date().getDay();
  for (let i = 6; i >= 0; i--) {
    const dayIdx = (today - i + 7) % 7;
    result.push({
      day: diasSemana[dayIdx],
      consumption: Math.round(byDay.get(dayIdx) || 0),
    });
  }
  return result;
}

// ============ ZONAS ============

export async function getZonasWithDetails() {
  const supabase = await createClient();

  const { data: zonas } = await supabase
    .from('zonas')
    .select('*')
    .order('fecha_creacion', { ascending: false });

  if (!zonas) return [];

  // Get latest humidity and last irrigation per zone
  const zonasConDetalles = await Promise.all(
    zonas.map(async (zona) => {
      const { data: dispositivos } = await supabase
        .from('dispositivos')
        .select('dispositivo_id, tipo_dispositivo')
        .eq('zona_id', zona.zona_id)
        .eq('tipo_dispositivo', 'sensor_humedad');

      let humedadActual = 0;
      if (dispositivos && dispositivos.length > 0) {
        const sensorIds = dispositivos.map(d => d.dispositivo_id);
        const { data: lecturas } = await supabase
          .from('lecturas_humedad')
          .select('valor_humedad')
          .in('dispositivo_id', sensorIds)
          .order('fecha_hora', { ascending: false })
          .limit(dispositivos.length);
        if (lecturas && lecturas.length > 0) {
          humedadActual = Math.round(
            lecturas.reduce((a, b) => a + Number(b.valor_humedad), 0) / lecturas.length
          );
        }
      }

      const { data: ultimoRiego } = await supabase
        .from('historial_riego')
        .select('fecha_inicio')
        .eq('zona_id', zona.zona_id)
        .order('fecha_inicio', { ascending: false })
        .limit(1)
        .maybeSingle();

      return {
        ...zona,
        humedad: humedadActual,
        ultimoRiego: ultimoRiego?.fecha_inicio || null,
      };
    })
  );

  return zonasConDetalles;
}

// ============ DISPOSITIVOS ============

export async function getDispositivosWithZonas() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('dispositivos')
    .select(`
      *,
      zonas (
        nombre,
        tipo_cultivo
      )
    `)
    .order('codigo_hardware', { ascending: true });

  return data || [];
}

// ============ ALERTAS ============

export async function getAlertas() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('alertas')
    .select('*')
    .order('fecha_creacion', { ascending: false })
    .limit(50);

  return data || [];
}

// ============ HISTORIAL ============

export async function getHistorialRiego() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('historial_riego')
    .select(`
      *,
      zonas (
        nombre,
        tipo_cultivo
      )
    `)
    .order('fecha_inicio', { ascending: false })
    .limit(100);

  return data || [];
}

// ============ USUARIOS ============

export async function getUsuarios() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('usuarios')
    .select('usuario_id, nombre, email, rol, fecha_creacion')
    .order('fecha_creacion', { ascending: false });

  return data || [];
}

// ============ LECTURAS HUMEDAD DETALLE ============

export async function getLecturasHumedadPorZona() {
  const supabase = await createClient();

  const { data: zonas } = await supabase.from('zonas').select('zona_id, nombre');
  if (!zonas) return [];

  const result = await Promise.all(
    zonas.map(async (zona) => {
      const { data: dispositivos } = await supabase
        .from('dispositivos')
        .select('dispositivo_id')
        .eq('zona_id', zona.zona_id)
        .eq('tipo_dispositivo', 'sensor_humedad');

      if (!dispositivos || dispositivos.length === 0) {
        return { ...zona, promedio: 0, lecturas: 0, ultima: null };
      }

      const ids = dispositivos.map(d => d.dispositivo_id);
      const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
      const { data: lecturas } = await supabase
        .from('lecturas_humedad')
        .select('valor_humedad, fecha_hora')
        .in('dispositivo_id', ids)
        .gte('fecha_hora', since)
        .order('fecha_hora', { ascending: false });

      const promedio = lecturas && lecturas.length > 0
        ? Math.round(lecturas.reduce((a, b) => a + Number(b.valor_humedad), 0) / lecturas.length)
        : 0;

      return {
        ...zona,
        promedio,
        lecturas: lecturas?.length || 0,
        ultima: lecturas?.[0]?.fecha_hora || null,
      };
    })
  );

  return result;
}

// ============ CONFIGURACION ============

export async function getConfiguraciones() {
  const supabase = await createClient();

  const { data } = await supabase
    .from('configuracion_riego')
    .select(`
      *,
      zonas (
        nombre,
        tipo_cultivo
      )
    `);

  return data || [];
}
