# 🌱 Ejecutar Seed con SQL Directo (Solución Final)

## ✅ Solución: Usar SQL Directo con mariadb

Como Prisma tiene problemas de compatibilidad con Node.js 24.6.0, usaremos SQL directo con `mariadb` que sabemos que funciona perfectamente.

### Paso 1: Subir el archivo seed-data.sql

Sube el archivo `seed-data.sql` al servidor en:
```
/home/eastonde/domains/survey.eastondesign.cl/public_html/seed-data.sql
```

### Paso 2: Ejecutar el SQL

```bash
# Ejecutar el script SQL directamente con mariadb
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < seed-data.sql
```

### Paso 3: Verificar que se Crearon los Datos

```bash
# Verificar usuarios creados
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT email, name FROM User;"

# Verificar preguntas creadas
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT COUNT(*) as total_preguntas FROM Question;"

# Debería mostrar: total_preguntas = 11
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
- ✅ 2 usuarios administradores (con contraseñas hasheadas correctamente)
- ✅ 11 preguntas de la encuesta

---

## ✅ Después del Seed

1. **Reinicia la aplicación** en DirectAdmin
2. **Visita:** `https://survey.eastondesign.cl`
3. **Inicia sesión** con las credenciales de arriba

---

## 🆘 Si Hay Errores de Duplicados

Si el SQL da errores de duplicados (porque los datos ya existen), puedes:

1. **Eliminar datos existentes primero:**
   ```bash
   mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "DELETE FROM SurveyResponse; DELETE FROM Client; DELETE FROM Question; DELETE FROM User;"
   ```

2. **Luego ejecutar el seed:**
   ```bash
   mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < seed-data.sql
   ```

---

## ✅ Comandos Completos

```bash
# 1. Ejecutar seed SQL
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < seed-data.sql

# 2. Verificar usuarios
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT email, name FROM User;"

# 3. Verificar preguntas
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT COUNT(*) FROM Question;"
```
