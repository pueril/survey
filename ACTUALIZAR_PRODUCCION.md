# 🔄 Actualizar Cambios en Producción

## ⚠️ Problema

Los cambios en el código no se reflejan en producción porque Next.js necesita reconstruirse.

## ✅ Solución: Reconstruir la Aplicación

### Paso 1: Verificar que la Imagen Está en el Servidor

Por SSH, verifica que la imagen existe:

```bash
# Activar entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Verificar que la imagen existe
ls -la public/Ed_Isotipo_rojo.png
```

Si no existe, súbela al servidor en:
```
/home/eastonde/domains/survey.eastondesign.cl/public_html/public/Ed_Isotipo_rojo.png
```

### Paso 2: Subir Archivos Modificados

Asegúrate de subir los archivos modificados:
- `components/admin/header.tsx`
- `app/encuesta/[token]/page.tsx`

### Paso 3: Reconstruir la Aplicación

```bash
# Activar entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Limpiar build anterior (opcional pero recomendado)
rm -rf .next

# Construir aplicación de producción
npm run build
```

Esto puede tardar 1-3 minutos.

### Paso 4: Reiniciar la Aplicación en DirectAdmin

1. Ve a DirectAdmin
2. Entra a tu aplicación Node.js
3. Haz clic en **"RESTART"** o **"STOP APP"** y luego **"START APP"**

### Paso 5: Limpiar Caché del Navegador

Si aún no ves los cambios:
- Presiona `Ctrl + Shift + R` (Windows/Linux) o `Cmd + Shift + R` (Mac)
- O abre en modo incógnito

---

## 🎯 Comandos Completos (Copia y Pega)

```bash
# 1. Activar entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# 2. Verificar imagen
ls -la public/Ed_Isotipo_rojo.png

# 3. Limpiar build anterior
rm -rf .next

# 4. Construir aplicación
npm run build

# 5. Verificar que el build se completó
ls -la .next
```

Después de esto, reinicia la aplicación en DirectAdmin.

---

## 🔍 Verificación

Después de reiniciar, verifica:

1. **Inspecciona el elemento** en el navegador (F12)
2. **Verifica que la imagen se carga:**
   - Debería mostrar: `<img src="/Ed_Isotipo_rojo.png" ...>`
   - Al hacer clic derecho > "Abrir imagen en nueva pestaña" debería mostrar la imagen

3. **Si la imagen no carga**, verifica la ruta:
   ```bash
   # Verificar que la imagen es accesible
   curl -I https://survey.eastondesign.cl/Ed_Isotipo_rojo.png
   ```

---

## 🆘 Si Sigue Sin Funcionar

### Verificar Logs

En DirectAdmin, revisa los logs de la aplicación para ver si hay errores.

### Verificar Permisos

```bash
# Verificar permisos de la imagen
ls -la public/Ed_Isotipo_rojo.png

# Si es necesario, dar permisos de lectura
chmod 644 public/Ed_Isotipo_rojo.png
```

### Verificar que Next.js Sirve la Imagen

Las imágenes en `public/` deberían servirse automáticamente, pero verifica que Next.js esté configurado correctamente.
