# 🚀 Deploy en DirectAdmin - Paso a Paso Específico

## ⚠️ PROBLEMA CRÍTICO DETECTADO

**Node.js 10.24.1 es demasiado antiguo para Next.js 14**

Next.js 14 requiere **Node.js 18.0.0 o superior**. 

### Solución Inmediata:

1. **Verifica si hay versiones más nuevas disponibles:**
   - Haz clic en el dropdown de "Node.js version"
   - Busca versiones **18.x** o **20.x**
   - Si encuentras una versión 18 o superior, úsala

2. **Si NO hay versiones más nuevas:**
   - Contacta a tu proveedor de hosting para solicitar Node.js 18 o superior
   - O considera usar un servicio como Vercel/Netlify que tiene Node.js actualizado

---

## 📋 CONFIGURACIÓN PASO A PASO

### Paso 1: Preparar Archivos Localmente

1. **Actualiza tu archivo `.env` con estos valores:**

```env
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost:3306/eastonde_survey"
NEXTAUTH_SECRET="GENERA_UN_SECRET_SEGURO_AQUI"
NEXTAUTH_URL="https://survey.eastondesign.cl"
NODE_ENV="production"
```

**Genera el secret:**
```bash
openssl rand -base64 32
```

### Paso 2: Subir Archivos al Servidor

**Ruta de destino:** `/home/eastonde/domains/survey.eastondesign.cl/public_html`

**Sube estos archivos/carpetas:**
- ✅ `app/` (carpeta completa)
- ✅ `components/` (carpeta completa)
- ✅ `lib/` (carpeta completa)
- ✅ `prisma/` (carpeta completa)
- ✅ `public/` (carpeta completa)
- ✅ `hooks/` (carpeta completa)
- ✅ `.next/` (carpeta completa - BUILD DE PRODUCCIÓN)
- ✅ `package.json`
- ✅ `package-lock.json` (si existe)
- ✅ `next.config.js`
- ✅ `tailwind.config.ts`
- ✅ `tsconfig.json`
- ✅ `postcss.config.js`
- ✅ `server.js` (el archivo que creamos)
- ✅ `.env` (CONFIGURADO PARA PRODUCCIÓN)

**NO subas:**
- ❌ `node_modules/` (se instalará en el servidor)

### Paso 3: Configurar en DirectAdmin

En la pantalla "CREATE APPLICATION", configura:

#### 1. Node.js version:
- **IMPORTANTE:** Selecciona la versión más nueva disponible (preferiblemente 18.x o 20.x)
- Si solo hay 10.24.1, esto NO funcionará con Next.js 14

#### 2. Application mode:
- Selecciona: **`Production`** ✅

#### 3. Application root:
- Valor: `/home/eastonde/domains/survey.eastondesign.cl/public_html` ✅
- (Ya está prellenado correctamente)

#### 4. Application URL:
- Valor: `survey.eastondesign.cl` ✅
- (Ya está prellenado correctamente)

#### 5. Application startup file:
- Valor: **`server.js`** 
- (Este es el archivo que creamos para iniciar Next.js)

#### 6. Environment variables:
Haz clic en **`+ ADD VARIABLE`** y agrega estas variables:

**Variable 1:**
- Name: `DATABASE_URL`
- Value: `mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost:3306/eastonde_survey`

**Variable 2:**
- Name: `NEXTAUTH_SECRET`
- Value: `TU_SECRET_GENERADO` (el que generaste con openssl)

**Variable 3:**
- Name: `NEXTAUTH_URL`
- Value: `https://survey.eastondesign.cl`

**Variable 4:**
- Name: `NODE_ENV`
- Value: `production`

#### 7. Crear la aplicación:
- Haz clic en el botón azul **`CREATE`**

---

## 🔧 Paso 4: Instalar Dependencias

Después de crear la aplicación, DirectAdmin debería instalar automáticamente las dependencias. Si no lo hace:

### Opción A: Por SSH (si tienes acceso)
```bash
cd /home/eastonde/domains/survey.eastondesign.cl/public_html
npm install --production
npx prisma generate
```

### Opción B: Desde DirectAdmin
- Busca la opción "Run Command" o "Execute Command" en la interfaz de Node.js App
- Ejecuta: `npm install --production`
- Luego: `npx prisma generate`

---

## 🗄️ Paso 5: Configurar Base de Datos

```bash
cd /home/eastonde/domains/survey.eastondesign.cl/public_html
npx prisma db push
```

---

## 🚀 Paso 6: Iniciar la Aplicación

En DirectAdmin, busca tu aplicación Node.js y haz clic en **"Start"** o **"Restart"**

---

## ✅ Paso 7: Verificar

Visita: `https://survey.eastondesign.cl`

Deberías ver la página de login.

---

## ⚠️ PROBLEMA CON NODE.JS 10.24.1

Si DirectAdmin solo ofrece Node.js 10.24.1, tienes estas opciones:

### Opción 1: Solicitar Actualización
Contacta a tu proveedor de hosting y solicita Node.js 18 o superior.

### Opción 2: Usar Vercel/Netlify (Recomendado)
Estos servicios tienen Node.js actualizado y son gratuitos:
- **Vercel:** https://vercel.com (gratis, hecho por los creadores de Next.js)
- **Netlify:** https://netlify.com (gratis)

### Opción 3: Downgrade de Next.js (NO RECOMENDADO)
Podrías intentar usar Next.js 12 o 13, pero perderás características nuevas.

---

## 🔍 Verificación Post-Deploy

1. ✅ La aplicación inicia sin errores
2. ✅ Puedes acceder a `https://survey.eastondesign.cl`
3. ✅ El login funciona
4. ✅ La conexión a la base de datos funciona
5. ✅ Las rutas API responden correctamente

---

## 📞 Si Algo Sale Mal

1. **Revisa los logs** en DirectAdmin (busca "View Logs" o "Application Logs")
2. **Verifica las variables de entorno** están correctas
3. **Confirma que npm install** se ejecutó correctamente
4. **Verifica la versión de Node.js** (debe ser 18+)
