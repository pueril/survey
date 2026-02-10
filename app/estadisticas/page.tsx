'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ThumbsUp,
  MessageSquare,
  Clock,
  Building2,
  CheckCircle2,
  Sparkles,
  Heart,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { Toaster } from 'react-hot-toast';
import { AveragesChart } from '@/components/charts/averages-chart';
import { SatisfactionChart } from '@/components/charts/satisfaction-chart';
import { DistributionChart } from '@/components/charts/distribution-chart';

export default function EstadisticasPage() {
  const router = useRouter();
  const { data: session, status } = useSession() || {};
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStatistics();
    }
  }, [status]);

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/statistics');
      if (!response.ok) throw new Error('Error al cargar estadísticas');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  const hasData = stats?.completedSurveys > 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Estadísticas y Análisis
          </h1>
          <p className="text-slate-600">
            Diagnóstico completo del proceso (11 preguntas optimizadas)
          </p>
        </motion.div>

        {!hasData ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <TrendingUp className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No hay datos suficientes
            </h3>
            <p className="text-slate-500">
              Las estadísticas aparecerán cuando los clientes completen sus encuestas
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* KPIs Principales */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl shadow-sm p-6 border border-blue-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-blue-900">Promedio General</p>
                </div>
                <p className="text-3xl font-bold text-blue-900">
                  {stats?.overallAverage?.toFixed(1) || 0}
                  <span className="text-lg text-blue-700">/7</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl shadow-sm p-6 border border-green-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                    <ThumbsUp className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-green-900">Recomendarían</p>
                </div>
                <p className="text-3xl font-bold text-green-900">
                  {stats?.keyMetrics?.wouldRecommendPercentage?.toFixed(0) || 0}
                  <span className="text-lg text-green-700">%</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl shadow-sm p-6 border border-purple-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-purple-600 rounded-lg flex items-center justify-center">
                    <Clock className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-purple-900">Entrega a Tiempo</p>
                </div>
                <p className="text-3xl font-bold text-purple-900">
                  {stats?.keyMetrics?.deliveryOnTimePercentage?.toFixed(0) || 0}
                  <span className="text-lg text-purple-700">%</span>
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-gradient-to-br from-amber-50 to-amber-100 rounded-xl shadow-sm p-6 border border-amber-200"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-amber-600 rounded-lg flex items-center justify-center">
                    <MessageSquare className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-sm font-medium text-amber-900">Encuestas</p>
                </div>
                <p className="text-3xl font-bold text-amber-900">
                  {stats?.completedSurveys || 0}
                </p>
              </motion.div>
            </div>

            {/* Gráfico Principal: Promedios por Fase */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
            >
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-blue-600" />
                <h2 className="text-xl font-semibold text-slate-800">
                  Rendimiento por Fase del Proceso
                </h2>
              </div>
              <p className="text-sm text-slate-600 mb-4">
                Evaluación promedio de cada etapa del servicio (7 áreas clave)
              </p>
              <div className="h-96">
                <AveragesChart data={stats?.phaseAverages || {}} />
              </div>
            </motion.div>

            {/* Métricas Clave por Fase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Coordinación</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-600">Buena coordinación</span>
                    <span className="text-lg font-bold text-green-600">
                      {stats?.keyMetrics?.earlyContactPercentage?.toFixed(0) || 0}%
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">% con calificación ≥ 5/7</p>
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Puntualidad</h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(stats?.keyMetrics?.onTimeArrivalDistribution || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 truncate" title={key}>{key}</span>
                      <span className="font-semibold text-slate-800">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  <h3 className="text-lg font-semibold text-slate-800">Resultado Final</h3>
                </div>
                <div className="space-y-2">
                  {Object.entries(stats?.keyMetrics?.cleanSpaceDistribution || {}).map(([key, value]: [string, any]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="text-slate-600 truncate" title={key}>{key}</span>
                      <span className="font-semibold text-slate-800">{value}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            {/* Distribuciones Detalladas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Puntualidad en Fecha y Hora
                </h3>
                <div className="h-72">
                  <DistributionChart
                    data={stats?.distributions?.deliveryDate || {}}
                    title="Puntualidad"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.0 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Cuidado con Muebles y Espacio
                </h3>
                <div className="h-72">
                  <DistributionChart
                    data={stats?.distributions?.furnitureCare || {}}
                    title="Cuidado"
                  />
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.1 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-slate-200 md:col-span-2"
              >
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  Satisfacción Transporte y Estado del Producto
                </h3>
                <div className="h-72">
                  <SatisfactionChart
                    data={stats?.distributions?.transportSatisfaction || {}}
                    title="Transporte y Estado"
                  />
                </div>
              </motion.div>
            </div>

            {/* Feedback de Clientes */}
            {stats?.feedback && stats.feedback.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3 }}
                className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
              >
                <div className="flex items-center gap-2 mb-4">
                  <Heart className="w-5 h-5 text-pink-600" />
                  <h2 className="text-xl font-semibold text-slate-800">
                    Comentarios y Sugerencias de Clientes
                  </h2>
                </div>
                <div className="space-y-4">
                  {stats.feedback.map((item: any, index: number) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.05 * index }}
                      className="bg-slate-50 rounded-lg p-4 border border-slate-200"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                          <Building2 className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-3">
                            <div>
                              <p className="font-semibold text-slate-800">
                                {item.client?.name}
                              </p>
                              <p className="text-sm text-slate-600">
                                {item.client?.company}
                              </p>
                            </div>
                            <span className="text-sm text-slate-500">
                              {new Date(item.completedAt).toLocaleDateString('es-CL')}
                            </span>
                          </div>
                          
                          {item.improvements && (
                            <div>
                              <p className="text-xs font-semibold text-blue-700 mb-1">
                                💬 Comentario:
                              </p>
                              <p className="text-sm text-slate-700 bg-blue-50 p-2 rounded">
                                {item.improvements}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
