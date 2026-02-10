import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token } = body;

    if (!token) {
      return NextResponse.json(
        { error: 'Token es requerido' },
        { status: 400 }
      );
    }

    const client = await prisma.client.findUnique({
      where: { uniqueToken: token },
      include: {
        surveyResponse: true,
      },
    });

    if (!client) {
      return NextResponse.json(
        { valid: false, error: 'Token inválido' },
        { status: 404 }
      );
    }

    if (client.surveyCompleted) {
      return NextResponse.json(
        { valid: false, error: 'Esta encuesta ya ha sido completada', alreadyCompleted: true },
        { status: 400 }
      );
    }

    return NextResponse.json({
      valid: true,
      client: {
        name: client.name,
        company: client.company,
        project: client.project,
      },
    });
  } catch (error) {
    console.error('Error al validar token:', error);
    return NextResponse.json(
      { error: 'Error al validar token' },
      { status: 500 }
    );
  }
}
