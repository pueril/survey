# 🔧 Solución: Comando Prisma Colgado

## ❌ Problema

`npx prisma db push` lleva varios minutos sin responder. Esto indica que está intentando conectarse pero no puede.

## ✅ Solución Inmediata

### Paso 1: Cancelar el Comando

Presiona `Ctrl + C` para cancelar el comando que está ejecutándose.

### Paso 2: Verificar Variables de Entorno

El problema puede ser que DirectAdmin está usando las variables de entorno que configuraste, pero el formato del socket puede estar incorrecto.

### Paso 3: Usar localhost (Que Sabemos que Funciona)

Como sabemos que `localhost` funciona con MySQL directamente, usemos ese formato primero:

**En DirectAdmin, en las variables de entorno de la aplicación Node.js, configura:**

```
DATABASE_URL=mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost:3306/eastonde_survey
```

**NOTA:** Sin comillas, DirectAdmin las agrega automáticamente.

### Paso 4: Guardar y Reiniciar la Aplicación

1. Guarda los cambios en DirectAdmin
2. Reinicia la aplicación Node.js

### Paso 5: Probar Prisma Nuevamente

```bash
# Asegúrate de estar en el entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Verificar que las variables están cargadas
echo $DATABASE_URL

# Probar Prisma (debería tardar solo segundos)
npx prisma db push
```

---

## 🔍 Si Quieres Usar Socket (Formato Correcto)

Si prefieres usar socket, el formato correcto en DirectAdmin debe ser:

```
DATABASE_URL=mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/var/lib/mysql/mysql.sock
```

**IMPORTANTE:**
- No uses `:3306` cuando usas socket
- El formato es: `mysql://usuario:pass@localhost/db?socket=/ruta/socket`
- No `mysql://usuario:pass@localhost:3306/db?socket=...` (esto es incorrecto)

---

## ⏱️ Tiempo Normal de Ejecución

- `npx prisma db push` normalmente tarda **5-30 segundos**
- Si tarda más de **1 minuto**, está colgado y debes cancelarlo

---

## 🎯 Pasos Recomendados

1. **Cancelar comando actual:** `Ctrl + C`

2. **En DirectAdmin, cambiar variable a:**
   ```
   DATABASE_URL=mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost:3306/eastonde_survey
   ```

3. **Guardar y reiniciar aplicación en DirectAdmin**

4. **Probar nuevamente:**
   ```bash
   source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html
   npx prisma db push
   ```

---

## 🔍 Verificar Variables de Entorno

Para ver qué está leyendo Prisma:

```bash
# Ver variable desde el entorno
echo $DATABASE_URL

# Ver desde .env
cat .env | grep DATABASE_URL

# Probar Prisma con variable explícita
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost:3306/eastonde_survey" npx prisma db push
```

---

## ✅ Resumen

1. ✅ **Cancela el comando** con `Ctrl + C`
2. ✅ **Usa `localhost:3306`** en DirectAdmin (sabemos que funciona)
3. ✅ **Guarda y reinicia** la aplicación
4. ✅ **Prueba nuevamente** - debería tardar solo segundos
