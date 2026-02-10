import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

// GET - Obtener todas las preguntas
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    // Si no hay sesión, retornar solo preguntas activas (para encuesta pública)
    // Si hay sesión, retornar todas las preguntas (para panel admin)
    const questions = await prisma.question.findMany({
      where: session ? undefined : { active: true },
      orderBy: { order: 'asc' },
    });

    return NextResponse.json(questions);
  } catch (error) {
    console.error('Error al obtener preguntas:', error);
    return NextResponse.json(
      { error: 'Error al obtener preguntas' },
      { status: 500 }
    );
  }
}

// POST - Crear una nueva pregunta
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { text, type, category, order, required, active } = body;

    if (!text || !type || !category || order === undefined) {
      return NextResponse.json(
        { error: 'Datos incompletos' },
        { status: 400 }
      );
    }

    const question = await prisma.question.create({
      data: {
        text,
        type,
        category,
        order,
        required: required ?? true,
        active: active ?? true,
      },
    });

    return NextResponse.json(question, { status: 201 });
  } catch (error) {
    console.error('Error al crear pregunta:', error);
    return NextResponse.json(
      { error: 'Error al crear pregunta' },
      { status: 500 }
    );
  }
}
