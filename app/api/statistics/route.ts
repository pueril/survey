import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

// Mapeo de preguntas por fase para las 11 preguntas optimizadas
// Q1: Coordinación y claridad (rating)
// Q2: Puntualidad fecha/hora (multiplechoice)
// Q3: Transporte y estado producto (satisfaction)
// Q4: Calidad instalación (rating)
// Q5: Cuidado muebles y espacio (multiplechoice)
// Q6: Resultado instalación y limpieza (multiplechoice)
// Q7: Profesionalismo y trato (rating)
// Q8: Comunicación (rating)
// Q9: Satisfacción general (rating)
// Q10: Recomendaría (yesno)
// Q11: Feedback (text)

const PHASE_QUESTIONS = {
  coordinacion: [1],        // Q1: Coordinación y claridad
  puntualidad: [2],         // Q2: Puntualidad
  transporte: [3],          // Q3: Transporte y estado
  instalacion: [4, 5, 6],   // Q4-Q6: Instalación completa
  profesionalismo: [7],     // Q7: Profesionalismo
  comunicacion: [8],        // Q8: Comunicación
  general: [9, 10],         // Q9-Q10: Satisfacción y recomendación
  feedback: [11],           // Q11: Feedback abierto
};

// Convertir respuestas a valor numérico para cálculos
function convertToNumericValue(answer: any): number | null {
  if (typeof answer === 'number' && answer >= 1 && answer <= 7) {
    return answer;
  }
  if (typeof answer === 'boolean') {
    return answer ? 7 : 1;
  }
  
  // Mapeo de respuestas de satisfacción
  const satisfactionMap: Record<string, number> = {
    'Muy satisfecho': 7,
    'satisfecho': 6,
    'Neutral': 4,
    'Insatisfecho': 2,
    'Muy insatisfecho': 1,
  };
  if (satisfactionMap[answer]) return satisfactionMap[answer];
  
  // Mapeo de respuestas de puntualidad (Q2)
  const puntualidadMap: Record<string, number> = {
    'Sí, en fecha y hora': 7,
    'Sí en fecha, pero fuera de horario': 5,
    'No, llegó en otra fecha': 2,
  };
  if (puntualidadMap[answer]) return puntualidadMap[answer];
  
  // Mapeo de respuestas de cuidado (Q5)
  const cuidadoMap: Record<string, number> = {
    'Sí, excelente cuidado': 7,
    'Sí, cuidado suficiente': 5,
    'Poco cuidado': 3,
    'Nada de cuidado': 1,
  };
  if (cuidadoMap[answer]) return cuidadoMap[answer];
  
  // Mapeo de respuestas de resultado (Q6)
  const resultadoMap: Record<string, number> = {
    'Sí, todo perfecto': 7,
    'Sí, con detalles menores': 5,
    'No, hubo problemas': 2,
  };
  if (resultadoMap[answer]) return resultadoMap[answer];
  
  return null;
}

function calculatePhaseAverage(responses: any[], questionOrders: number[]): number {
  let total = 0;
  let count = 0;

  responses.forEach((response) => {
    const answers = response.dynamicAnswers as any;
    if (!answers) return;

    questionOrders.forEach((order) => {
      const answer = answers[`q${order}`];
      const numericValue = convertToNumericValue(answer);
      if (numericValue !== null) {
        total += numericValue;
        count++;
      }
    });
  });

  return count > 0 ? total / count : 0;
}

function getYesPercentage(responses: any[], questionOrder: number): number {
  let yesCount = 0;
  let totalCount = 0;

  responses.forEach((response) => {
    const answers = response.dynamicAnswers as any;
    if (!answers) return;

    const answer = answers[`q${questionOrder}`];
    if (typeof answer === 'boolean') {
      totalCount++;
      if (answer === true) yesCount++;
    }
  });

  return totalCount > 0 ? (yesCount / totalCount) * 100 : 0;
}

function getMultipleChoiceDistribution(responses: any[], questionOrder: number): Record<string, number> {
  const distribution: Record<string, number> = {};

  responses.forEach((response) => {
    const answers = response.dynamicAnswers as any;
    if (!answers) return;

    const answer = answers[`q${questionOrder}`];
    if (typeof answer === 'string') {
      distribution[answer] = (distribution[answer] || 0) + 1;
    }
  });

  return distribution;
}

function getSatisfactionDistribution(responses: any[], questionOrder: number): Record<string, number> {
  const distribution = {
    'Muy satisfecho': 0,
    'satisfecho': 0,
    'Neutral': 0,
    'Insatisfecho': 0,
    'Muy insatisfecho': 0,
  };

  responses.forEach((response) => {
    const answers = response.dynamicAnswers as any;
    if (!answers) return;

    const answer = answers[`q${questionOrder}`];
    if (answer && answer in distribution) {
      distribution[answer as keyof typeof distribution]++;
    }
  });

  return distribution;
}

// Calcular porcentaje de entregas a tiempo basado en Q2 (puntualidad)
function getDeliveryOnTimePercentage(responses: any[]): number {
  let onTimeCount = 0;
  let totalCount = 0;

  responses.forEach((response) => {
    const answers = response.dynamicAnswers as any;
    if (!answers) return;

    const answer = answers.q2;
    if (typeof answer === 'string') {
      totalCount++;
      if (answer === 'Sí, en fecha y hora') {
        onTimeCount++;
      }
    }
  });

  return totalCount > 0 ? (onTimeCount / totalCount) * 100 : 0;
}

// Calcular porcentaje de contacto anticipado basado en Q1 (rating >= 5 se considera bueno)
function getEarlyContactPercentage(responses: any[]): number {
  let goodCount = 0;
  let totalCount = 0;

  responses.forEach((response) => {
    const answers = response.dynamicAnswers as any;
    if (!answers) return;

    const answer = answers.q1;
    if (typeof answer === 'number') {
      totalCount++;
      if (answer >= 5) {
        goodCount++;
      }
    }
  });

  return totalCount > 0 ? (goodCount / totalCount) * 100 : 0;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const responses = await prisma.surveyResponse.findMany({
      include: {
        client: true,
      },
      orderBy: {
        completedAt: 'desc',
      },
    });

    const totalClients = await prisma.client.count();
    const completedSurveys = await prisma.client.count({
      where: { surveyCompleted: true },
    });
    const pendingSurveys = totalClients - completedSurveys;

    if (responses.length === 0) {
      return NextResponse.json({
        totalClients,
        completedSurveys,
        pendingSurveys,
        phaseAverages: null,
        keyMetrics: null,
        distributions: null,
        feedback: [],
      });
    }

    // Calcular promedios por fase (adaptado a 11 preguntas)
    const phaseAverages = {
      coordinacion: calculatePhaseAverage(responses, PHASE_QUESTIONS.coordinacion),
      puntualidad: calculatePhaseAverage(responses, PHASE_QUESTIONS.puntualidad),
      transporte: calculatePhaseAverage(responses, PHASE_QUESTIONS.transporte),
      instalacion: calculatePhaseAverage(responses, PHASE_QUESTIONS.instalacion),
      profesionalismo: calculatePhaseAverage(responses, PHASE_QUESTIONS.profesionalismo),
      comunicacion: calculatePhaseAverage(responses, PHASE_QUESTIONS.comunicacion),
      general: calculatePhaseAverage(responses, PHASE_QUESTIONS.general),
    };

    // Calcular promedio general
    const validPhases = Object.values(phaseAverages).filter(v => v > 0);
    const overallAverage = validPhases.length > 0 
      ? validPhases.reduce((sum, val) => sum + val, 0) / validPhases.length 
      : 0;

    // Métricas clave (adaptadas a 11 preguntas)
    const keyMetrics = {
      // Q1: Coordinación y claridad (% con calificación >= 5)
      earlyContactPercentage: getEarlyContactPercentage(responses),
      
      // Q2: Puntualidad - distribución
      onTimeArrivalDistribution: getMultipleChoiceDistribution(responses, 2),
      
      // Q5: Cuidado con muebles - distribución
      furnitureCareDistribution: getMultipleChoiceDistribution(responses, 5),
      
      // Q6: Resultado instalación y limpieza - distribución
      cleanSpaceDistribution: getMultipleChoiceDistribution(responses, 6),
      
      // Q2: % entregas en fecha y hora
      deliveryOnTimePercentage: getDeliveryOnTimePercentage(responses),
      
      // Q10: % que recomendaría
      wouldRecommendPercentage: getYesPercentage(responses, 10),
    };

    // Distribuciones importantes
    const distributions = {
      // Q2: Puntualidad (reemplaza fecha comprometida)
      deliveryDate: getMultipleChoiceDistribution(responses, 2),
      
      // Q3: Satisfacción transporte y estado producto
      transportSatisfaction: getSatisfactionDistribution(responses, 3),
      
      // Q5: Cuidado con muebles
      furnitureCare: getMultipleChoiceDistribution(responses, 5),
      
      // Q3: Estado del producto (mismo que transporte en nueva versión)
      productCondition: getSatisfactionDistribution(responses, 3),
    };

    // Extraer feedback abierto (Q11)
    const feedback = responses
      .map((response) => {
        const answers = response.dynamicAnswers as any;
        if (!answers) return null;

        // Q11 ahora combina lo que gustó y mejoras
        const feedbackText = answers.q11 || null;
        
        return {
          client: {
            name: response.client?.name,
            company: response.client?.company,
            project: response.client?.project,
          },
          completedAt: response.completedAt,
          liked: null,  // Ya no hay pregunta separada
          improvements: feedbackText,  // Q11: Feedback combinado
          additional: null,
        };
      })
      .filter((item) => item && item.improvements);

    return NextResponse.json({
      totalClients,
      completedSurveys,
      pendingSurveys,
      overallAverage,
      phaseAverages,
      keyMetrics,
      distributions,
      feedback,
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    );
  }
}
