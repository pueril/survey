'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle,
  Clock,
  Copy,
  Trash2,
  Building2,
  Briefcase,
  Mail,
  Calendar,
  Link2,
  Share2,
} from 'lucide-react';
import toast from 'react-hot-toast';

interface Client {
  id: string;
  name: string;
  email: string;
  company: string;
  project: string;
  uniqueToken: string;
  surveyCompleted: boolean;
  createdAt: string;
}

interface ClientsListProps {
  refreshTrigger: number;
}

export function ClientsList({ refreshTrigger }: ClientsListProps) {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, [refreshTrigger]);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/clients');
      if (!response.ok) throw new Error('Error al cargar clientes');
      const data = await response.json();
      setClients(data || []);
    } catch (error) {
      toast.error('Error al cargar clientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = (token: string) => {
    const link = `${window.location.origin}/encuesta/${token}`;
    navigator.clipboard.writeText(link);
    toast.success('Link copiado al portapapeles');
  };

  const shareWhatsApp = (token: string, clientName: string) => {
    const link = `${window.location.origin}/encuesta/${token}`;
    const message = `Hola ${clientName}! 👋\n\nEn Easton Design valoramos mucho tu opinión. Nos gustaría conocer tu experiencia con nuestro servicio.\n\n¿Podrías completar esta breve encuesta? Te tomará solo unos minutos:\n${link}\n\nMuchas gracias por tu tiempo! 🙏`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const deleteClient = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar este cliente?')) return;

    try {
      const response = await fetch(`/api/clients/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Error al eliminar cliente');
      toast.success('Cliente eliminado');
      fetchClients();
    } catch (error) {
      toast.error('Error al eliminar cliente');
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (clients.length === 0) {
    return (
      <div className="text-center py-12">
        <Building2 className="w-16 h-16 text-slate-300 mx-auto mb-4" />
        <p className="text-slate-600 text-lg">No hay clientes registrados</p>
        <p className="text-slate-500 text-sm mt-2">
          Agrega tu primer cliente para comenzar
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {clients.map((client, index) => (
        <motion.div
          key={client.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-slate-200 p-5"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <h3 className="font-semibold text-slate-800 text-lg">
                {client.name}
              </h3>
              <div className="flex items-center gap-1 text-sm text-slate-600 mt-1">
                <Mail className="w-3 h-3" />
                <span className="truncate">{client.email}</span>
              </div>
            </div>
            <div
              className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                client.surveyCompleted
                  ? 'bg-green-100 text-green-700'
                  : 'bg-amber-100 text-amber-700'
              }`}
            >
              {client.surveyCompleted ? (
                <>
                  <CheckCircle className="w-3 h-3" />
                  Completada
                </>
              ) : (
                <>
                  <Clock className="w-3 h-3" />
                  Pendiente
                </>
              )}
            </div>
          </div>

          <div className="space-y-2 mb-4 text-sm">
            <div className="flex items-start gap-2 text-slate-600">
              <Building2 className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="break-words">{client.company}</span>
            </div>
            <div className="flex items-start gap-2 text-slate-600">
              <Briefcase className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span className="break-words">{client.project}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-500 text-xs">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(client.createdAt).toLocaleDateString('es-CL', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                })}
              </span>
            </div>
          </div>

          {/* Enlace único del cliente */}
          <div className="mb-3 p-3 bg-slate-50 rounded-lg border border-slate-200">
            <div className="flex items-center gap-2 mb-2">
              <Link2 className="w-3 h-3 text-slate-500" />
              <span className="text-xs font-medium text-slate-600">Enlace de encuesta</span>
            </div>
            <div className="text-xs text-slate-500 break-all font-mono bg-white p-2 rounded border border-slate-200">
              {`${window.location.origin}/encuesta/${client.uniqueToken}`}
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => copyLink(client.uniqueToken)}
              className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Copy className="w-4 h-4" />
              <span className="hidden sm:inline">Copiar</span>
            </button>
            <button
              onClick={() => shareWhatsApp(client.uniqueToken, client.name)}
              className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              <span className="hidden sm:inline">WhatsApp</span>
            </button>
            <button
              onClick={() => deleteClient(client.id)}
              className="px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
