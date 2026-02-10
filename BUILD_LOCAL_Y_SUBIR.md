# 📦 Construir Localmente y Subir a Producción

## 🎯 Pasos para Construir Localmente y Subir

### Paso 1: Construir en tu Máquina Local

```bash
cd C:\Users\Camilo\Documents\Desarrollo\survey

# Limpiar build anterior
rmdir /s /q .next

# Construir aplicación
npm run build
```

Esto creará la carpeta `.next` con el build de producción.

### Paso 2: Comprimir la Carpeta .next

**Opción A: Con PowerShell (Windows)**
```powershell
cd C:\Users\Camilo\Documents\Desarrollo\survey
Compress-Archive -Path .next -DestinationPath next-build.zip
```

**Opción B: Con 7-Zip o WinRAR**
- Selecciona la carpeta `.next`
- Crea un archivo ZIP
- Nombre: `next-build.zip`

### Paso 3: Subir al Servidor

1. **Por FTP/SFTP:**
   - Conecta a tu servidor
   - Navega a: `/home/eastonde/domains/survey.eastondesign.cl/public_html/`
   - Sube el archivo `next-build.zip`

2. **Por SSH (si tienes acceso):**
   ```bash
   # Subir el archivo (desde tu máquina local con SCP o similar)
   # Luego en el servidor:
   cd /home/eastonde/domains/survey.eastondesign.cl/public_html/
   unzip next-build.zip
   ```

### Paso 4: Descomprimir en el Servidor

**Por SSH:**
```bash
cd /home/eastonde/domains/survey.eastondesign.cl/public_html/

# Eliminar build anterior si existe
rm -rf .next

# Descomprimir
unzip next-build.zip

# Verificar que se creó
ls -la .next
```

### Paso 5: Reiniciar en DirectAdmin

1. Ve a DirectAdmin
2. Entra a tu aplicación Node.js
3. Haz clic en **"RESTART"**

---

## ✅ Verificación

Después de reiniciar:

1. Visita: `https://survey.eastondesign.cl`
2. Verifica que la imagen se muestra correctamente
3. Prueba iniciar sesión

---

## 📝 Notas Importantes

- ✅ La carpeta `.next` puede ser grande (50-200 MB)
- ✅ Asegúrate de subir también los archivos modificados (`header.tsx` y `page.tsx`)
- ✅ La imagen `Ed_Isotipo_rojo.png` debe estar en `public/`
- ✅ No necesitas reconstruir en el servidor si construyes localmente

---

## 🔄 Para Futuras Actualizaciones

Cada vez que hagas cambios:

1. **Construir localmente:** `npm run build`
2. **Comprimir `.next`:** Crear ZIP
3. **Subir al servidor:** Reemplazar `.next` anterior
4. **Reiniciar aplicación:** Desde DirectAdmin
