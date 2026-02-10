'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface DistributionChartProps {
  data: Record<string, number>;
  title: string;
  colors?: Record<string, string>;
}

const DEFAULT_COLORS: Record<string, string> = {
  // Puntualidad (Q2) - Nuevas opciones
  'Sí, en fecha y hora': '#72BF78',
  'Sí en fecha, pero fuera de horario': '#FF9149',
  'No, llegó en otra fecha': '#FF6363',
  
  // Cuidado (Q5) - Nuevas opciones
  'Sí, excelente cuidado': '#72BF78',
  'Sí, cuidado suficiente': '#80D8C3',
  'Poco cuidado': '#FF9149',
  'Nada de cuidado': '#FF6363',
  
  // Resultado (Q6) - Nuevas opciones
  'Sí, todo perfecto': '#72BF78',
  'Sí, con detalles menores': '#FF9149',
  'No, hubo problemas': '#FF6363',
  
  // Opciones legacy para compatibilidad
  'Antes de lo comprometido': '#72BF78',
  'En la fecha comprometida': '#80D8C3',
  'Después de lo comprometido': '#FF6363',
  'Sí': '#72BF78',
  'No, llegó antes': '#80D8C3',
  'No, llegó después': '#FF6363',
  'Sí, pero con algún detalle menor': '#FF9149',
  'No, hubo problemas o faltantes': '#FF6363',
  'Sí, completamente': '#72BF78',
  'Más o menos': '#FF9149',
  'No, quedó desordenado/sucio': '#FF6363',
  'Mucho cuidado': '#72BF78',
  'Suficiente cuidado': '#80D8C3',
};

export function DistributionChart({ data, title, colors }: DistributionChartProps) {
  const chartData = Object.entries(data || {})
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({ name, value }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-slate-600 font-medium rounded">
        No hay datos disponibles
      </div>
    );
  }

  const colorMap = colors || DEFAULT_COLORS;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
            const RADIAN = Math.PI / 180;
            const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
            const x = cx + radius * Math.cos(-midAngle * RADIAN);
            const y = cy + radius * Math.sin(-midAngle * RADIAN);
            return (
              <text x={x} y={y} fill="#1e293b" textAnchor="middle" dominantBaseline="central" fontSize={11} fontWeight={600}>
                {`${(percent * 100).toFixed(0)}%`}
              </text>
            );
          }}
          outerRadius={70}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={colorMap[entry.name] || '#60B5FF'}
            />
          ))}
        </Pie>
        <Tooltip 
          wrapperStyle={{ fontSize: 11 }}
          contentStyle={{ 
            backgroundColor: '#fff', 
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#1e293b'
          }}
        />
        <Legend
          verticalAlign="bottom"
          wrapperStyle={{ 
            fontSize: 10, 
            paddingTop: '10px',
            color: '#334155'
          }}
          formatter={(value) => <span style={{ color: '#334155' }}>{value}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
