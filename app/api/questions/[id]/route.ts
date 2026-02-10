import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// PUT - Actualizar una pregunta
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { text, type, category, order, required, active } = body;

    const question = await prisma.question.update({
      where: { id: params.id },
      data: {
        ...(text !== undefined && { text }),
        ...(type !== undefined && { type }),
        ...(category !== undefined && { category }),
        ...(order !== undefined && { order }),
        ...(required !== undefined && { required }),
        ...(active !== undefined && { active }),
      },
    });

    return NextResponse.json(question);
  } catch (error) {
    console.error('Error al actualizar pregunta:', error);
    return NextResponse.json(
      { error: 'Error al actualizar pregunta' },
      { status: 500 }
    );
  }
}

// DELETE - Eliminar una pregunta
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    await prisma.question.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Pregunta eliminada' });
  } catch (error) {
    console.error('Error al eliminar pregunta:', error);
    return NextResponse.json(
      { error: 'Error al eliminar pregunta' },
      { status: 500 }
    );
  }
}
