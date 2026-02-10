import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { randomBytes } from 'crypto';

export const dynamic = 'force-dynamic';

function generateUniqueToken(): string {
  return randomBytes(16).toString('hex');
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const clients = await prisma.client.findMany({
      include: {
        surveyResponse: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(clients);
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    return NextResponse.json(
      { error: 'Error al obtener clientes' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await request.json();
    const { name, email, company, project } = body;

    if (!name || !email || !company || !project) {
      return NextResponse.json(
        { error: 'Todos los campos son requeridos' },
        { status: 400 }
      );
    }

    let uniqueToken = generateUniqueToken();
    
    let existingToken = await prisma.client.findUnique({
      where: { uniqueToken },
    });
    
    while (existingToken) {
      uniqueToken = generateUniqueToken();
      existingToken = await prisma.client.findUnique({
        where: { uniqueToken },
      });
    }

    const client = await prisma.client.create({
      data: {
        name,
        email,
        company,
        project,
        uniqueToken,
      },
    });

    return NextResponse.json(client, { status: 201 });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    return NextResponse.json(
      { error: 'Error al crear cliente' },
      { status: 500 }
    );
  }
}
