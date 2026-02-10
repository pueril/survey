# 📋 Resumen Rápido - Deploy en DirectAdmin

## ✅ Estado Actual
- ✅ Build de producción completado
- ✅ Proyecto probado localmente
- ✅ Base de datos configurada

## 🎯 Próximos Pasos

### 1️⃣ PREPARAR ARCHIVOS LOCALMENTE

**Antes de subir, actualiza el archivo `.env` con datos de PRODUCCIÓN:**

```env
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost:3306/eastonde_survey"
NEXTAUTH_SECRET="GENERA_UN_SECRET_SEGURO"  # ⚠️ Cambia esto por un secret seguro
NEXTAUTH_URL="https://tu-dominio-real.com"  # ⚠️ Cambia por tu dominio real
NODE_ENV="production"
```

**Para generar un secret seguro:**
```bash
openssl rand -base64 32
```

### 2️⃣ SUBIR ARCHIVOS AL SERVIDOR

**Opción A: Por FTP/SFTP**
- Conecta a tu servidor
- Sube TODAS las carpetas y archivos listados en `ARCHIVOS_PARA_SUBIR.txt`
- Mantén la estructura de directorios

**Opción B: Por SSH (si tienes acceso)**
```bash
# Comprime localmente (Windows: WinRAR/7-Zip)
# Luego en el servidor:
cd /home/tu-usuario/domains/tu-dominio.com/
unzip proyecto.zip -d nodejs-app/
```

### 3️⃣ CONFIGURAR EN DIRECTADMIN

1. Ve a **"Setup Node.js App"**
2. Crea nueva aplicación:
   - **Node.js Version:** 18.x o superior
   - **Application Root:** `/home/tu-usuario/domains/tu-dominio.com/nodejs-app/`
   - **Application URL:** `/`
   - **Run Command:** `npm start`
   - **Mode:** `Production`

3. **Variables de Entorno** (en DirectAdmin):
   ```
   DATABASE_URL=mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost:3306/eastonde_survey
   NEXTAUTH_SECRET=TU_SECRET_GENERADO
   NEXTAUTH_URL=https://tu-dominio.com
   NODE_ENV=production
   ```

### 4️⃣ INSTALAR DEPENDENCIAS

DirectAdmin debería hacerlo automáticamente, pero si no:

**Por SSH:**
```bash
cd /home/tu-usuario/domains/tu-dominio.com/nodejs-app/
npm install --production
npx prisma generate
```

**O desde DirectAdmin:**
- Usa "Run Command" y ejecuta: `npm install --production`

### 5️⃣ CONFIGURAR BASE DE DATOS

```bash
npx prisma db push
```

### 6️⃣ INICIAR LA APP

En DirectAdmin, haz clic en **"Start"** o **"Restart"**

### 7️⃣ VERIFICAR

Visita: `https://tu-dominio.com`
Login: `admin@easton.cl` / `easton2026`

---

## ⚠️ IMPORTANTE ANTES DE SUBIR

1. **Actualiza `.env`** con datos de producción (especialmente NEXTAUTH_URL y NEXTAUTH_SECRET)
2. **NO subas `node_modules`** (se instalará en el servidor)
3. **SÍ sube la carpeta `.next`** (contiene el build de producción)
4. **Verifica que la base de datos existe** en el servidor

---

## 📞 Si Algo Sale Mal

1. Revisa los **logs en DirectAdmin** (Node.js App > View Logs)
2. Verifica que las **variables de entorno** estén correctas
3. Asegúrate de que **npm install** se ejecutó correctamente
4. Verifica que la **base de datos** es accesible

---

## 📚 Documentación Completa

Lee `DEPLOY_DIRECTADMIN.md` para instrucciones detalladas.
