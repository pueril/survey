# ⚡ Guía de Instalación Rápida - Easton Survey App

## 📍 Pasos Rápidos (5-10 minutos)

### 1️⃣ Extraer Archivos
```bash
unzip easton_survey_app.zip
cd nextjs_space
```

### 2️⃣ Instalar Node.js y PostgreSQL

**✅ Verifica si ya los tienes:**
```bash
node --version    # Necesitas v18+
psql --version    # Necesitas v14+
```

**❌ Si no los tienes:**
- **Node.js:** https://nodejs.org/ (descarga LTS)
- **PostgreSQL:** https://www.postgresql.org/download/

### 3️⃣ Instalar Yarn
```bash
npm install -g yarn
```

### 4️⃣ Crear Base de Datos
```bash
psql -U postgres
```

Dentro de PostgreSQL:
```sql
CREATE DATABASE easton_surveys;
CREATE USER easton_admin WITH PASSWORD 'easton123';
GRANT ALL PRIVILEGES ON DATABASE easton_surveys TO easton_admin;
\q
```

### 5️⃣ Configurar Proyecto
```bash
# Instalar dependencias
yarn install
```

### 6️⃣ Crear archivo .env

Crea un archivo llamado `.env` con:

```env
DATABASE_URL="postgresql://easton_admin:easton123@localhost:5432/easton_surveys"
NEXTAUTH_SECRET="abc123xyz456def789ghi012jkl345mno678pqr901stu234vwx567yzA890BcD123EfG"
NEXTAUTH_URL="http://localhost:3000"
```

### 7️⃣ Inicializar Base de Datos
```bash
yarn prisma generate
yarn prisma db push
yarn prisma db seed
```

### 8️⃣ Ejecutar Aplicación
```bash
yarn dev
```

### 9️⃣ Abrir en Navegador

Abre: **http://localhost:3000**

Credenciales:
```
Email: admin@easton.cl
Password: easton2024
```

---

## ✅ Verificación

Si ves la pantalla de login, ¡todo está bien! 🎉

---

## ⚠️ Problemas Comunes

### Error: "Cannot connect to database"
```bash
# Verificar que PostgreSQL esté corriendo
sudo service postgresql start
```

### Error: "Port 3000 in use"
```bash
lsof -ti:3000 | xargs kill
```

### Error: "Module not found"
```bash
rm -rf node_modules
yarn install
```

---

## 📚 Más Información

Lee el **README.md** completo para:
- Documentación detallada
- Personalización
- Despliegue a producción
- Backup y restauración

---

## 🚀 ¡Listo!

Ahora puedes:
- ✅ Gestionar clientes
- ✅ Crear y reordenar preguntas (drag & drop)
- ✅ Enviar encuestas
- ✅ Ver estadísticas con gráficos

**¡Disfruta tu aplicación!** 🎉
