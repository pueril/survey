# 🔧 Solución: Error de Conexión a Base de Datos

## ❌ Problema

Prisma no puede conectarse a la base de datos en `localhost:3306`, aunque la base de datos existe.

## ✅ Soluciones a Probar

### Paso 1: Verificar el Archivo .env

```bash
# Ver el contenido del archivo .env
cat .env | grep DATABASE_URL
```

Debería mostrar algo como:
```
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost:3306/eastonde_survey"
```

### Paso 2: Probar Diferentes Formatos de Conexión

En hosting compartido, MySQL puede estar en diferentes ubicaciones. Prueba estos formatos:

#### Opción A: Usar 127.0.0.1 en lugar de localhost

Edita el archivo `.env`:

```bash
# Editar .env
nano .env
# O usar vi
vi .env
```

Cambia `localhost` por `127.0.0.1`:
```
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@127.0.0.1:3306/eastonde_survey"
```

#### Opción B: Usar Socket de MySQL (Común en Hosting Compartido)

En hosting compartido, MySQL a menudo usa un socket en lugar de TCP. Prueba:

```
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/var/lib/mysql/mysql.sock"
```

O busca el socket en tu servidor:
```bash
# Buscar el socket de MySQL
find /var -name mysql.sock 2>/dev/null
find /tmp -name mysql.sock 2>/dev/null
find /run -name mysql.sock 2>/dev/null
```

#### Opción C: Usar el Host del Servidor MySQL

Si tu hosting tiene un host específico para MySQL (como `mysql.tu-dominio.com` o una IP), úsalo:

```
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@mysql-host:3306/eastonde_survey"
```

### Paso 3: Verificar Conexión con MySQL Directamente

Prueba conectarte a MySQL directamente desde SSH:

```bash
# Probar conexión con localhost
mysql -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq -h localhost eastonde_survey -e "SELECT 1;"

# Si falla, probar con 127.0.0.1
mysql -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq -h 127.0.0.1 eastonde_survey -e "SELECT 1;"

# Si falla, probar sin especificar host (usa socket)
mysql -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT 1;"
```

### Paso 4: Buscar Información de Conexión en DirectAdmin

1. Ve a DirectAdmin
2. Entra a **"Base de Datos"** o **"MySQL Databases"**
3. Busca la base de datos `eastonde_survey`
4. Verifica:
   - **Host** (puede ser `localhost`, `127.0.0.1`, o un host específico)
   - **Puerto** (puede ser 3306 u otro)
   - **Socket** (si está disponible)

### Paso 5: Actualizar .env con la Información Correcta

Una vez que sepas el host correcto, actualiza el `.env`:

```bash
# Editar .env
nano .env
```

Actualiza `DATABASE_URL` con la información correcta.

### Paso 6: Probar Prisma Nuevamente

```bash
# Probar conexión con Prisma
npx prisma db push
```

---

## 🎯 Comandos Rápidos para Diagnosticar

```bash
# 1. Ver .env actual
cat .env | grep DATABASE_URL

# 2. Probar conexión MySQL directa
mysql -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq -h localhost eastonde_survey -e "SELECT 1;" 2>&1

# 3. Buscar socket de MySQL
find /var /tmp /run -name mysql.sock 2>/dev/null

# 4. Ver procesos MySQL
ps aux | grep mysql

# 5. Ver puertos abiertos
netstat -tlnp | grep 3306 2>/dev/null || ss -tlnp | grep 3306
```

---

## 🔍 Formato Correcto de DATABASE_URL

El formato general es:
```
DATABASE_URL="mysql://usuario:contraseña@host:puerto/nombre_base_datos"
```

O con socket:
```
DATABASE_URL="mysql://usuario:contraseña@localhost/nombre_base_datos?socket=/ruta/al/socket"
```

---

## 🆘 Si Nada Funciona

1. **Contacta al soporte de tu hosting** y pregunta:
   - ¿Cuál es el host correcto para MySQL?
   - ¿Hay un socket específico que deba usar?
   - ¿Hay alguna configuración especial para conexiones desde Node.js?

2. **Verifica en DirectAdmin** la información exacta de la base de datos

3. **Prueba con phpMyAdmin** (si está disponible) para verificar que la conexión funciona desde el servidor
