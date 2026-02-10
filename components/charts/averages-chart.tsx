'use client';

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface AveragesChartProps {
  data: {
    coordinacion: number;
    puntualidad: number;
    transporte: number;
    instalacion: number;
    profesionalismo: number;
    comunicacion: number;
    general: number;
  };
}

const COLORS = ['#60B5FF', '#FF9149', '#80D8C3', '#FF90BB', '#A19AD3', '#72BF78', '#F7DC6F'];

export function AveragesChart({ data }: AveragesChartProps) {
  const chartData = [
    { name: 'Coordinación', value: Number(data?.coordinacion?.toFixed(1) || 0) },
    { name: 'Puntualidad', value: Number(data?.puntualidad?.toFixed(1) || 0) },
    { name: 'Transporte', value: Number(data?.transporte?.toFixed(1) || 0) },
    { name: 'Instalación', value: Number(data?.instalacion?.toFixed(1) || 0) },
    { name: 'Profesionalismo', value: Number(data?.profesionalismo?.toFixed(1) || 0) },
    { name: 'Comunicación', value: Number(data?.comunicacion?.toFixed(1) || 0) },
    { name: 'Satisfacción\nGeneral', value: Number(data?.general?.toFixed(1) || 0) },
  ];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData} margin={{ top: 20, right: 20, bottom: 70, left: 20 }}>
        <XAxis
          dataKey="name"
          angle={-45}
          textAnchor="end"
          height={90}
          tickLine={false}
          tick={{ fontSize: 10 }}
          label={{
            value: 'Fase del Proceso',
            position: 'insideBottom',
            offset: -20,
            style: { textAnchor: 'middle', fontSize: 11, fontWeight: 600 },
          }}
        />
        <YAxis
          domain={[0, 7]}
          tickLine={false}
          tick={{ fontSize: 10 }}
          label={{
            value: 'Promedio',
            angle: -90,
            position: 'insideLeft',
            style: { textAnchor: 'middle', fontSize: 11, fontWeight: 600 },
          }}
        />
        <Tooltip
          wrapperStyle={{ fontSize: 11 }}
          contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0' }}
          formatter={(value: any) => [`${value}/7`, 'Promedio']}
        />
        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}
