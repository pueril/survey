# 🌱 Ejecutar Seed con SQL Directo

## ❌ Problema

El seeder de Prisma falla con un error de panic. Esto puede ser un problema de compatibilidad entre Prisma 6.7.0 y Node.js 24.6.0.

## ✅ Solución: Ejecutar SQL Directamente

He creado un archivo `seed.sql` que puedes ejecutar directamente con `mariadb`.

### Paso 1: Subir el archivo seed.sql

Sube el archivo `seed.sql` al servidor en:
```
/home/eastonde/domains/survey.eastondesign.cl/public_html/seed.sql
```

### Paso 2: Ejecutar el SQL

```bash
# Ejecutar el script SQL
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < seed.sql
```

### Paso 3: Verificar que se Crearon los Datos

```bash
# Verificar usuarios
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT email, name FROM User;"

# Verificar preguntas
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT COUNT(*) as total_preguntas FROM Question;"

# Verificar clientes
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT COUNT(*) as total_clientes FROM Client;"
```

---

## 🔑 Credenciales Creadas

Después de ejecutar el SQL, podrás iniciar sesión con:

- **Email:** `admin@easton.cl`
- **Password:** `easton2026`

O:

- **Email:** `john@doe.com`
- **Password:** `johndoe123`

---

## 📋 Contenido del Seed SQL

El script crea:
- ✅ 2 usuarios administradores
- ✅ 11 preguntas de la encuesta
- ✅ 4 clientes de prueba
- ✅ 3 respuestas de encuestas de ejemplo

---

## 🆘 Si Hay Errores

Si el SQL da errores de duplicados, puedes comentar las líneas que limpian datos o usar `INSERT IGNORE` en lugar de `INSERT`.

---

## ✅ Después del Seed

1. **Reinicia la aplicación** en DirectAdmin
2. **Visita:** `https://survey.eastondesign.cl`
3. **Inicia sesión** con las credenciales de arriba
