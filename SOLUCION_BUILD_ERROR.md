# 🔧 Solución: Error de Build en Producción

## ❌ Problema

El build falla con errores de thread pool, probablemente por limitaciones de recursos en el servidor compartido. El error 503 indica que la aplicación no puede iniciar porque el build está incompleto o corrupto.

## ✅ Solución 1: Construir Localmente y Subir

La mejor solución es construir localmente y subir solo la carpeta `.next`:

### Paso 1: Construir Localmente

En tu máquina local (Windows):

```bash
cd C:\Users\Camilo\Documents\Desarrollo\survey

# Limpiar build anterior
rmdir /s /q .next

# Construir aplicación
npm run build
```

### Paso 2: Subir Solo la Carpeta .next

1. Comprime la carpeta `.next` (puede ser grande, usa 7-Zip o WinRAR)
2. Súbela al servidor en:
   ```
   /home/eastonde/domains/survey.eastondesign.cl/public_html/.next
   ```
3. Descomprime en el servidor

### Paso 3: Reiniciar en DirectAdmin

Reinicia la aplicación Node.js desde DirectAdmin.

---

## ✅ Solución 2: Limitar Recursos Durante el Build

Si prefieres construir en el servidor, limita los recursos:

```bash
# Activar entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Limitar workers de Next.js
NODE_OPTIONS="--max-old-space-size=2048" npm run build
```

O con menos workers:

```bash
# Construir con un solo worker (más lento pero más estable)
NEXT_PRIVATE_STANDALONE=true npm run build
```

---

## ✅ Solución 3: Restaurar Build Anterior

Si tenías un build funcionando antes:

```bash
# Ver si hay backups
ls -la .next.backup* 2>/dev/null

# O restaurar desde un backup si existe
```

---

## ✅ Solución 4: Construir con Variables de Entorno

```bash
# Activar entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Limpiar build corrupto
rm -rf .next

# Construir con variables que limitan recursos
NODE_OPTIONS="--max-old-space-size=2048" NEXT_TELEMETRY_DISABLED=1 npm run build
```

---

## 🎯 Recomendación: Construir Localmente

**La mejor opción es construir localmente** porque:
- ✅ No hay limitaciones de recursos
- ✅ Es más rápido
- ✅ Evita problemas del servidor compartido

### Pasos Detallados:

1. **En tu máquina local:**
   ```bash
   cd C:\Users\Camilo\Documents\Desarrollo\survey
   npm run build
   ```

2. **Comprimir la carpeta `.next`:**
   - Usa 7-Zip o WinRAR
   - Comprime solo el contenido de `.next` (no la carpeta misma)

3. **Subir al servidor:**
   - Por FTP/SFTP, sube el archivo comprimido
   - Descomprime en: `/home/eastonde/domains/survey.eastondesign.cl/public_html/`

4. **Verificar:**
   ```bash
   ls -la .next
   ```

5. **Reiniciar en DirectAdmin**

---

## 🔍 Verificar Estado Actual

```bash
# Ver si hay un build parcial
ls -la .next

# Ver logs de la aplicación en DirectAdmin
# Busca "View Logs" o "Application Logs"
```

---

## 🆘 Si Nada Funciona

Si ninguna solución funciona, puedes:
1. Contactar al soporte de tu hosting sobre las limitaciones de recursos
2. Considerar usar un servicio como Vercel para el build (gratis)
3. Usar un VPS con más recursos para el build
