# 🚀 Guía de Deploy en DirectAdmin

## 📋 Requisitos Previos

- ✅ Build de producción completado (`npm run build`)
- ✅ Acceso a DirectAdmin
- ✅ Base de datos MySQL configurada en el servidor
- ✅ Credenciales de la base de datos de producción

---

## 📦 Paso 1: Preparar Archivos para Subir

### Archivos que SÍ debes subir:
```
✅ app/                    (carpeta completa)
✅ components/             (carpeta completa)
✅ lib/                    (carpeta completa)
✅ prisma/                 (carpeta completa)
✅ public/                 (carpeta completa)
✅ hooks/                  (carpeta completa)
✅ .next/                  (carpeta completa - BUILD DE PRODUCCIÓN)
✅ package.json
✅ package-lock.json       (si existe)
✅ next.config.js
✅ tailwind.config.ts
✅ tsconfig.json
✅ postcss.config.js
✅ .env                    (CONFIGURADO PARA PRODUCCIÓN)
```

### Archivos que NO debes subir:
```
❌ node_modules/           (se instalará en el servidor)
❌ .next/cache/           (se regenerará)
❌ .git/                  (si existe)
❌ *.log                  (archivos de log)
❌ .env.local             (si existe)
❌ .env.development       (si existe)
```

---

## 🔧 Paso 2: Configurar Variables de Entorno

Edita el archivo `.env` con los datos de tu servidor de producción:

```env
# Base de Datos de Producción
DATABASE_URL="mysql://eastonde_survey:TU_CONTRASEÑA@localhost:3306/eastonde_survey"

# Autenticación Next-Auth
NEXTAUTH_SECRET="TU_SECRET_SEGURO_AQUI"
NEXTAUTH_URL="https://tu-dominio.com"

# Modo de producción
NODE_ENV="production"
```

**⚠️ IMPORTANTE:**
- Cambia `TU_CONTRASEÑA` por la contraseña real de tu base de datos
- Cambia `TU_SECRET_SEGURO_AQUI` por un secret seguro (puedes generarlo con: `openssl rand -base64 32`)
- Cambia `tu-dominio.com` por tu dominio real

---

## 📤 Paso 3: Subir Archivos al Servidor

### Opción A: Por FTP/SFTP
1. Conecta a tu servidor vía FTP/SFTP
2. Navega a la carpeta donde quieres instalar la app (ej: `domains/tu-dominio.com/nodejs-app/`)
3. Sube todos los archivos listados en "Archivos que SÍ debes subir"

### Opción B: Por SSH (si tienes acceso)
```bash
# Comprimir localmente (en Windows)
# Usa WinRAR o 7-Zip para crear un archivo .zip con todos los archivos

# Luego en el servidor:
cd /home/tu-usuario/domains/tu-dominio.com/nodejs-app/
unzip proyecto.zip
```

---

## ⚙️ Paso 4: Configurar Node.js App en DirectAdmin

1. **Accede a DirectAdmin** y ve a la sección **"Setup Node.js App"**

2. **Crea una nueva aplicación:**
   - **Node.js Version:** Selecciona la versión más reciente disponible (preferiblemente 18.x o superior)
   - **Application Root:** `/home/tu-usuario/domains/tu-dominio.com/nodejs-app/`
   - **Application URL:** `/` (o el path que prefieras)
   - **Application Startup File:** `package.json` (o deja en blanco si no está disponible)
   - **Application Mode:** `Production`

3. **Configura el comando de inicio:**
   - En el campo **"Run Command"** o **"Start Command"**, ingresa:
     ```
     npm start
     ```
   - O si DirectAdmin requiere un archivo específico, crea `server.js` (ver Paso 5)

4. **Variables de Entorno:**
   - Agrega las variables del `.env` en la sección de Environment Variables:
     - `DATABASE_URL`
     - `NEXTAUTH_SECRET`
     - `NEXTAUTH_URL`
     - `NODE_ENV=production`

5. **Puerto:**
   - DirectAdmin asignará un puerto automáticamente (ej: 3000, 3001, etc.)
   - Asegúrate de que el puerto esté configurado en las variables de entorno si es necesario

---

## 🔨 Paso 5: Instalar Dependencias y Build (si es necesario)

DirectAdmin generalmente instala dependencias automáticamente, pero si necesitas hacerlo manualmente:

### Por SSH:
```bash
cd /home/tu-usuario/domains/tu-dominio.com/nodejs-app/
npm install --production
npm run build  # Solo si el build no se subió correctamente
npx prisma generate
```

### Por DirectAdmin:
- Usa la opción "Run Command" en la interfaz de Node.js App
- Ejecuta: `npm install --production`
- Luego: `npx prisma generate`

---

## 🗄️ Paso 6: Configurar Base de Datos

1. **Ejecutar migraciones de Prisma:**
   ```bash
   npx prisma db push
   ```

2. **Opcional - Cargar datos iniciales:**
   ```bash
   npx tsx --require dotenv/config scripts/seed.ts
   ```

---

## 🚀 Paso 7: Iniciar la Aplicación

1. En DirectAdmin, ve a **"Setup Node.js App"**
2. Encuentra tu aplicación en la lista
3. Haz clic en **"Start"** o **"Restart"**
4. Espera unos segundos para que la app inicie

---

## ✅ Paso 8: Verificar que Funciona

1. Visita tu dominio: `https://tu-dominio.com`
2. Deberías ver la página de login
3. Inicia sesión con:
   - Email: `admin@easton.cl`
   - Password: `easton2026`

---

## 🔍 Solución de Problemas

### Error: "Cannot find module"
- Verifica que `node_modules` se haya instalado correctamente
- Ejecuta `npm install --production` manualmente

### Error: "Database connection failed"
- Verifica las credenciales en `.env`
- Asegúrate de que la base de datos existe y el usuario tiene permisos

### Error: "Port already in use"
- DirectAdmin debería manejar esto automáticamente
- Verifica en la configuración de la app el puerto asignado

### La app no inicia
- Revisa los logs en DirectAdmin: **"Node.js App" > "View Logs"**
- Verifica que el comando `npm start` sea correcto
- Asegúrate de que el build de producción existe (carpeta `.next`)

### Prisma no encuentra el cliente
- Ejecuta: `npx prisma generate` en el servidor

---

## 📝 Notas Importantes

1. **Primera vez:** DirectAdmin instalará npm y las dependencias automáticamente cuando configures la app
2. **Actualizaciones:** Después de subir cambios, reinicia la app desde DirectAdmin
3. **Logs:** Revisa los logs regularmente en DirectAdmin para detectar errores
4. **Backup:** Haz backup de la base de datos antes de hacer cambios importantes

---

## 🎯 Comandos Útiles (por SSH)

```bash
# Ver estado de la app
pm2 list  # Si DirectAdmin usa PM2

# Ver logs
tail -f ~/logs/nodejs-app.log

# Reiniciar manualmente
cd /ruta/a/tu/app
npm start
```

---

## 📞 Soporte

Si tienes problemas, verifica:
1. ✅ Logs de la aplicación en DirectAdmin
2. ✅ Variables de entorno configuradas correctamente
3. ✅ Base de datos accesible
4. ✅ Build de producción completo (carpeta `.next` existe)
