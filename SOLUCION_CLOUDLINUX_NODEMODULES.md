# 🔧 Solución: CloudLinux NodeJS Selector y node_modules

## ❌ Problema

CloudLinux NodeJS Selector requiere que `node_modules` esté en el entorno virtual, no en el directorio de la aplicación. Debe haber un **symlink** desde la aplicación hacia el entorno virtual.

## ✅ Solución: Instalar en el Entorno Virtual

### Paso 1: Activar Entorno Virtual y Verificar Estructura

```bash
# Activar entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Verificar si existe node_modules (debería ser un symlink o no existir)
ls -la | grep node_modules

# Verificar estructura del entorno virtual
ls -la /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/
```

### Paso 2: Eliminar node_modules si Existe (Carpeta Real)

```bash
# Si existe una carpeta node_modules real (no symlink), elimínala
rm -rf node_modules

# Verificar que no existe
ls -la | grep node_modules
```

### Paso 3: Instalar Dependencias (Se Instalarán en el Entorno Virtual)

```bash
# Asegúrate de estar en el directorio de la aplicación
cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Instalar dependencias (se instalarán automáticamente en el entorno virtual)
npm install --legacy-peer-deps --production

# Verificar que se creó el symlink
ls -la | grep node_modules
# Debería mostrar algo como: node_modules -> /home/eastonde/nodevenv/...
```

### Paso 4: Instalar Versión Correcta de Prisma

```bash
# Desinstalar Prisma si está instalado
npm uninstall prisma @prisma/client

# Instalar versión específica 6.7.0
npm install prisma@6.7.0 @prisma/client@6.7.0 --legacy-peer-deps --save-exact

# Verificar instalación
npm list prisma @prisma/client
```

### Paso 5: Generar Prisma Client

```bash
# Generar Prisma Client (se instalará en el entorno virtual)
npx prisma generate

# Verificar que se generó
ls -la node_modules/.prisma/client
```

### Paso 6: Configurar Base de Datos

```bash
npx prisma db push
```

---

## 🎯 Comandos Completos (Copia y Pega)

```bash
# 1. Activar entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# 2. Eliminar node_modules si existe como carpeta real
rm -rf node_modules

# 3. Instalar todas las dependencias
npm install --legacy-peer-deps --production

# 4. Verificar que node_modules es un symlink
ls -la | grep node_modules

# 5. Desinstalar Prisma incorrecto
npm uninstall prisma @prisma/client

# 6. Instalar Prisma 6.7.0
npm install prisma@6.7.0 @prisma/client@6.7.0 --legacy-peer-deps --save-exact

# 7. Generar Prisma Client
npx prisma generate

# 8. Configurar base de datos
npx prisma db push

# 9. Verificar versión de Prisma
npx prisma --version
```

---

## ⚠️ Notas Importantes

1. **NO crees una carpeta `node_modules` manualmente** en el directorio de la aplicación
2. **CloudLinux creará automáticamente el symlink** cuando ejecutes `npm install`
3. **Todas las dependencias se instalan en el entorno virtual**, no en la aplicación
4. **Siempre activa el entorno virtual** antes de ejecutar comandos npm

---

## 🔍 Verificación

Después de instalar, verifica:

```bash
# Verificar que node_modules es un symlink
ls -la | grep node_modules
# Debería mostrar: node_modules -> /home/eastonde/nodevenv/...

# Verificar que las dependencias están instaladas
ls -la node_modules | head -10

# Verificar versión de Prisma
npx prisma --version
# Debería mostrar: prisma 6.7.0
```

---

## 🆘 Si Sigue Dando Error

Si después de eliminar `node_modules` y ejecutar `npm install` sigue dando error:

1. **Verifica que estás en el directorio correcto:**
   ```bash
   pwd
   # Debería mostrar: /home/eastonde/domains/survey.eastondesign.cl/public_html
   ```

2. **Verifica que el entorno virtual está activado:**
   ```bash
   which npm
   # Debería mostrar una ruta dentro de nodevenv
   ```

3. **Verifica permisos:**
   ```bash
   ls -la /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/
   ```

4. **Intenta instalar sin --production (incluye dev dependencies):**
   ```bash
   npm install --legacy-peer-deps
   ```
