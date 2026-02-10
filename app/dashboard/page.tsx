'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { PlusCircle, Users, CheckCircle, Clock } from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { ClientsList } from '@/components/admin/clients-list';
import { AddClientModal } from '@/components/admin/add-client-modal';
import { Toaster } from 'react-hot-toast';

export default function DashboardPage() {
  const router = useRouter();
  const { data: session, status } = useSession() || {};
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    pending: 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchStats();
    }
  }, [refreshTrigger, status]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/clients');
      if (response.ok) {
        const clients = await response.json();
        setStats({
          total: clients?.length || 0,
          completed: clients?.filter((c: any) => c.surveyCompleted)?.length || 0,
          pending: clients?.filter((c: any) => !c.surveyCompleted)?.length || 0,
        });
      }
    } catch (error) {
      console.error('Error al cargar estadísticas:', error);
    }
  };

  const handleClientAdded = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6"
          >
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Gestión de Clientes
              </h1>
              <p className="text-slate-600 mt-1">
                Administra las encuestas de satisfacción
              </p>
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <PlusCircle className="w-5 h-5" />
              Agregar Cliente
            </button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Total Clientes</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.total}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Completadas</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.completed}
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-sm p-6 border border-slate-200"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Pendientes</p>
                  <p className="text-2xl font-bold text-slate-800">
                    {stats.pending}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        <ClientsList refreshTrigger={refreshTrigger} />
      </main>

      <AddClientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleClientAdded}
      />
    </div>
  );
}
