# 🔄 Resetear Base de Datos y Cargar Datos (Equivalente a migrate:fresh)

## 🎯 Solución: Scripts SQL para Resetear y Seedear

He creado dos scripts SQL:
1. `reset-database.sql` - Limpia toda la base de datos
2. `seed-data-completo.sql` - Carga datos iniciales con UTF-8 correcto

### Paso 1: Limpiar Base de Datos

```bash
# Ejecutar script de reset
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < reset-database.sql
```

Esto eliminará todos los datos de todas las tablas.

### Paso 2: Cargar Datos Iniciales

```bash
# Ejecutar script de seed (con UTF-8 configurado)
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < seed-data-completo.sql
```

Esto creará los usuarios y preguntas con caracteres UTF-8 correctos.

---

## 🎯 Comando Combinado (Equivalente a migrate:fresh)

Puedes ejecutar ambos scripts en un solo comando:

```bash
# Resetear y seedear en un solo paso
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < reset-database.sql && mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < seed-data-completo.sql
```

---

## ✅ Verificación

Después de ejecutar los scripts:

```bash
# Verificar usuarios
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT email, name FROM User;"

# Verificar preguntas
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT COUNT(*) as total FROM Question;"

# Verificar que los caracteres especiales están correctos
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey -e "SELECT text FROM Question LIMIT 1;"
```

---

## 📋 Archivos Creados

- `reset-database.sql` - Limpia todas las tablas
- `seed-data-completo.sql` - Carga datos con UTF-8 correcto

---

## 🔄 Para Futuras Limpiezas

Cada vez que quieras resetear la base de datos:

```bash
# Opción 1: Scripts separados
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < reset-database.sql
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < seed-data-completo.sql

# Opción 2: Todo en uno
mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < reset-database.sql && mariadb -u eastonde_survey -pPKTQWPqpmttpgnq3hSqq eastonde_survey < seed-data-completo.sql
```
