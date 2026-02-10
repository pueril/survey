# 🌱 Ejecutar Seeder Simplificado

## ✅ Solución: Seeder que Evita deleteMany

He creado un seeder simplificado (`seed-simple.js`) que:
- ✅ NO usa `deleteMany` (que causa el panic)
- ✅ Verifica si los datos ya existen antes de crear
- ✅ Solo crea usuarios y preguntas (lo esencial para iniciar sesión)

### Paso 1: Subir el archivo seed-simple.js

Sube el archivo `seed-simple.js` al servidor en:
```
/home/eastonde/domains/survey.eastondesign.cl/public_html/seed-simple.js
```

### Paso 2: Ejecutar el Seeder

```bash
# Asegúrate de estar en el entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Ejecutar el seeder simplificado
node seed-simple.js
```

### Salida Esperada

Deberías ver:

```
🌱 Starting seed...
✅ Usuario john@doe.com creado
✅ Usuario admin@easton.cl creado
✅ 11 preguntas creadas

📊 Resumen:
👥 Usuarios: 2
❓ Preguntas: 11
🏢 Clientes: 0

🔑 Credenciales de acceso:
Email: john@doe.com | Password: johndoe123
Email: admin@easton.cl | Password: easton2026

✅ Seed completado exitosamente!
```

---

## 🔑 Credenciales

Después de ejecutar el seeder, podrás iniciar sesión con:

- **Email:** `admin@easton.cl`
- **Password:** `easton2026`

O:

- **Email:** `john@doe.com`
- **Password:** `johndoe123`

---

## ✅ Después del Seed

1. **Reinicia la aplicación** en DirectAdmin
2. **Visita:** `https://survey.eastondesign.cl`
3. **Inicia sesión** con las credenciales de arriba

---

## 🆘 Si Hay Errores

Si el seeder da errores, comparte el mensaje completo y lo revisamos.
