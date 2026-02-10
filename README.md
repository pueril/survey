# Easton Design - Sistema de Encuestas de Satisfacción

## 📝 Descripción

Sistema completo de gestión de encuestas de satisfacción del cliente para Easton Design. Permite crear clientes, generar enlaces únicos de encuestas, recopilar respuestas y analizar resultados con estadísticas detalladas.

---

## ✨ Características

### Panel de Administración
- 👥 **Gestión de Clientes**: Crear, editar y eliminar clientes
- 🔗 **Enlaces Únicos**: Generar links personalizados por cliente
- 📄 **Exportación Excel**: Exportar respuestas y estadísticas
- 📊 **Dashboard de Estadísticas**: Visualización de datos en tiempo real
- ❓ **Gestión de Preguntas**: Crear y editar preguntas de encuesta

### Encuesta de Cliente
- 📱 **Responsive**: Funciona en móvil, tablet y desktop
- ⏱️ **Progreso Visual**: Barra de progreso durante la encuesta
- 🎨 **Interfaz Moderna**: Diseño atractivo con Tailwind CSS
- 🚀 **Navegación Intuitiva**: Paso a paso con validación

### Tipos de Preguntas
- ⭐ **Rating (1-7)**: Escala de satisfacción con emojis
- 😊 **Satisfacción**: Selección de nivel de satisfacción
- ✅ **Sí/No**: Respuestas booleanas
- 📝 **Opción Múltiple**: Selección entre varias opciones
- ✍️ **Texto Libre**: Comentarios abiertos

---

## 🛠️ Tecnologías

### Frontend
- **Next.js 14** - Framework React con SSR
- **TypeScript** - Tipado estático
- **Tailwind CSS** - Estilos utility-first
- **Framer Motion** - Animaciones fluidas
- **Recharts** - Gráficos y visualizaciones

### Backend
- **Next.js API Routes** - API serverless
- **Prisma ORM** - Acceso a base de datos
- **NextAuth.js** - Autenticación
- **bcryptjs** - Hashing de contraseñas

### Base de Datos
- **MariaDB / MySQL** - Base de datos relacional

---

## 📚 Estructura de la Encuesta

La encuesta está organizada en **7 fases** con **11 preguntas optimizadas**:

1. **Coordinación** (1 pregunta)
   - Calificación de la coordinación previa

2. **Puntualidad** (1 pregunta)
   - Evaluación de puntualidad en la entrega

3. **Transporte** (2 preguntas)
   - Estado del transporte
   - Satisfacción con transporte/producto

4. **Instalación** (3 preguntas)
   - Calidad de la instalación
   - Cuidado con muebles y propiedades
   - Resultado final de la instalación

5. **Profesionalismo** (1 pregunta)
   - Evaluación del profesionalismo del equipo

6. **Comunicación** (1 pregunta)
   - Calidad de la comunicación

7. **Evaluación General** (2 preguntas)
   - Satisfacción general
   - Recomendación del servicio
   - Comentarios adicionales

---

## 💾 Instalación

### Requisitos
- Node.js 18.x o superior
- MariaDB 10.5+ o MySQL 8.0+
- npm o yarn

### Despliegue Rápido

Ver [QUICK_START.md](./QUICK_START.md) para instrucción paso a paso.

### Despliegue Detallado

Ver [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) para guía completa con Nginx, SSL, PM2, etc.

---



## 📊 Estadísticas y Reportes

El sistema genera automáticamente:

- **Promedios por fase**: 7 fases de evaluación
- **Distribución de respuestas**: Gráficos de pastel
- **Métricas clave**: 
  - Porcentaje de recomendación
  - Puntualidad en entregas
  - Satisfacción general
- **Comentarios de clientes**: Agregados por tipo
- **Exportación a Excel**: Con múltiples hojas

---

## 🛡️ Seguridad

- 🔐 **Autenticación**: NextAuth.js con sesión segura
- 🔒 **Contraseñas**: Hasheadas con bcrypt (10 rounds)
- 🔗 **Enlaces Únicos**: Tokens aleatorios por cliente
- 🛡️ **Validación**: Validación de entrada en servidor
- 🚪 **Protección de rutas**: Middleware de autenticación

---

## 📝 Scripts Disponibles

```bash
# Desarrollo
npm run dev                # Servidor de desarrollo
npm run build             # Construir para producción
npm start                 # Iniciar en producción

# Base de datos
npm run prisma:generate   # Generar cliente Prisma
npm run prisma:push       # Sincronizar schema con DB
npm run prisma:seed       # Cargar datos iniciales
npm run prisma:studio     # Abrir Prisma Studio
```

---

## 🔧 Mantenimiento

### Backup de Base de Datos

```bash
mysqldump -u easton_user -p easton_surveys > backup_$(date +%Y%m%d).sql
```

### Restaurar Backup

```bash
mysql -u easton_user -p easton_surveys < backup_20240127.sql
```

### Ver Logs

```bash
# Con PM2
pm2 logs easton-surveys

# Con systemd
sudo journalctl -u easton-surveys -f
```

---

## 📞 Soporte

### Documentación
- [QUICK_START.md](./QUICK_START.md) - Inicio rápido
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guía completa de despliegue
- [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) - Notas de migración PostgreSQL → MariaDB

### Recursos Externos
- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [NextAuth.js Documentation](https://next-auth.js.org)
- [MariaDB Documentation](https://mariadb.com/kb/en/documentation/)

---

## 📜 Licencia

Propietario - Easton Design

---

## 🎉 Cambios de PostgreSQL a MariaDB

Esta versión ha sido adaptada de PostgreSQL a MariaDB/MySQL. Cambios principales:

- ✅ Schema de Prisma actualizado para MySQL
- ✅ Campos string indexados limitados a 255 caracteres
- ✅ JSON usado en lugar de JSONB
- ✅ Connection string actualizada para MySQL
- ✅ **Sin cambios en el código de la aplicación**

Ver [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) para detalles completos.

---

**Desarrollado para Easton Design** 🎨
