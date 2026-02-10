import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, responses } = body;

    // Logging para debugging
    console.log('[SURVEY SUBMIT] Inicio del proceso');
    console.log('[SURVEY SUBMIT] Token recibido:', token);
    console.log('[SURVEY SUBMIT] Tipo de responses:', typeof responses);
    console.log('[SURVEY SUBMIT] Responses es null:', responses === null);
    console.log('[SURVEY SUBMIT] Responses es undefined:', responses === undefined);
    console.log('[SURVEY SUBMIT] Keys en responses:', responses ? Object.keys(responses).length : 0);
    console.log('[SURVEY SUBMIT] Primeras 3 keys:', responses ? Object.keys(responses).slice(0, 3) : []);

    if (!token || !responses) {
      console.log('[SURVEY SUBMIT] ERROR: Token o responses faltantes');
      return NextResponse.json(
        { error: 'Token y respuestas son requeridos' },
        { status: 400 }
      );
    }

    // Validar que responses tenga contenido
    if (typeof responses !== 'object' || Object.keys(responses).length === 0) {
      console.log('[SURVEY SUBMIT] ERROR: Responses vacío o inválido');
      return NextResponse.json(
        { error: 'Las respuestas no pueden estar vacías' },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { uniqueToken: token },
    });

    if (!client) {
      return NextResponse.json(
        { error: 'Token inválido' },
        { status: 404 }
      );
    }

    if (client.surveyCompleted) {
      return NextResponse.json(
        { error: 'Esta encuesta ya ha sido completada' },
        { status: 400 }
      );
    }

    // Cargar las preguntas para mapear IDs a números de orden
    const questions = await prisma.question.findMany({
      where: { active: true },
      select: { id: true, order: true },
    });

    console.log('[SURVEY SUBMIT] Preguntas activas cargadas:', questions.length);

    // Transformar las respuestas del formato { questionId: valor } a { q1: valor, q2: valor, ... }
    const transformedResponses: Record<string, any> = {};
    Object.keys(responses).forEach((questionId) => {
      const question = questions.find((q) => q.id === questionId);
      if (question) {
        transformedResponses[`q${question.order}`] = responses[questionId];
        console.log(`[SURVEY SUBMIT] Mapeando: ${questionId.substring(0, 8)}... -> q${question.order} = ${JSON.stringify(responses[questionId]).substring(0, 30)}`);
      } else {
        console.log(`[SURVEY SUBMIT] ADVERTENCIA: No se encontró pregunta con ID ${questionId}`);
      }
    });

    console.log('[SURVEY SUBMIT] Transformación completada');
    console.log('[SURVEY SUBMIT] Keys transformadas:', Object.keys(transformedResponses).length);
    console.log('[SURVEY SUBMIT] Contenido transformado (primeras 3):', JSON.stringify(Object.entries(transformedResponses).slice(0, 3)));

    // Validar que la transformación fue exitosa
    if (Object.keys(transformedResponses).length === 0) {
      console.log('[SURVEY SUBMIT] ERROR CRÍTICO: transformedResponses está vacío');
      console.log('[SURVEY SUBMIT] Responses originales:', JSON.stringify(responses, null, 2));
      console.log('[SURVEY SUBMIT] IDs de preguntas disponibles:', questions.map(q => q.id).slice(0, 3));
      return NextResponse.json(
        { error: 'Error al procesar las respuestas. No se pudo mapear ninguna pregunta.' },
        { status: 500 }
      );
    }

    console.log('[SURVEY SUBMIT] Intentando guardar en base de datos...');

    // Guardar las respuestas dinámicas en el formato correcto
    await prisma.surveyResponse.create({
      data: {
        clientId: client.id,
        dynamicAnswers: transformedResponses, // Guardar con formato q1, q2, etc.
      },
    });

    console.log('[SURVEY SUBMIT] Respuesta guardada exitosamente');

    await prisma.client.update({
      where: { id: client.id },
      data: { surveyCompleted: true },
    });

    console.log('[SURVEY SUBMIT] Cliente actualizado como completado');
    console.log('[SURVEY SUBMIT] ✅ Proceso completado exitosamente');

    return NextResponse.json({
      success: true,
      message: 'Encuesta enviada correctamente',
    });
  } catch (error) {
    console.error('Error al enviar encuesta:', error);
    return NextResponse.json(
      { error: 'Error al enviar encuesta' },
      { status: 500 }
    );
  }
}
