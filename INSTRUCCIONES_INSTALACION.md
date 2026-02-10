# 🔧 Instrucciones para Resolver Error de npm install

## ❌ Problema Actual

DirectAdmin ejecuta `npm install` pero no lee el `.npmrc`, causando error de dependencias.

## ✅ Solución: Usar Script de Instalación

### Opción 1: Ejecutar Script Manualmente (RECOMENDADO)

1. **Sube el archivo `install-dependencies.sh` al servidor** en:
   ```
   /home/eastonde/domains/survey.eastondesign.cl/public_html/install-dependencies.sh
   ```

2. **Dale permisos de ejecución por SSH:**
   ```bash
   cd /home/eastonde/domains/survey.eastondesign.cl/public_html
   chmod +x install-dependencies.sh
   ```

3. **Ejecuta el script desde DirectAdmin:**
   - Ve a tu aplicación Node.js
   - Busca "Run Command" o "Execute Command"
   - Ejecuta: `bash install-dependencies.sh`
   - O: `./install-dependencies.sh`

### Opción 2: Ejecutar Comandos Directamente

Desde DirectAdmin, en "Run Command", ejecuta estos comandos uno por uno:

**Comando 1:**
```bash
cd /home/eastonde/domains/survey.eastondesign.cl/public_html && npm install --legacy-peer-deps --production
```

**Comando 2:**
```bash
cd /home/eastonde/domains/survey.eastondesign.cl/public_html && npx prisma generate
```

**Comando 3:**
```bash
cd /home/eastonde/domains/survey.eastondesign.cl/public_html && npx prisma db push
```

### Opción 3: Modificar package.json (Ya hecho)

El `package.json` ya tiene el script modificado, pero npm no lo ejecuta automáticamente cuando DirectAdmin llama `npm install` directamente.

**Solución:** En lugar de usar el botón "Run npm install" de DirectAdmin, usa "Run Command" y ejecuta:

```bash
npm run install
```

Esto ejecutará el script `install` que tiene `--legacy-peer-deps`.

---

## 🎯 Pasos Recomendados

### Paso 1: Sube estos archivos al servidor
- ✅ `install-dependencies.sh` (nuevo script)
- ✅ `package.json` (actualizado)

### Paso 2: Ejecuta desde DirectAdmin

**Método A - Usar el script:**
1. Ve a "Run Command"
2. Ejecuta: `bash install-dependencies.sh`

**Método B - Comandos directos:**
1. Ve a "Run Command"
2. Ejecuta: `npm install --legacy-peer-deps --production`
3. Luego: `npx prisma generate`
4. Luego: `npx prisma db push`

**Método C - Usar script de package.json:**
1. Ve a "Run Command"
2. Ejecuta: `npm run install`

### Paso 3: Verificar

Después de ejecutar, verifica que:
- ✅ Existe la carpeta `node_modules/`
- ✅ No hay errores
- ✅ La aplicación puede iniciar

### Paso 4: Iniciar la App

Desde DirectAdmin, inicia o reinicia tu aplicación Node.js.

---

## 📝 Nota sobre SSH

Si por SSH no encuentras npm, es porque no está en tu PATH. DirectAdmin sí lo encuentra porque usa el Node.js que configuraste (24.6.0).

Para usar npm por SSH, necesitas encontrar su ruta:
```bash
# Busca dónde está Node.js 24.6.0
which node
# O busca en rutas comunes de DirectAdmin
ls -la /usr/local/bin/ | grep npm
ls -la ~/node_modules/.bin/ | grep npm
```

Pero es más fácil usar DirectAdmin directamente para ejecutar los comandos.

---

## ✅ Resumen Rápido

1. ✅ Sube `install-dependencies.sh` al servidor
2. ✅ En DirectAdmin, ve a "Run Command"
3. ✅ Ejecuta: `bash install-dependencies.sh`
4. ✅ O ejecuta: `npm install --legacy-peer-deps --production` seguido de `npx prisma generate`
5. ✅ Configura BD: `npx prisma db push`
6. ✅ Inicia la app desde DirectAdmin
