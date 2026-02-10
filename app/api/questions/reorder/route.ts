import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// POST - Actualizar el orden de múltiples preguntas
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { questions } = body; // Array de { id, order }

    if (!questions || !Array.isArray(questions)) {
      return NextResponse.json(
        { error: 'Datos inválidos' },
        { status: 400 }
      );
    }

    // Actualizar todas las preguntas en una transacción
    await prisma.$transaction(
      questions.map((q: { id: string; order: number }) =>
        prisma.question.update({
          where: { id: q.id },
          data: { order: q.order },
        })
      )
    );

    return NextResponse.json({ message: 'Orden actualizado con éxito' });
  } catch (error) {
    console.error('Error al actualizar orden:', error);
    return NextResponse.json(
      { error: 'Error al actualizar orden' },
      { status: 500 }
    );
  }
}
