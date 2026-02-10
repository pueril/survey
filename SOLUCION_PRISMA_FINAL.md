# 🔧 Solución Final: Prisma y Socket

## 🔍 Diagnóstico

Prisma muestra `localhost:3306` en el error, lo que indica que está ignorando el parámetro `socket` en la URL.

## ✅ Soluciones a Probar (En Orden)

### Solución 1: Verificar Qué Lee Prisma Realmente

```bash
# Ver qué está leyendo Prisma del .env
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL)"
```

Esto te mostrará exactamente qué URL está leyendo Prisma.

### Solución 2: Probar con Variable de Entorno Directa

```bash
# Probar pasando la variable directamente
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/tmp/mysql.sock" npx prisma db push
```

### Solución 3: Formato Sin Host (Solo Socket)

Edita `.env`:

```bash
nano .env
```

Cambia a (sin `localhost` antes del `/`):

```env
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@/eastonde_survey?socket=/tmp/mysql.sock"
```

Luego prueba:
```bash
npx prisma db push
```

### Solución 4: Usar Prisma Migrate en Lugar de db push

Si `db push` no funciona con socket, podemos usar `migrate`:

```bash
# Generar migración
npx prisma migrate dev --name init --create-only

# Esto creará un archivo SQL que puedes ejecutar con mariadb
```

### Solución 5: Ejecutar SQL Directamente con mariadb

Como `mariadb` funciona, podemos crear las tablas manualmente:

```bash
# Crear archivo SQL con el schema
npx prisma migrate dev --create-only --name init

# Esto generará un archivo en prisma/migrations/
# Luego ejecútalo con mariadb
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < prisma/migrations/[fecha]_init/migration.sql
```

---

## 🎯 Comandos Completos para Probar

```bash
# 1. Ver qué lee Prisma
node -e "require('dotenv').config(); console.log('DATABASE_URL:', process.env.DATABASE_URL)"

# 2. Probar con variable directa
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/tmp/mysql.sock" npx prisma db push

# 3. Si falla, probar formato sin host
nano .env
# Cambiar a: DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@/eastonde_survey?socket=/tmp/mysql.sock"
npx prisma db push

# 4. Si nada funciona, generar SQL y ejecutar con mariadb
npx prisma migrate dev --create-only --name init
# Luego encontrar el archivo SQL generado y ejecutarlo
find prisma/migrations -name "*.sql" -type f
```

---

## 🆘 Solución Alternativa: Crear Tablas Manualmente

Si Prisma no puede conectarse, podemos crear las tablas directamente con mariadb usando el schema de Prisma. Pero primero probemos las soluciones anteriores.

---

## 📝 Nota sobre Prisma y Sockets

Algunas versiones de Prisma tienen problemas con sockets en la URL. Si ninguna de las soluciones anteriores funciona, puede ser necesario:
1. Actualizar Prisma a una versión más reciente
2. O usar `migrate` en lugar de `db push`
3. O ejecutar SQL directamente con mariadb
