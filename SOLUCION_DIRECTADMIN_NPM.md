# 🔧 Solución Definitiva para npm install en DirectAdmin

## ❌ Problema

DirectAdmin ejecuta `npm install` pero no lee el archivo `.npmrc`, causando el error de dependencias.

## ✅ Solución: Modificar package.json

He modificado tu `package.json` para que el script `install` use automáticamente `--legacy-peer-deps`.

### Paso 1: Sube el package.json actualizado

**IMPORTANTE:** Sube el archivo `package.json` actualizado al servidor. Este archivo ahora tiene:

```json
"scripts": {
  "install": "npm install --legacy-peer-deps",
  "postinstall": "npx prisma generate"
}
```

Esto hará que cuando DirectAdmin ejecute `npm install`, automáticamente use `--legacy-peer-deps`.

### Paso 2: Ejecutar desde DirectAdmin

1. Ve a tu aplicación Node.js en DirectAdmin
2. Haz clic en **"Run npm install"** o **"Execute npm install"**
3. Ahora debería funcionar sin errores

### Paso 3: Verificar

Después de que termine, verifica que:
- ✅ Se creó la carpeta `node_modules/`
- ✅ No hay errores
- ✅ Prisma Client se generó automáticamente (gracias al script `postinstall`)

---

## 🔄 Alternativa: Ejecutar por SSH con ruta completa

Si DirectAdmin sigue dando problemas, puedes ejecutar manualmente por SSH usando la ruta completa de npm:

```bash
cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Encuentra la ruta de npm (DirectAdmin generalmente lo instala en un lugar específico)
# Prueba estas rutas comunes:
/usr/local/bin/npm install --legacy-peer-deps --production
# O
~/.npm-global/bin/npm install --legacy-peer-deps --production
# O busca dónde está instalado Node.js 24.6.0
which node
# Luego usa esa ruta para npm
```

---

## 🎯 Solución Más Simple: Modificar package.json localmente

Si prefieres hacerlo manualmente, edita tu `package.json` local y agrega esto en la sección `scripts`:

```json
"scripts": {
  "install": "npm install --legacy-peer-deps",
  "postinstall": "npx prisma generate",
  "dev": "next dev",
  "build": "next build",
  "start": "next start",
  "lint": "next lint"
}
```

Luego sube el `package.json` actualizado al servidor.

---

## 📋 Después de Instalar

Una vez que `npm install` termine correctamente:

1. **Configurar Base de Datos:**
   ```bash
   cd /home/eastonde/domains/survey.eastondesign.cl/public_html
   npx prisma db push
   ```

2. **Iniciar la aplicación** desde DirectAdmin

---

## ✅ Resumen

1. ✅ Sube el `package.json` actualizado (ya tiene el script `install` con `--legacy-peer-deps`)
2. ✅ Ejecuta `npm install` desde DirectAdmin (ahora funcionará)
3. ✅ Prisma se generará automáticamente (gracias a `postinstall`)
4. ✅ Ejecuta `npx prisma db push` para configurar la base de datos
5. ✅ Inicia la app desde DirectAdmin
