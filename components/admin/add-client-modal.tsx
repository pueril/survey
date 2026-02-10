'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, CheckCircle, Copy, Mail, Building2, Briefcase, User } from 'lucide-react';
import toast from 'react-hot-toast';

interface AddClientModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AddClientModal({ isOpen, onClose, onSuccess }: AddClientModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    company: '',
    project: '',
  });
  const [loading, setLoading] = useState(false);
  const [newClient, setNewClient] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al crear cliente');

      const client = await response.json();
      setNewClient(client);
      toast.success('Cliente creado exitosamente');
      onSuccess();
    } catch (error) {
      toast.error('Error al crear cliente');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (newClient?.uniqueToken) {
      const link = `${window.location.origin}/encuesta/${newClient.uniqueToken}`;
      navigator.clipboard.writeText(link);
      toast.success('Link copiado al portapapeles');
    }
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', company: '', project: '' });
    setNewClient(null);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/50"
            onClick={handleClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-slate-800">
                    {newClient ? '¡Cliente Creado!' : 'Agregar Nuevo Cliente'}
                  </h2>
                  <p className="text-slate-600 text-sm mt-1">
                    {newClient
                      ? 'Comparte el link de encuesta con el cliente'
                      : 'Completa los datos del cliente'}
                  </p>
                </div>
                <button
                  onClick={handleClose}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {newClient ? (
                <div className="space-y-4">
                  <div className="bg-green-50 p-4 rounded-lg flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-semibold text-green-900">Cliente registrado</p>
                      <p className="text-sm text-green-700 mt-1">
                        {newClient.name} de {newClient.company}
                      </p>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-blue-900 mb-2">
                      Link de encuesta
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={`${window.location.origin}/encuesta/${newClient.uniqueToken}`}
                        readOnly
                        className="flex-1 px-3 py-2 bg-white border border-blue-200 rounded-lg text-sm"
                      />
                      <button
                        onClick={copyLink}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <Copy className="w-4 h-4" />
                        Copiar
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={handleClose}
                    className="w-full py-3 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-semibold transition-colors"
                  >
                    Cerrar
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Nombre del cliente
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="María González"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Correo electrónico
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          setFormData({ ...formData, email: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="maria@empresa.cl"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Empresa
                    </label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) =>
                          setFormData({ ...formData, company: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="TechCorp SpA"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Proyecto
                    </label>
                    <div className="relative">
                      <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input
                        type="text"
                        value={formData.project}
                        onChange={(e) =>
                          setFormData({ ...formData, project: e.target.value })
                        }
                        className="w-full pl-11 pr-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
                        placeholder="Mobiliario oficinas piso 3"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="button"
                      onClick={handleClose}
                      className="flex-1 py-2.5 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
                    >
                      Cancelar
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {loading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Creando...
                        </>
                      ) : (
                        'Crear Cliente'
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
