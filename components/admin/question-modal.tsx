'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

interface QuestionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  question?: any;
}

const questionTypes = [
  { value: 'rating', label: 'Escala 1-7' },
  { value: 'satisfaction', label: 'Satisfacción' },
  { value: 'yesno', label: 'Sí/No' },
  { value: 'multiplechoice', label: 'Opción Múltiple' },
  { value: 'text', label: 'Texto Libre' },
];

const categories = [
  { value: 'coordinacion', label: 'Coordinación' },
  { value: 'transporte', label: 'Transporte' },
  { value: 'instalacion', label: 'Instalación' },
  { value: 'entrega', label: 'Entrega' },
  { value: 'comunicacion', label: 'Comunicación' },
  { value: 'profesionalismo', label: 'Profesionalismo' },
  { value: 'general', label: 'General' },
  { value: 'otro', label: 'Otro' },
];

export function QuestionModal({ isOpen, onClose, onSuccess, question }: QuestionModalProps) {
  const [formData, setFormData] = useState({
    text: '',
    type: 'rating',
    category: 'general',
    options: [] as string[],
    order: 1,
    required: true,
    active: true,
  });
  const [optionInput, setOptionInput] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (question) {
      setFormData({
        text: question.text || '',
        type: question.type || 'rating',
        category: question.category || 'general',
        options: question.options || [],
        order: question.order || 1,
        required: question.required ?? true,
        active: question.active ?? true,
      });
    } else {
      setFormData({
        text: '',
        type: 'rating',
        category: 'general',
        options: [],
        order: 1,
        required: true,
        active: true,
      });
    }
  }, [question, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = question
        ? `/api/questions/${question.id}`
        : '/api/questions';
      const method = question ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) throw new Error('Error al guardar pregunta');

      toast.success(
        question ? 'Pregunta actualizada con éxito' : 'Pregunta creada con éxito'
      );
      onSuccess();
      onClose();
    } catch (error) {
      toast.error('Error al guardar la pregunta');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
            <h2 className="text-2xl font-bold text-slate-800">
              {question ? 'Editar Pregunta' : 'Nueva Pregunta'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5 text-slate-500" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Texto de la pregunta *
              </label>
              <textarea
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                rows={3}
                required
                placeholder="¿Cómo califica la coordinación del proyecto?"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Tipo de pregunta *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {questionTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Categoría *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {formData.type === 'multiplechoice' && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Opciones de respuesta *
                </label>
                <div className="space-y-2">
                  {formData.options.map((option, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={option}
                        onChange={(e) => {
                          const newOptions = [...formData.options];
                          newOptions[index] = e.target.value;
                          setFormData({ ...formData, options: newOptions });
                        }}
                        className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        placeholder={`Opción ${index + 1}`}
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newOptions = formData.options.filter((_, i) => i !== index);
                          setFormData({ ...formData, options: newOptions });
                        }}
                        className="px-3 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={optionInput}
                      onChange={(e) => setOptionInput(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          if (optionInput.trim()) {
                            setFormData({ ...formData, options: [...formData.options, optionInput.trim()] });
                            setOptionInput('');
                          }
                        }
                      }}
                      className="flex-1 px-4 py-2 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Nueva opción..."
                    />
                    <button
                      type="button"
                      onClick={() => {
                        if (optionInput.trim()) {
                          setFormData({ ...formData, options: [...formData.options, optionInput.trim()] });
                          setOptionInput('');
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Agregar
                    </button>
                  </div>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  {formData.options.length} opciones agregadas
                </p>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Orden *
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                  className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  min={1}
                  required
                />
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  checked={formData.required}
                  onChange={(e) => setFormData({ ...formData, required: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  id="required"
                />
                <label htmlFor="required" className="ml-2 text-sm text-slate-700">
                  Obligatoria
                </label>
              </div>

              <div className="flex items-center pt-8">
                <input
                  type="checkbox"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  id="active"
                />
                <label htmlFor="active" className="ml-2 text-sm text-slate-700">
                  Activa
                </label>
              </div>
            </div>

            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm text-blue-800">
                <strong>Tipo de pregunta:</strong>
              </p>
              <ul className="text-xs text-blue-700 mt-2 space-y-1">
                <li>• <strong>Escala 1-7:</strong> El cliente califica del 1 al 7 con emojis</li>
                <li>• <strong>Satisfacción:</strong> Muy satisfecho, Satisfecho, Neutral, Insatisfecho, Muy insatisfecho</li>
                <li>• <strong>Sí/No:</strong> Respuesta simple de Sí o No</li>
                <li>• <strong>Opción Múltiple:</strong> El cliente selecciona una opción de varias predefinidas</li>
                <li>• <strong>Texto Libre:</strong> El cliente escribe su respuesta en un campo de texto</li>
              </ul>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors disabled:opacity-50"
              >
                {loading ? 'Guardando...' : question ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
