# 📝 Instrucciones Específicas para DirectAdmin

## ⚠️ PROBLEMA CRÍTICO: Versión de Node.js

**Tu DirectAdmin muestra Node.js 10.24.1, pero Next.js 14 requiere Node.js 18+**

### 🔍 PRIMER PASO - Verificar Versiones Disponibles:

1. En la pantalla de "CREATE APPLICATION"
2. Haz clic en el dropdown de **"Node.js version"**
3. **Busca si hay versiones 18.x o 20.x disponibles**
4. Si encuentras una versión 18 o superior, úsala
5. Si SOLO hay 10.24.1, necesitarás contactar a tu proveedor

---

## 📋 CONFIGURACIÓN EN DIRECTADMIN

### Campos a Completar:

#### ✅ 1. Node.js version:
- **Selecciona la versión MÁS NUEVA disponible** (preferiblemente 18.x o 20.x)
- ⚠️ Si solo hay 10.24.1, esto NO funcionará

#### ✅ 2. Application mode:
- Selecciona: **`Production`**

#### ✅ 3. Application root:
- Ya está prellenado: `/home/eastonde/domains/survey.eastondesign.cl/public_html`
- ✅ Correcto, no cambies nada

#### ✅ 4. Application URL:
- Ya está prellenado: `survey.eastondesign.cl`
- ✅ Correcto, no cambies nada

#### ✅ 5. Application startup file:
- Ingresa: **`server.js`**
- Este es el archivo que inicia Next.js

#### ✅ 6. Environment variables:
Haz clic en **`+ ADD VARIABLE`** y agrega estas 4 variables:

**Variable 1:**
```
Name: DATABASE_URL
Value: mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost:3306/eastonde_survey
```

**Variable 2:**
```
Name: NEXTAUTH_SECRET
Value: [GENERA UN SECRET CON: openssl rand -base64 32]
```

**Variable 3:**
```
Name: NEXTAUTH_URL
Value: https://survey.eastondesign.cl
```

**Variable 4:**
```
Name: NODE_ENV
Value: production
```

#### ✅ 7. Crear:
- Haz clic en el botón azul **`CREATE`**

---

## 📤 ANTES DE CREAR LA APP - Subir Archivos

**IMPORTANTE:** Sube los archivos ANTES de crear la aplicación en DirectAdmin.

### Ruta de destino:
`/home/eastonde/domains/survey.eastondesign.cl/public_html`

### Archivos a subir (mantén la estructura):
```
✅ app/
✅ components/
✅ lib/
✅ prisma/
✅ public/
✅ hooks/
✅ .next/          (IMPORTANTE: carpeta del build)
✅ package.json
✅ package-lock.json
✅ next.config.js
✅ tailwind.config.ts
✅ tsconfig.json
✅ postcss.config.js
✅ server.js       (el archivo que creamos)
✅ .env            (configurado para producción)
```

### NO subas:
```
❌ node_modules/   (se instalará automáticamente)
```

---

## 🔧 DESPUÉS DE CREAR LA APP

### 1. Instalar Dependencias

DirectAdmin debería hacerlo automáticamente, pero verifica:

**Por SSH:**
```bash
cd /home/eastonde/domains/survey.eastondesign.cl/public_html
npm install --production
npx prisma generate
```

### 2. Configurar Base de Datos

```bash
npx prisma db push
```

### 3. Iniciar la Aplicación

En DirectAdmin, busca tu aplicación y haz clic en **"Start"**

---

## ✅ VERIFICAR QUE FUNCIONA

1. Visita: `https://survey.eastondesign.cl`
2. Deberías ver la página de login
3. Prueba iniciar sesión con:
   - Email: `admin@easton.cl`
   - Password: `easton2026`

---

## 🆘 SI SOLO HAY NODE.JS 10.24.1

Si DirectAdmin solo ofrece Node.js 10.24.1, tienes estas opciones:

### Opción 1: Contactar Proveedor
Solicita que actualicen Node.js a versión 18 o superior.

### Opción 2: Usar Vercel (Recomendado - Gratis)
- Vercel está hecho por los creadores de Next.js
- Tiene Node.js actualizado
- Deploy automático desde GitHub
- SSL gratuito
- URL: https://vercel.com

### Opción 3: Usar Netlify (Alternativa Gratis)
- Similar a Vercel
- Node.js actualizado
- URL: https://netlify.com

---

## 📞 Soporte

Si tienes problemas:
1. Revisa los logs en DirectAdmin
2. Verifica que las variables de entorno estén correctas
3. Confirma que `npm install` se ejecutó
4. Verifica la versión de Node.js (debe ser 18+)
