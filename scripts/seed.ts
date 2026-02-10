import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { randomBytes } from 'crypto';

const prisma = new PrismaClient();

function generateUniqueToken(): string {
  return randomBytes(16).toString('hex');
}

async function main() {
  console.log('🌱 Starting seed...');

  // Limpiar datos existentes
  await prisma.surveyResponse.deleteMany();
  await prisma.client.deleteMany();
  await prisma.question.deleteMany();
  await prisma.user.deleteMany();

  // Crear usuarios administradores
  const hashedPasswordTest = await bcrypt.hash('johndoe123', 10);
  const hashedPasswordAdmin = await bcrypt.hash('easton2026', 10);

  const testAdmin = await prisma.user.create({
    data: {
      email: 'john@doe.com',
      password: hashedPasswordTest,
      name: 'Test Admin',
      role: 'admin',
    },
  });

  const mainAdmin = await prisma.user.create({
    data: {
      email: 'admin@easton.cl',
      password: hashedPasswordAdmin,
      name: 'Admin Easton',
      role: 'admin',
    },
  });

  console.log('✅ Usuarios administradores creados');

  // Crear las 11 preguntas optimizadas
  await prisma.question.createMany({
    data: [
      {
        text: '¿Te contactamos con anticipación suficiente y la información sobre la entrega/instalación fue clara?',
        type: 'rating',
        category: 'coordinacion',
        order: 1,
        required: true,
        active: true,
      },
      {
        text: '¿El equipo llegó en la fecha y horario comprometidos?',
        type: 'multiplechoice',
        category: 'puntualidad',
        options: ['Sí, en fecha y hora', 'Sí en fecha, pero fuera de horario', 'No, llegó en otra fecha'],
        order: 2,
        required: true,
        active: true,
      },
      {
        text: '¿Cómo califica el transporte y el estado del producto al llegar?',
        type: 'satisfaction',
        category: 'transporte',
        order: 3,
        required: true,
        active: true,
      },
      {
        text: '¿Cómo califica la calidad del servicio de instalación?',
        type: 'rating',
        category: 'instalacion',
        order: 4,
        required: true,
        active: true,
      },
      {
        text: '¿El equipo tuvo el cuidado adecuado con los muebles y con tu espacio físico?',
        type: 'multiplechoice',
        category: 'cuidado',
        options: ['Sí, excelente cuidado', 'Sí, cuidado suficiente', 'Poco cuidado', 'Nada de cuidado'],
        order: 5,
        required: true,
        active: true,
      },
      {
        text: '¿Quedó todo instalado correctamente y el espacio limpio?',
        type: 'multiplechoice',
        category: 'resultado',
        options: ['Sí, todo perfecto', 'Sí, con detalles menores', 'No, hubo problemas'],
        order: 6,
        required: true,
        active: true,
      },
      {
        text: '¿Cómo califica el profesionalismo y trato del equipo?',
        type: 'rating',
        category: 'profesionalismo',
        order: 7,
        required: true,
        active: true,
      },
      {
        text: '¿Cómo califica la comunicación durante todo el proceso?',
        type: 'rating',
        category: 'comunicacion',
        order: 8,
        required: true,
        active: true,
      },
      {
        text: '¿Cuál es su satisfacción general con el servicio de Easton?',
        type: 'rating',
        category: 'general',
        order: 9,
        required: true,
        active: true,
      },
      {
        text: '¿Recomendaría nuestros servicios a otros?',
        type: 'yesno',
        category: 'general',
        order: 10,
        required: true,
        active: true,
      },
      {
        text: '¿Qué fue lo que más te gustó y qué podríamos mejorar?',
        type: 'text',
        category: 'feedback',
        order: 11,
        required: false,
        active: true,
      },
    ],
  });

  console.log('✅ 11 preguntas optimizadas creadas');

  // Crear clientes de prueba
  const client1 = await prisma.client.create({
    data: {
      name: 'María González',
      email: 'maria.gonzalez@techcorp.cl',
      company: 'TechCorp SpA',
      project: 'Implementación oficinas piso 12',
      uniqueToken: generateUniqueToken(),
      surveyCompleted: true,
    },
  });

  const client2 = await prisma.client.create({
    data: {
      name: 'Carlos Muñoz',
      email: 'carlos.munoz@finanzas.cl',
      company: 'Finanzas Globales',
      project: 'Mobiliario sala de reuniones ejecutivas',
      uniqueToken: generateUniqueToken(),
      surveyCompleted: true,
    },
  });

  const client3 = await prisma.client.create({
    data: {
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@startup.cl',
      company: 'Startup Innovation',
      project: 'Espacio coworking completo',
      uniqueToken: generateUniqueToken(),
      surveyCompleted: false,
    },
  });

  const client4 = await prisma.client.create({
    data: {
      name: 'Jorge Silva',
      email: 'jorge.silva@consulting.cl',
      company: 'Consulting Partners',
      project: 'Oficina completa 50 puestos',
      uniqueToken: generateUniqueToken(),
      surveyCompleted: true,
    },
  });

  console.log('✅ Clientes creados');

  // Crear respuestas de encuestas para los clientes que completaron
  // MAPEO DE LAS 11 PREGUNTAS:
  // Q1: Coordinación y claridad (1-7)
  // Q2: Puntualidad fecha/hora (multiplechoice)
  // Q3: Transporte y estado producto (satisfaction)
  // Q4: Calidad instalación (1-7)
  // Q5: Cuidado muebles y espacio (multiplechoice)
  // Q6: Resultado instalación y limpieza (multiplechoice)
  // Q7: Profesionalismo y trato (1-7)
  // Q8: Comunicación (1-7)
  // Q9: Satisfacción general (1-7)
  // Q10: Recomendaría (yesno)
  // Q11: Feedback abierto (text)
  
  await prisma.surveyResponse.create({
    data: {
      clientId: client1.id,
      dynamicAnswers: {
        q1: 7,
        q2: 'Sí, en fecha y hora',
        q3: 'Muy satisfecho',
        q4: 7,
        q5: 'Sí, excelente cuidado',
        q6: 'Sí, todo perfecto',
        q7: 7,
        q8: 7,
        q9: 7,
        q10: true,
        q11: 'El equipo fue muy profesional y cuidadoso. La instalación quedó perfecta. Nada que mejorar.',
      },
    },
  });

  await prisma.surveyResponse.create({
    data: {
      clientId: client2.id,
      dynamicAnswers: {
        q1: 6,
        q2: 'Sí en fecha, pero fuera de horario',
        q3: 'satisfecho',
        q4: 6,
        q5: 'Sí, cuidado suficiente',
        q6: 'Sí, con detalles menores',
        q7: 7,
        q8: 6,
        q9: 6,
        q10: true,
        q11: 'Buen trabajo en general, equipo amable. Mejorar la puntualidad en los horarios.',
      },
    },
  });

  await prisma.surveyResponse.create({
    data: {
      clientId: client4.id,
      dynamicAnswers: {
        q1: 5,
        q2: 'No, llegó en otra fecha',
        q3: 'Neutral',
        q4: 6,
        q5: 'Sí, cuidado suficiente',
        q6: 'Sí, con detalles menores',
        q7: 6,
        q8: 5,
        q9: 5,
        q10: true,
        q11: 'El resultado final fue aceptable. Mejorar la comunicación y cumplir con las fechas establecidas.',
      },
    },
  });

  console.log('✅ Respuestas de encuestas creadas');
  console.log('\n📊 Resumen de datos creados:');
  console.log('👥 Usuarios:', 2);
  console.log('❓ Preguntas:', 11);
  console.log('🏢 Clientes:', 4);
  console.log('📝 Encuestas completadas:', 3);
  console.log('⏳ Encuestas pendientes:', 1);
  console.log('\n🔑 Credenciales de acceso:');
  console.log('Email: john@doe.com | Password: johndoe123');
  console.log('Email: admin@easton.cl | Password: easton2026');
}

main()
  .catch((e) => {
    console.error('❌ Error durante el seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
