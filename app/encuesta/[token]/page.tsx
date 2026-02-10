'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Loader2, AlertCircle, ChevronRight, ChevronLeft } from 'lucide-react';
import { RatingScale } from '@/components/survey/rating-scale';
import { SatisfactionSelect } from '@/components/survey/satisfaction-select';
import { YesNoToggle } from '@/components/survey/yes-no-toggle';
import { MultipleChoiceSelect } from '@/components/survey/multiple-choice-select';
import { TextInput } from '@/components/survey/text-input';

type SurveyState = 'loading' | 'valid' | 'invalid' | 'completed' | 'submitted';

interface Question {
  id: string;
  text: string;
  type: string;
  category: string;
  options?: string[];
  order: number;
  required: boolean;
  active: boolean;
}

export default function SurveyPage() {
  const params = useParams();
  const token = params?.token as string;
  const [state, setState] = useState<SurveyState>('loading');
  const [clientInfo, setClientInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [responses, setResponses] = useState<Record<string, any>>({});

  useEffect(() => {
    validateToken();
    loadQuestions();
  }, [token]);

  const loadQuestions = async () => {
    try {
      const response = await fetch('/api/questions');
      const data = await response.json();
      const activeQuestions = data.filter((q: Question) => q.active).sort((a: Question, b: Question) => a.order - b.order);
      setQuestions(activeQuestions);
      
      // Inicializar responses con valores por defecto
      const initialResponses: Record<string, any> = {};
      activeQuestions.forEach((q: Question) => {
        initialResponses[q.id] = q.type === 'yesno' ? null : q.type === 'rating' ? 0 : '';
      });
      setResponses(initialResponses);
    } catch (error) {
      console.error('Error loading questions:', error);
    }
  };

  const validateToken = async () => {
    try {
      const response = await fetch('/api/survey/validate-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (data.valid) {
        setClientInfo(data.client);
        setState('valid');
      } else if (data.alreadyCompleted) {
        setState('completed');
      } else {
        setState('invalid');
      }
    } catch (error) {
      console.error('Error:', error);
      setState('invalid');
    }
  };

  const handleSubmit = async () => {
    try {
      console.log('[FRONTEND] Preparando envío de encuesta');
      console.log('[FRONTEND] Token:', token);
      console.log('[FRONTEND] Número de respuestas:', Object.keys(responses).length);
      console.log('[FRONTEND] Primeras 3 respuestas:', Object.entries(responses).slice(0, 3));

      const response = await fetch('/api/survey/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, responses }),
      });

      console.log('[FRONTEND] Response status:', response.status);
      console.log('[FRONTEND] Response ok:', response.ok);
      console.log('[FRONTEND] Response headers:', Array.from(response.headers.entries()));

      if (!response.ok) {
        console.log('[FRONTEND] Response no es OK, leyendo error...');
        let errorData;
        try {
          errorData = await response.json();
        } catch (jsonError) {
          console.error('[FRONTEND] Error al parsear JSON de error:', jsonError);
          throw new Error('Error al procesar respuesta del servidor');
        }
        console.error('[FRONTEND] Error del servidor:', errorData);
        throw new Error(errorData.error || 'Error al enviar encuesta');
      }

      console.log('[FRONTEND] Response es OK, leyendo resultado...');
      let result;
      try {
        const responseText = await response.text();
        console.log('[FRONTEND] Response text:', responseText);
        result = JSON.parse(responseText);
        console.log('[FRONTEND] Result parseado:', result);
      } catch (jsonError) {
        console.error('[FRONTEND] Error al parsear JSON de éxito:', jsonError);
        console.error('[FRONTEND] jsonError stack:', (jsonError as Error).stack);
        throw new Error('Error al procesar respuesta del servidor');
      }

      console.log('[FRONTEND] ✅ Encuesta enviada exitosamente:', result);
      setState('submitted');
    } catch (error) {
      console.error('[FRONTEND] ❌ Error capturado:', error);
      console.error('[FRONTEND] Error stack:', (error as Error).stack);
      console.error('[FRONTEND] Error name:', (error as Error).name);
      console.error('[FRONTEND] Error message:', (error as Error).message);
      alert(`Error al enviar la encuesta. Por favor, inténtalo de nuevo.`);
    }
  };

  const canAdvance = () => {
    if (questions.length === 0) return false;
    const currentQuestion = questions[currentStep];
    if (!currentQuestion || !currentQuestion.required) return true;

    const response = responses[currentQuestion.id];

    switch (currentQuestion.type) {
      case 'rating':
        return response > 0;
      case 'satisfaction':
      case 'multiplechoice':
        return response !== '';
      case 'yesno':
        return response !== null;
      case 'text':
        return !currentQuestion.required || (response && response.trim() !== '');
      default:
        return true;
    }
  };

  const totalSteps = questions.length;
  const progress = totalSteps > 0 ? ((currentStep + 1) / totalSteps) * 100 : 0;

  if (state === 'loading') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-blue-600" />
      </div>
    );
  }

  if (state === 'invalid') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Link Inválido
          </h2>
          <p className="text-slate-600">
            Este link de encuesta no es válido o ha expirado.
          </p>
        </motion.div>
      </div>
    );
  }

  if (state === 'completed') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">
            Encuesta Ya Completada
          </h2>
          <p className="text-slate-600">
            Esta encuesta ya ha sido completada anteriormente. Gracias por tu participación.
          </p>
        </motion.div>
      </div>
    );
  }

  if (state === 'submitted') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle className="w-12 h-12 text-green-600" />
          </motion.div>
          <h2 className="text-3xl font-bold text-slate-800 mb-3">
            ¡Muchas Gracias!
          </h2>
          <p className="text-slate-600 text-lg mb-2">
            Tu opinión es muy importante para nosotros.
          </p>
          <p className="text-slate-500">
            Trabajamos continuamente para mejorar nuestro servicio y brindarte la mejor experiencia.
          </p>
          <div className="mt-8 pt-6 border-t border-slate-200">
            <p className="text-sm font-medium text-slate-700">
              Easton Design
            </p>
            <p className="text-xs text-slate-500 mt-1">www.easton.cl</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-slate-50 to-blue-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <img 
            src="/Ed_Isotipo_rojo.png" 
            alt="Easton Design" 
            className="w-16 h-16 mx-auto mb-4 shadow-lg object-contain"
          />
          <h1 className="text-3xl font-bold text-slate-800 mb-2">
            Encuesta de Satisfacción
          </h1>
          <p className="text-slate-600">
            Hola <span className="font-semibold">{clientInfo?.name}</span>,
            queremos conocer tu experiencia con el proyecto{' '}
            <span className="font-semibold">{clientInfo?.project}</span>
          </p>
        </motion.div>

        <div className="mb-6">
          <div className="flex justify-between text-sm text-slate-600 mb-2">
            <span>Progreso</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full"
            />
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-2xl shadow-xl p-8 mb-6"
          >
            {questions.length > 0 && questions[currentStep] && (() => {
              const question = questions[currentStep];
              const value = responses[question.id];

              switch (question.type) {
                case 'rating':
                  return (
                    <RatingScale
                      value={value || 0}
                      onChange={(val) => setResponses({ ...responses, [question.id]: val })}
                      label={question.text}
                    />
                  );
                
                case 'satisfaction':
                  return (
                    <SatisfactionSelect
                      value={value || ''}
                      onChange={(val) => setResponses({ ...responses, [question.id]: val })}
                      label={question.text}
                    />
                  );
                
                case 'yesno':
                  return (
                    <YesNoToggle
                      value={value}
                      onChange={(val) => setResponses({ ...responses, [question.id]: val })}
                      label={question.text}
                    />
                  );
                
                case 'multiplechoice':
                  return (
                    <MultipleChoiceSelect
                      value={value || ''}
                      onChange={(val) => setResponses({ ...responses, [question.id]: val })}
                      label={question.text}
                      options={question.options || []}
                    />
                  );
                
                case 'text':
                  return (
                    <TextInput
                      value={value || ''}
                      onChange={(val) => setResponses({ ...responses, [question.id]: val })}
                      label={question.text}
                      required={question.required}
                      placeholder="Escribe tu respuesta aquí..."
                    />
                  );
                
                default:
                  return <div>Tipo de pregunta no soportado</div>;
              }
            })()}
          </motion.div>
        </AnimatePresence>

        <div className="flex gap-4">
          {currentStep > 0 && (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex items-center gap-2 px-6 py-3 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-semibold transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
              Anterior
            </button>
          )}

          {currentStep < totalSteps - 1 ? (
            <button
              onClick={() => canAdvance() && setCurrentStep((prev) => prev + 1)}
              disabled={!canAdvance()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              Siguiente
              <ChevronRight className="w-5 h-5" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canAdvance()}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
            >
              <CheckCircle className="w-5 h-5" />
              Enviar Encuesta
            </button>
          )}
        </div>

        <p className="text-center text-sm text-slate-500 mt-6">
          Paso {currentStep + 1} de {totalSteps}
        </p>
      </div>
    </div>
  );
}
