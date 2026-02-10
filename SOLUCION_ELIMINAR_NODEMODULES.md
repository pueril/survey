# 🔧 Solución: Eliminar node_modules Completamente

## ❌ Problema

CloudLinux detecta que existe una carpeta `node_modules` en el directorio de la aplicación y no permite instalaciones hasta que se elimine.

## ✅ Solución: Verificar y Eliminar Completamente

### Paso 1: Verificar qué Existe

```bash
# Ver si existe node_modules y qué tipo es
ls -la | grep node_modules

# Ver detalles completos
ls -la node_modules 2>/dev/null || echo "No existe node_modules"

# Verificar si es un symlink o carpeta real
file node_modules 2>/dev/null || echo "No existe"
```

### Paso 2: Eliminar Completamente

```bash
# Si es una carpeta real, elimínala completamente
rm -rf node_modules

# Si es un symlink, también elimínalo
rm -f node_modules

# Verificar que se eliminó
ls -la | grep node_modules
# No debería mostrar nada
```

### Paso 3: Verificar que el Directorio Está Limpio

```bash
# Listar todo en el directorio
ls -la

# Verificar que NO hay node_modules
test -e node_modules && echo "EXISTE - PROBLEMA" || echo "NO EXISTE - OK"
```

### Paso 4: Instalar Dependencias

```bash
# Ahora sí, instalar dependencias
npm install --legacy-peer-deps --production
```

### Paso 5: Verificar que se Creó el Symlink

```bash
# Verificar que ahora node_modules es un symlink
ls -la | grep node_modules
# Debería mostrar: node_modules -> /home/eastonde/nodevenv/...
```

---

## 🎯 Comandos Completos (Ejecuta en Orden)

```bash
# 1. Verificar qué existe
ls -la | grep node_modules
file node_modules 2>/dev/null || echo "No existe"

# 2. Eliminar completamente (carpeta o symlink)
rm -rf node_modules
rm -f node_modules

# 3. Verificar que se eliminó
ls -la | grep node_modules
test -e node_modules && echo "ERROR: Aún existe" || echo "OK: Eliminado"

# 4. Listar directorio para ver qué hay
ls -la

# 5. Instalar dependencias (CloudLinux creará el symlink)
npm install --legacy-peer-deps --production

# 6. Verificar que se creó el symlink
ls -la | grep node_modules
file node_modules

# 7. Si todo está bien, instalar Prisma
npm install prisma@6.7.0 @prisma/client@6.7.0 --legacy-peer-deps --save-exact

# 8. Generar Prisma
npx prisma generate

# 9. Configurar BD
npx prisma db push
```

---

## 🔍 Diagnóstico Adicional

Si después de eliminar `node_modules` sigue dando el mismo error:

### Verificar Permisos

```bash
# Ver permisos del directorio
ls -ld /home/eastonde/domains/survey.eastondesign.cl/public_html

# Ver si hay archivos ocultos
ls -la | grep "^\."
```

### Verificar Espacio en Disco

```bash
# Ver espacio disponible
df -h /home/eastonde/domains/survey.eastondesign.cl/public_html
```

### Verificar que Estás en el Directorio Correcto

```bash
# Ver directorio actual
pwd
# Debería mostrar: /home/eastonde/domains/survey.eastondesign.cl/public_html

# Ver contenido
ls -la
```

---

## 🆘 Si Nada Funciona

Si después de eliminar `node_modules` y verificar que no existe, sigue dando error:

1. **Contacta al soporte de tu hosting** - Puede ser una configuración específica de CloudLinux
2. **Verifica si hay algún archivo `.npmrc` o configuración** que esté causando conflicto:
   ```bash
   cat .npmrc 2>/dev/null
   cat package.json | grep -A 5 -B 5 "node_modules"
   ```

3. **Intenta crear el symlink manualmente** (solo si CloudLinux lo permite):
   ```bash
   # NO ejecutes esto sin confirmar primero
   # ln -s /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/lib/node_modules node_modules
   ```
