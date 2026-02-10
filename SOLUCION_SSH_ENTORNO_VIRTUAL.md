# 🔧 Solución: Usar Entorno Virtual de Node.js desde SSH

## ✅ La Solución

DirectAdmin crea un **entorno virtual de Node.js** donde SÍ está disponible `npm`. Necesitas activar ese entorno antes de ejecutar comandos.

## 📋 Pasos Detallados

### Paso 1: Conectarte por SSH

Conéctate a tu servidor usando tu usuario `eastonde`.

### Paso 2: Activar el Entorno Virtual

Ejecuta este comando (DirectAdmin lo muestra en la pantalla de administración):

```bash
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html
```

**Explicación:**
- `source .../activate` → Activa el entorno virtual de Node.js 24.6.0
- `cd .../public_html` → Te lleva al directorio de tu aplicación
- Después de esto, `npm` debería estar disponible

### Paso 3: Verificar que npm funciona

```bash
npm --version
node --version
```

Deberías ver las versiones de npm y Node.js.

### Paso 4: Instalar Dependencias

```bash
npm install --legacy-peer-deps --production
```

Este comando debería funcionar ahora sin errores.

### Paso 5: Generar Prisma Client

```bash
npx prisma generate
```

### Paso 6: Configurar Base de Datos

```bash
npx prisma db push
```

### Paso 7: Volver a DirectAdmin

Después de completar estos pasos, ve a DirectAdmin y:
1. Haz clic en **"RESTART"** en la aplicación Node.js
2. O haz clic en **"STOP APP"** y luego **"START APP"**

---

## 🎯 Comandos Completos (Copia y Pega)

Ejecuta estos comandos uno por uno en tu terminal SSH:

```bash
# 1. Activar entorno virtual y cambiar al directorio
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# 2. Verificar que npm funciona
npm --version

# 3. Instalar dependencias
npm install --legacy-peer-deps --production

# 4. Generar Prisma Client
npx prisma generate

# 5. Configurar base de datos
npx prisma db push

# 6. Verificar que todo está bien
ls -la node_modules | head -5
```

---

## ⚠️ Notas Importantes

1. **Siempre activa el entorno virtual primero** antes de ejecutar comandos npm
2. El entorno virtual es específico para Node.js 24.6.0
3. Después de activar el entorno, `npm` y `npx` estarán disponibles
4. El directorio de trabajo debe ser `/home/eastonde/domains/survey.eastondesign.cl/public_html`

---

## 🔄 Para Futuras Instalaciones

Cada vez que necesites ejecutar comandos npm, primero activa el entorno:

```bash
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html
```

Luego ejecuta tus comandos npm normalmente.

---

## ✅ Verificación Final

Después de instalar todo:

1. **Verifica que node_modules existe:**
   ```bash
   ls -la node_modules | wc -l
   ```
   Debería mostrar un número grande (muchas carpetas)

2. **Verifica que Prisma está instalado:**
   ```bash
   ls -la node_modules/.prisma
   ```

3. **En DirectAdmin, reinicia la aplicación**

4. **Visita:** `https://survey.eastondesign.cl`

---

## 🆘 Si Algo Sale Mal

### Error: "npm: command not found"
- Asegúrate de haber ejecutado el comando `source` para activar el entorno virtual
- Verifica que estás en el directorio correcto

### Error: "Cannot find module"
- Verifica que `npm install` se completó sin errores
- Revisa que estás en el directorio `/home/eastonde/domains/survey.eastondesign.cl/public_html`

### Error de permisos
- Verifica que los archivos tienen los permisos correctos:
  ```bash
  ls -la
  ```
