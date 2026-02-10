# 🌱 Ejecutar Seeder para Datos Iniciales

## ✅ Estado Actual

- ✅ Base de datos creada
- ✅ Tablas creadas
- ❌ Sin datos (usuarios, preguntas, etc.)

## 🎯 Solución: Ejecutar el Seeder

El seeder creará:
- 👥 2 usuarios administradores
- ❓ 11 preguntas de la encuesta
- 🏢 4 clientes de prueba
- 📝 3 respuestas de encuestas de ejemplo

### Comando para Ejecutar

```bash
# Asegúrate de estar en el entorno virtual
source /home/eastonde/nodevenv/domains/survey.eastondesign.cl/public_html/24/bin/activate && cd /home/eastonde/domains/survey.eastondesign.cl/public_html

# Ejecutar el seeder
npx tsx --require dotenv/config scripts/seed.ts
```

### Salida Esperada

Deberías ver algo como:

```
🌱 Starting seed...
✅ Usuarios administradores creados
✅ 11 preguntas optimizadas creadas
✅ Clientes creados
✅ Respuestas de encuestas creadas

📊 Resumen de datos creados:
👥 Usuarios: 2
❓ Preguntas: 11
🏢 Clientes: 4
📝 Encuestas completadas: 3
⏳ Encuestas pendientes: 1

🔑 Credenciales de acceso:
Email: john@doe.com | Password: johndoe123
Email: admin@easton.cl | Password: easton2026
```

---

## 🔧 Si tsx No Está Disponible

Si `tsx` no está instalado o da error, puedes:

### Opción 1: Instalar tsx

```bash
npm install tsx --legacy-peer-deps
```

Luego ejecutar:
```bash
npx tsx --require dotenv/config scripts/seed.ts
```

### Opción 2: Compilar y Ejecutar con node

```bash
# Compilar TypeScript
npx tsc scripts/seed.ts --outDir scripts/dist --esModuleInterop --module commonjs --target es2020

# Ejecutar
node scripts/dist/seed.js
```

### Opción 3: Ejecutar SQL Directamente

Si nada funciona, puedo generar un script SQL que puedas ejecutar con mariadb directamente.

---

## ✅ Después del Seeder

Una vez que el seeder termine exitosamente:

1. **Reinicia la aplicación** en DirectAdmin
2. **Visita:** `https://survey.eastondesign.cl`
3. **Inicia sesión** con:
   - Email: `admin@easton.cl`
   - Password: `easton2026`

---

## 🆘 Si Hay Errores

Si el seeder da errores, comparte el mensaje completo y lo revisamos.
