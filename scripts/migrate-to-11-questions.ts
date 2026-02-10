import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔄 Iniciando migración a 11 preguntas...');

  // Paso 1: Desactivar todas las preguntas existentes (no eliminar para mantener compatibilidad)
  console.log('📋 Desactivando preguntas antiguas...');
  await prisma.question.updateMany({
    where: { active: true },
    data: { active: false }
  });

  // Paso 2: Crear las 11 nuevas preguntas optimizadas
  console.log('✨ Creando nuevas 11 preguntas...');
  
  const newQuestions = [
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
  ];

  for (const question of newQuestions) {
    await prisma.question.create({
      data: question,
    });
  }

  // Mostrar resumen
  const activeQuestions = await prisma.question.findMany({
    where: { active: true },
    orderBy: { order: 'asc' },
  });

  const inactiveCount = await prisma.question.count({
    where: { active: false },
  });

  console.log('\n✅ Migración completada!');
  console.log(`📊 Preguntas activas: ${activeQuestions.length}`);
  console.log(`📦 Preguntas archivadas (para compatibilidad): ${inactiveCount}`);
  console.log('\n📋 Nuevas preguntas:');
  activeQuestions.forEach((q, i) => {
    console.log(`   ${i + 1}. [${q.type}] ${q.text.substring(0, 60)}...`);
  });
}

main()
  .catch((e) => {
    console.error('❌ Error durante la migración:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
