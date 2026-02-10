'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import {
  Plus,
  Edit,
  Trash2,
  HelpCircle,
  Eye,
  EyeOff,
  GripVertical,
} from 'lucide-react';
import { AdminHeader } from '@/components/admin/header';
import { QuestionModal } from '@/components/admin/question-modal';
import { Toaster } from 'react-hot-toast';
import toast from 'react-hot-toast';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Question {
  id: string;
  text: string;
  type: string;
  category: string;
  order: number;
  required: boolean;
  active: boolean;
}

const typeLabels: Record<string, string> = {
  rating: 'Escala 1-7',
  satisfaction: 'Satisfacción',
  yesno: 'Sí/No',
};

const categoryLabels: Record<string, string> = {
  coordinacion: 'Coordinación',
  transporte: 'Transporte',
  instalacion: 'Instalación',
  entrega: 'Entrega',
  comunicacion: 'Comunicación',
  profesionalismo: 'Profesionalismo',
  general: 'General',
  otro: 'Otro',
};

// Componente para cada fila sorteable
interface SortableRowProps {
  question: Question;
  index: number;
  onEdit: (question: Question) => void;
  onDelete: (id: string) => void;
  onToggleActive: (question: Question) => void;
}

function SortableRow({ question, index, onEdit, onDelete, onToggleActive }: SortableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: question.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`${question.active ? '' : 'bg-slate-50 opacity-60'} ${
        isDragging ? 'shadow-lg z-50' : ''
      }`}
    >
      <td className="px-6 py-4">
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing hover:bg-slate-100 rounded p-2 inline-flex"
        >
          <GripVertical className="w-5 h-5 text-slate-400" />
        </div>
      </td>
      <td className="px-6 py-4 text-sm text-slate-700 font-medium">
        {question.order}
      </td>
      <td className="px-6 py-4 text-sm text-slate-700">
        {question.text}
        {question.required && (
          <span className="ml-2 text-red-500">*</span>
        )}
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {typeLabels[question.type] || question.type}
        </span>
      </td>
      <td className="px-6 py-4 text-sm text-slate-600">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
          {categoryLabels[question.category] || question.category}
        </span>
      </td>
      <td className="px-6 py-4 text-sm">
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            question.active
              ? 'bg-green-100 text-green-800'
              : 'bg-gray-100 text-gray-800'
          }`}
        >
          {question.active ? 'Activa' : 'Inactiva'}
        </span>
      </td>
      <td className="px-6 py-4 text-right">
        <div className="flex items-center justify-end gap-2">
          <button
            onClick={() => onToggleActive(question)}
            className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
            title={question.active ? 'Desactivar' : 'Activar'}
          >
            {question.active ? (
              <Eye className="w-4 h-4 text-slate-600" />
            ) : (
              <EyeOff className="w-4 h-4 text-slate-400" />
            )}
          </button>
          <button
            onClick={() => onEdit(question)}
            className="p-2 hover:bg-blue-50 rounded-lg transition-colors"
            title="Editar"
          >
            <Edit className="w-4 h-4 text-blue-600" />
          </button>
          <button
            onClick={() => onDelete(question.id)}
            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
            title="Eliminar"
          >
            <Trash2 className="w-4 h-4 text-red-600" />
          </button>
        </div>
      </td>
    </tr>
  );
}

export default function PreguntasPage() {
  const router = useRouter();
  const { data: session, status } = useSession() || {};
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<Question | undefined>();

  // Configuración de sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchQuestions();
    }
  }, [status]);

  const fetchQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      if (!response.ok) throw new Error('Error al cargar preguntas');
      const data = await response.json();
      setQuestions(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error('Error al cargar las preguntas');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta pregunta?')) return;

    try {
      const response = await fetch(`/api/questions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Error al eliminar pregunta');

      toast.success('Pregunta eliminada con éxito');
      fetchQuestions();
    } catch (error) {
      toast.error('Error al eliminar la pregunta');
      console.error('Error:', error);
    }
  };

  const handleToggleActive = async (question: Question) => {
    try {
      const response = await fetch(`/api/questions/${question.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !question.active }),
      });

      if (!response.ok) throw new Error('Error al actualizar pregunta');

      toast.success(
        question.active ? 'Pregunta desactivada' : 'Pregunta activada'
      );
      fetchQuestions();
    } catch (error) {
      toast.error('Error al actualizar la pregunta');
      console.error('Error:', error);
    }
  };

  const handleEdit = (question: Question) => {
    setSelectedQuestion(question);
    setIsModalOpen(true);
  };

  const handleNew = () => {
    setSelectedQuestion(undefined);
    setIsModalOpen(true);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      return;
    }

    const oldIndex = questions.findIndex((q) => q.id === active.id);
    const newIndex = questions.findIndex((q) => q.id === over.id);

    const newQuestions = arrayMove(questions, oldIndex, newIndex);
    
    // Actualizar el orden visual inmediatamente
    const updatedQuestions = newQuestions.map((q, index) => ({
      ...q,
      order: index + 1,
    }));
    
    setQuestions(updatedQuestions);

    // Persistir el cambio en el backend
    try {
      const response = await fetch('/api/questions/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          questions: updatedQuestions.map((q) => ({
            id: q.id,
            order: q.order,
          })),
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar orden');

      toast.success('Orden actualizado con éxito');
    } catch (error) {
      toast.error('Error al actualizar el orden');
      console.error('Error:', error);
      // Revertir cambios en caso de error
      fetchQuestions();
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

  return (
    <div className="min-h-screen bg-slate-50">
      <Toaster position="top-right" />
      <AdminHeader />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">
              Gestión de Preguntas
            </h1>
            <p className="text-slate-600">
              Personaliza las preguntas de la encuesta de satisfacción
            </p>
          </div>
          <button
            onClick={handleNew}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
          >
            <Plus className="w-5 h-5" />
            <span>Nueva Pregunta</span>
          </button>
        </motion.div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <HelpCircle className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-blue-900 mb-1">
                ¿Cómo funcionan las preguntas personalizadas?
              </h3>
              <p className="text-sm text-blue-800">
                Puedes agregar, editar o eliminar preguntas para personalizar tu encuesta.
                Las preguntas activas aparecerán automáticamente en la encuesta que envíes a
                tus clientes. Usa el botón de ojo para activar/desactivar preguntas sin eliminarlas.
                <strong className="block mt-1">💡 Arrastra las preguntas por el icono de barras para cambiar su orden.</strong>
              </p>
            </div>
          </div>
        </div>

        {questions.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center">
            <HelpCircle className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-slate-700 mb-2">
              No hay preguntas creadas
            </h3>
            <p className="text-slate-500 mb-6">
              Comienza agregando tu primera pregunta personalizada
            </p>
            <button
              onClick={handleNew}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-5 h-5" />
              <span>Crear Primera Pregunta</span>
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        <GripVertical className="w-5 h-5 text-slate-400" />
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Orden
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Pregunta
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Tipo
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Categoría
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase">
                        Estado
                      </th>
                      <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase">
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <SortableContext
                    items={questions.map((q) => q.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <tbody className="divide-y divide-slate-200">
                      {questions.map((question, index) => (
                        <SortableRow
                          key={question.id}
                          question={question}
                          index={index}
                          onEdit={handleEdit}
                          onDelete={handleDelete}
                          onToggleActive={handleToggleActive}
                        />
                      ))}
                    </tbody>
                  </SortableContext>
                </table>
              </DndContext>
            </div>
          </div>
        )}
      </main>

      <QuestionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedQuestion(undefined);
        }}
        onSuccess={fetchQuestions}
        question={selectedQuestion}
      />
    </div>
  );
}
