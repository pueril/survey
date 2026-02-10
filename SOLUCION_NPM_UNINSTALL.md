# 🔧 Solución: node_modules se Convierte en Carpeta

## ❌ Problema

Cuando ejecutas `npm uninstall`, npm puede crear una carpeta `node_modules` real en lugar de usar el symlink del entorno virtual.

## ✅ Solución: Eliminar y Reinstalar Correctamente

### Paso 1: Eliminar la Carpeta node_modules

```bash
# Eliminar la carpeta real que se creó
rm -rf node_modules

# Verificar que se eliminó
ls -la | grep node_modules
# No debería mostrar nada
```

### Paso 2: Instalar Prisma Directamente (Sin Desinstalar Primero)

En lugar de desinstalar primero, instala directamente la versión correcta:

```bash
# Instalar Prisma 6.7.0 directamente (sobrescribirá cualquier versión anterior)
npm install prisma@6.7.0 @prisma/client@6.7.0 --legacy-peer-deps --save-exact
```

Esto debería:
- Usar el symlink del entorno virtual
- Instalar Prisma 6.7.0
- Sobrescribir cualquier versión anterior

### Paso 3: Verificar que node_modules Sigue Siendo Symlink

```bash
# Verificar que es un symlink
ls -la | grep node_modules
file node_modules
# Debería mostrar que es un symlink
```

### Paso 4: Generar Prisma Client

```bash
npx prisma generate
```

### Paso 5: Configurar Base de Datos

```bash
npx prisma db push
```

---

## 🎯 Comandos Completos (Copia y Pega)

```bash
# 1. Eliminar carpeta node_modules que se creó
rm -rf node_modules

# 2. Verificar que se eliminó
test -e node_modules && echo "ERROR: Aún existe" || echo "OK: Eliminado"

# 3. Instalar Prisma 6.7.0 directamente (sin desinstalar primero)
npm install prisma@6.7.0 @prisma/client@6.7.0 --legacy-peer-deps --save-exact

# 4. Verificar que node_modules es symlink
ls -la | grep node_modules
file node_modules

# 5. Generar Prisma Client
npx prisma generate

# 6. Configurar base de datos
npx prisma db push

# 7. Verificar versión
npx prisma --version
```

---

## ⚠️ Nota Importante

**NO uses `npm uninstall`** en este entorno de CloudLinux, ya que puede convertir el symlink en carpeta real.

En su lugar, **instala directamente la versión que necesitas** y npm sobrescribirá la versión anterior.

---

## 🔄 Si Sigue Convirtiéndose en Carpeta

Si después de instalar Prisma, `node_modules` se convierte en carpeta nuevamente:

1. **Elimina la carpeta:**
   ```bash
   rm -rf node_modules
   ```

2. **Verifica que CloudLinux recrea el symlink automáticamente:**
   ```bash
   # Espera unos segundos
   sleep 2
   ls -la | grep node_modules
   ```

3. **Si no se recrea automáticamente, reinstala una dependencia:**
   ```bash
   npm install --legacy-peer-deps --production
   ```

4. **Luego instala Prisma:**
   ```bash
   npm install prisma@6.7.0 @prisma/client@6.7.0 --legacy-peer-deps --save-exact
   ```
