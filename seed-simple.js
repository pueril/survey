// Seeder simplificado que evita deleteMany
// Ejecutar con: node seed-simple.js

const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

const prisma = new PrismaClient();

function generateUniqueToken() {
  return crypto.randomBytes(16).toString('hex');
}

async function main() {
  console.log('🌱 Starting seed...');

  try {
    // Crear usuarios administradores (sin limpiar primero)
    const hashedPasswordTest = await bcrypt.hash('johndoe123', 10);
    const hashedPasswordAdmin = await bcrypt.hash('easton2026', 10);

    // Verificar si ya existen antes de crear
    let testAdmin = await prisma.user.findUnique({
      where: { email: 'john@doe.com' }
    });

    if (!testAdmin) {
      testAdmin = await prisma.user.create({
        data: {
          email: 'john@doe.com',
          password: hashedPasswordTest,
          name: 'Test Admin',
          role: 'admin',
        },
      });
      console.log('✅ Usuario john@doe.com creado');
    } else {
      console.log('ℹ️ Usuario john@doe.com ya existe');
    }

    let mainAdmin = await prisma.user.findUnique({
      where: { email: 'admin@easton.cl' }
    });

    if (!mainAdmin) {
      mainAdmin = await prisma.user.create({
        data: {
          email: 'admin@easton.cl',
          password: hashedPasswordAdmin,
          name: 'Admin Easton',
          role: 'admin',
        },
      });
      console.log('✅ Usuario admin@easton.cl creado');
    } else {
      console.log('ℹ️ Usuario admin@easton.cl ya existe');
    }

    // Crear preguntas (sin limpiar primero)
    const questionCount = await prisma.question.count();
    
    if (questionCount === 0) {
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
      console.log('✅ 11 preguntas creadas');
    } else {
      console.log(`ℹ️ Ya existen ${questionCount} preguntas`);
    }

    console.log('\n📊 Resumen:');
    console.log('👥 Usuarios:', await prisma.user.count());
    console.log('❓ Preguntas:', await prisma.question.count());
    console.log('🏢 Clientes:', await prisma.client.count());
    console.log('\n🔑 Credenciales de acceso:');
    console.log('Email: john@doe.com | Password: johndoe123');
    console.log('Email: admin@easton.cl | Password: easton2026');
    console.log('\n✅ Seed completado exitosamente!');

  } catch (error) {
    console.error('❌ Error durante el seed:', error);
    throw error;
  }
}

main()
  .catch((e) => {
    console.error('❌ Error fatal:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
