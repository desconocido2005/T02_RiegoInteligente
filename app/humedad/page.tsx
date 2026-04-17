'use client';

import { Sidebar } from '@/components/sidebar';
import { TopBar } from '@/components/topbar';
import { HumidityChart } from '@/components/humidity-chart';
import { DataCard } from '@/components/data-card';
import { TrendingUp, TrendingDown, Cloud, Droplets } from 'lucide-react';

export default function HumedadPage() {
  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-64">
        <TopBar />

        <main className="flex-1 overflow-auto">
          <div className="p-8">
            <div>
              <h1 className="text-4xl font-bold text-foreground mb-2">Análisis de Humedad</h1>
              <p className="text-text-secondary mb-8">Datos detallados del contenido de humedad del suelo</p>
            </div>

            {/* KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <DataCard
                icon={Droplets}
                label="Humedad Promedio"
                value="65%"
                change="+2%"
                changeType="positive"
                color="primary"
              />
              <DataCard
                icon={TrendingUp}
                label="Máxima Registrada"
                value="89%"
                change="Hoy"
                changeType="neutral"
                color="info"
              />
              <DataCard
                icon={TrendingDown}
                label="Mínima Registrada"
                value="32%"
                change="Ayer"
                changeType="neutral"
                color="warning"
              />
              <DataCard
                icon={Cloud}
                label="Variabilidad"
                value="18%"
                change="Normal"
                changeType="neutral"
                color="secondary"
              />
            </div>

            {/* Chart */}
            <HumidityChart />
          </div>
        </main>
      </div>
    </div>
  );
}
