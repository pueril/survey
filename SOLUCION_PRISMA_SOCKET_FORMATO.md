# 🔧 Solución: Prisma Ignora el Socket

## ❌ Problema

Prisma lee el `.env` pero ignora el socket y sigue intentando `localhost:3306`, causando error de autenticación.

## ✅ Soluciones a Probar

### Solución 1: Usar Variable de Entorno Directa

En lugar de confiar en que Prisma lea el `.env` correctamente, pasa la variable directamente:

```bash
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/tmp/mysql.sock" npx prisma db push
```

### Solución 2: Verificar que No Hay Otro .env

Puede haber múltiples archivos `.env` o configuración que sobrescribe:

```bash
# Buscar todos los archivos .env
find . -name ".env*" -type f

# Ver contenido de cada uno
cat .env
cat .env.local 2>/dev/null || echo "No existe .env.local"
cat .env.production 2>/dev/null || echo "No existe .env.production"
```

### Solución 3: Usar Formato Alternativo de Socket

Prisma puede requerir un formato diferente. Prueba:

```bash
# Editar .env
nano .env
```

**Opción A: Sin especificar host (solo socket)**
```env
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@/eastonde_survey?socket=/tmp/mysql.sock"
```

**Opción B: Usar file:// para socket (formato alternativo)**
```env
DATABASE_URL="file:/tmp/mysql.sock?user=eastonde_survey&password=PKTQWPqpmttpgnq3hSqq&database=eastonde_survey"
```

**Opción C: Formato con protocolo explícito**
```env
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?protocol=socket&socket=/tmp/mysql.sock"
```

### Solución 4: Verificar Schema.prisma

El `schema.prisma` puede estar forzando el formato. Verifica:

```bash
cat prisma/schema.prisma | grep -A 3 datasource
```

### Solución 5: Crear Usuario con Permisos TCP (Última Opción)

Si nada funciona, puede ser que el usuario solo tenga permisos para socket pero no TCP. En ese caso, necesitarías contactar al administrador de la BD para dar permisos TCP, o crear un script que use mariadb directamente.

---

## 🎯 Comandos para Probar

```bash
# 1. Verificar schema.prisma
cat prisma/schema.prisma | grep -A 5 datasource

# 2. Buscar todos los .env
find . -name ".env*" -type f

# 3. Probar con variable directa
DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@localhost/eastonde_survey?socket=/tmp/mysql.sock" npx prisma db push

# 4. Si falla, probar formato alternativo
nano .env
# Cambiar a: DATABASE_URL="mysql://eastonde_survey:PKTQWPqpmttpgnq3hSqq@/eastonde_survey?socket=/tmp/mysql.sock"
npx prisma db push
```

---

## 🔍 Diagnóstico Adicional

```bash
# Ver qué está leyendo Prisma realmente
npx prisma db push --schema=./prisma/schema.prisma --skip-generate 2>&1 | head -20

# Ver variables de entorno que Prisma puede ver
node -e "require('dotenv').config(); console.log(process.env.DATABASE_URL)"
```

---

## 🆘 Solución Alternativa: Usar mariadb Directamente

Si Prisma no puede conectarse con socket, podemos ejecutar las migraciones SQL directamente con mariadb:

```bash
# Generar el SQL de las migraciones
npx prisma migrate dev --create-only --name init

# Luego ejecutar el SQL con mariadb
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < prisma/migrations/.../migration.sql
```

Pero primero probemos las soluciones anteriores.
