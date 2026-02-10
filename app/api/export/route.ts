import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import * as XLSX from 'xlsx';

export const dynamic = 'force-dynamic';

// Función para calcular el promedio de una lista de ratings
function calculateAverage(values: number[]): number {
  if (values.length === 0) return 0;
  const sum = values.reduce((acc, val) => acc + val, 0);
  return sum / values.length;
}

// Función para obtener el valor de una respuesta específica
// Soporta ambos formatos: q1, q2 (nuevo) y IDs de preguntas (legacy)
function getAnswerValue(dynamicAnswers: any, questionOrder: number, questionId?: string): any {
  if (!dynamicAnswers || typeof dynamicAnswers !== 'object') return '';
  
  // Primero intentar formato q1, q2, etc.
  const qKey = `q${questionOrder}`;
  if (dynamicAnswers[qKey] !== undefined) {
    return dynamicAnswers[qKey];
  }
  
  // Si no existe, intentar con el ID de la pregunta (formato legacy)
  if (questionId && dynamicAnswers[questionId] !== undefined) {
    return dynamicAnswers[questionId];
  }
  
  return '';
}

// Convertir cualquier respuesta a valor numérico para cálculos
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
  
  // Mapeo legacy para respuestas del formato anterior
  const legacyMap: Record<string, number> = {
    'En la fecha comprometida': 7,
    'Antes de lo comprometido': 7,
    'Después de lo comprometido': 3,
    'Sí': 7,
    'No, llegó antes': 6,
    'No, llegó después': 3,
    'Mucho cuidado': 7,
    'Suficiente cuidado': 5,
    'Sí, todo perfecto': 7,
    'Sí, pero con algún detalle menor': 5,
    'No, hubo problemas o faltantes': 2,
    'Sí, completamente': 7,
    'Más o menos': 4,
    'No, quedó desordenado/sucio': 2,
  };
  if (legacyMap[answer]) return legacyMap[answer];
  
  return null;
}

// Función para calcular estadísticas individuales de un cliente
// Adaptada para las 11 preguntas nuevas con compatibilidad legacy
function calculateClientStatistics(dynamicAnswers: any, questions: any[]) {
  const stats: any = {
    coordinacion: 0,
    puntualidad: 0,
    transporte: 0,
    instalacion: 0,
    profesionalismo: 0,
    comunicacion: 0,
    general: 0,
    promedio: 0,
  };

  if (!dynamicAnswers || typeof dynamicAnswers !== 'object') return stats;

  // Mapeo de preguntas por fase para las 11 preguntas nuevas
  const phaseMapping: Record<string, number[]> = {
    coordinacion: [1],        // Q1: Coordinación y claridad
    puntualidad: [2],         // Q2: Puntualidad
    transporte: [3],          // Q3: Transporte y estado
    instalacion: [4, 5, 6],   // Q4: Calidad instalación, Q5: Cuidado, Q6: Resultado
    profesionalismo: [7],     // Q7: Profesionalismo
    comunicacion: [8],        // Q8: Comunicación
    general: [9, 10],         // Q9: Satisfacción general, Q10: Recomendaría
  };

  // Calcular promedio por fase
  Object.entries(phaseMapping).forEach(([phase, questionNumbers]) => {
    const values: number[] = [];
    
    questionNumbers.forEach(qNum => {
      // Buscar la pregunta por su order
      const question = questions.find(q => q.order === qNum);
      const answer = getAnswerValue(dynamicAnswers, qNum, question?.id);
      const numericValue = convertToNumericValue(answer);
      
      if (numericValue !== null) {
        values.push(numericValue);
      }
    });

    stats[phase] = values.length > 0 ? calculateAverage(values) : 0;
  });

  // Calcular promedio general (excluyendo fases sin datos)
  const phaseValues = [
    stats.coordinacion,
    stats.puntualidad,
    stats.transporte,
    stats.instalacion,
    stats.profesionalismo,
    stats.comunicacion,
    stats.general,
  ].filter(v => v > 0);
  
  stats.promedio = phaseValues.length > 0 ? calculateAverage(phaseValues) : 0;

  return stats;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Obtener todas las preguntas activas
    const questions = await prisma.question.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
    });

    // Obtener todos los clientes con sus respuestas
    const clients = await prisma.client.findMany({
      include: {
        surveyResponse: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Crear el workbook
    const workbook = XLSX.utils.book_new();

    // === HOJA 1: CLIENTES ===
    const clientsData = clients.map(client => {
      const baseUrl = process.env.NEXTAUTH_URL || 'https://easton-dev.abacusai.app';
      return {
        'Nombre': client.name,
        'Email': client.email,
        'Empresa': client.company,
        'Proyecto': client.project,
        'Encuesta Completada': client.surveyCompleted ? 'Sí' : 'No',
        'Fecha Registro': new Date(client.createdAt).toLocaleDateString('es-CL'),
        'Enlace Único': `${baseUrl}/encuesta/${client.uniqueToken}`,
      };
    });

    const clientsSheet = XLSX.utils.json_to_sheet(clientsData);
    clientsSheet['!cols'] = [
      { wch: 20 },
      { wch: 30 },
      { wch: 25 },
      { wch: 25 },
      { wch: 18 },
      { wch: 15 },
      { wch: 60 },
    ];
    XLSX.utils.book_append_sheet(workbook, clientsSheet, 'Clientes');

    // === HOJA 2: RESPUESTAS DETALLADAS ===
    const responsesData: any[] = [];
    
    clients.forEach(client => {
      if (client.surveyResponse && client.surveyResponse.dynamicAnswers) {
        const row: any = {
          'Cliente': client.name,
          'Empresa': client.company,
          'Fecha Respuesta': new Date(client.surveyResponse.completedAt).toLocaleDateString('es-CL'),
        };

        // Agregar cada respuesta como columna
        questions.forEach((question, index) => {
          const answer = getAnswerValue(
            client.surveyResponse?.dynamicAnswers, 
            question.order,
            question.id
          );
          let displayValue = answer;

          // Formatear respuestas booleanas
          if (typeof answer === 'boolean') {
            displayValue = answer ? 'Sí' : 'No';
          }

          // Truncar texto de pregunta para header
          const questionText = question.text.length > 50 
            ? question.text.substring(0, 47) + '...' 
            : question.text;
          row[`P${index + 1}: ${questionText}`] = displayValue;
        });

        responsesData.push(row);
      }
    });

    if (responsesData.length > 0) {
      const responsesSheet = XLSX.utils.json_to_sheet(responsesData);
      XLSX.utils.book_append_sheet(workbook, responsesSheet, 'Respuestas');
    }

    // === HOJA 3: ESTADÍSTICAS INDIVIDUALES ===
    const statsData = clients
      .filter(client => client.surveyResponse && client.surveyResponse.dynamicAnswers)
      .map(client => {
        const stats = calculateClientStatistics(
          client.surveyResponse?.dynamicAnswers,
          questions
        );

        return {
          'Cliente': client.name,
          'Empresa': client.company,
          'Fecha Respuesta': new Date(client.surveyResponse!.completedAt).toLocaleDateString('es-CL'),
          'Promedio General': stats.promedio.toFixed(2),
          'Coordinación': stats.coordinacion.toFixed(2),
          'Puntualidad': stats.puntualidad.toFixed(2),
          'Transporte': stats.transporte.toFixed(2),
          'Instalación': stats.instalacion.toFixed(2),
          'Profesionalismo': stats.profesionalismo.toFixed(2),
          'Comunicación': stats.comunicacion.toFixed(2),
          'Satisfacción General': stats.general.toFixed(2),
        };
      });

    if (statsData.length > 0) {
      const statsSheet = XLSX.utils.json_to_sheet(statsData);
      statsSheet['!cols'] = [
        { wch: 20 },
        { wch: 25 },
        { wch: 15 },
        { wch: 18 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 15 },
        { wch: 20 },
      ];
      XLSX.utils.book_append_sheet(workbook, statsSheet, 'Estadísticas');
    }

    // === HOJA 4: PREGUNTAS ===
    const questionsData = questions.map((question, index) => ({
      'N°': index + 1,
      'Pregunta': question.text,
      'Tipo': question.type,
      'Categoría': question.category,
      'Requerida': question.required ? 'Sí' : 'No',
    }));

    const questionsSheet = XLSX.utils.json_to_sheet(questionsData);
    questionsSheet['!cols'] = [
      { wch: 5 },
      { wch: 80 },
      { wch: 15 },
      { wch: 20 },
      { wch: 12 },
    ];
    XLSX.utils.book_append_sheet(workbook, questionsSheet, 'Preguntas');

    // Generar el archivo Excel en buffer
    const excelBuffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });

    // Crear nombre del archivo con fecha actual
    const fileName = `Encuestas_Easton_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Retornar el archivo
    return new NextResponse(excelBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });
  } catch (error) {
    console.error('Error al exportar Excel:', error);
    return NextResponse.json(
      { error: 'Error al exportar datos' },
      { status: 500 }
    );
  }
}
