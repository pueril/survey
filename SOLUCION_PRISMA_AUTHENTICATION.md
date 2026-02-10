# 🔧 Solución: Error de Autenticación en Prisma

## ❌ Problema

- ✅ `mariadb` funciona sin host (usa socket)
- ❌ Prisma falla con `localhost:3306` (intenta TCP)
- ✅ Prisma lee el `.env` correctamente
- ❌ `echo $DATABASE_URL` está vacío (normal, las variables de DirectAdmin no se exportan al shell)

## ✅ Solución: Usar Socket Explícito en Prisma

Como `mariadb` funciona sin especificar host (usa socket), Prisma también necesita usar socket.

### Paso 1: Actualizar .env con Socket

Edita el archivo `.env`:

```bash
nano .env
```

Cambia `DATABASE_URL` a usar socket:

```env
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/var/lib/mysql/mysql.sock"
```

**IMPORTANTE:**
- **NO** uses `:3306` cuando usas socket
- El formato es: `mysql://usuario:pass@localhost/db?socket=/ruta/socket`
- Usa `/var/lib/mysql/mysql.sock` (el socket principal)

### Paso 2: Actualizar en DirectAdmin (Opcional)

También puedes actualizar la variable en DirectAdmin:

```
DATABASE_URL=mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/var/lib/mysql/mysql.sock
```

### Paso 3: Probar Prisma

```bash
# Asegúrate de estar en el entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Verificar que .env tiene el formato correcto
cat .env | grep DATABASE_URL

# Probar Prisma
npx prisma db push
```

---

## 🔍 Por Qué Funciona mariadb pero No Prisma

- **`mariadb` sin host:** Usa socket Unix automáticamente → ✅ Funciona
- **Prisma con `localhost:3306`:** Intenta conexión TCP → ❌ Falla (probablemente el usuario no tiene permisos TCP)
- **Prisma con socket:** Usa socket Unix explícito → ✅ Debería funcionar

---

## 🎯 Comandos Completos

```bash
# 1. Activar entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# 2. Editar .env
nano .env
# Cambia DATABASE_URL a:
# DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/var/lib/mysql/mysql.sock"

# 3. Verificar que se guardó correctamente
cat .env | grep DATABASE_URL

# 4. Probar Prisma
npx prisma db push
```

---

## 🔄 Si el Socket de /var/lib/mysql No Funciona

Si `/var/lib/mysql/mysql.sock` no funciona, prueba con `/tmp/mysql.sock`:

```env
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/tmp/mysql.sock"
```

---

## ⚠️ Sobre echo $DATABASE_URL Vacío

Es **normal** que `echo $DATABASE_URL` esté vacío cuando ejecutas comandos por SSH. Las variables de entorno de DirectAdmin solo están disponibles cuando la aplicación Node.js está corriendo, no en tu sesión SSH.

Prisma lee el `.env` directamente, así que mientras el `.env` esté correcto, funcionará.

---

## ✅ Formato Correcto de DATABASE_URL con Socket

```
mysql://usuario:contraseña@localhost/nombre_bd?socket=/ruta/al/socket
```

**Ejemplo:**
```
mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/var/lib/mysql/mysql.sock
```

**NO uses:**
- ❌ `localhost:3306` (intenta TCP)
- ❌ `127.0.0.1` (no tiene permisos)
- ❌ `localhost:3306?...socket=...` (formato incorrecto)

---

## 🆘 Si Sigue Fallando

1. **Verifica que el socket existe:**
   ```bash
   ls -la /var/lib/mysql/mysql.sock
   ls -la /tmp/mysql.sock
   ```

2. **Verifica permisos del socket:**
   ```bash
   ls -la /var/lib/mysql/ | grep mysql.sock
   ```

3. **Prueba con el otro socket:**
   ```bash
   # Cambiar a /tmp/mysql.sock en .env
   ```

4. **Verifica que Prisma lee el .env:**
   ```bash
   cat .env | grep DATABASE_URL
   # Debería mostrar la URL con socket
   ```
