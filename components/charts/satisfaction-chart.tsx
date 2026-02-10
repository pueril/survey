'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface SatisfactionChartProps {
  data: {
    'Muy satisfecho': number;
    'Satisfecho': number;
    'Neutral': number;
    'Insatisfecho': number;
    'Muy insatisfecho': number;
  };
  title: string;
}

const COLORS = {
  'Muy satisfecho': '#72BF78',
  'Satisfecho': '#80D8C3',
  'Neutral': '#60B5FF',
  'Insatisfecho': '#FF9149',
  'Muy insatisfecho': '#FF6363',
};

export function SatisfactionChart({ data, title }: SatisfactionChartProps) {
  const chartData = Object.entries(data || {})
    .filter(([_, value]) => value > 0)
    .map(([name, value]) => ({
      name,
      value,
    }));

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-full bg-white text-gray-900 font-bold rounded">
        No hay datos disponibles
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
        >
          {chartData.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[entry.name as keyof typeof COLORS]}
            />
          ))}
        </Pie>
        <Tooltip wrapperStyle={{ fontSize: 11 }} />
        <Legend
          verticalAlign="top"
          wrapperStyle={{ fontSize: 11 }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}
