# 🔧 Solución para Error de npm install en DirectAdmin

## ❌ Error que estás viendo:
```
npm error ERESOLVE unable to resolve dependency tree
```

## ✅ Solución

He creado un archivo `.npmrc` que resuelve este problema automáticamente.

### Paso 1: Subir el archivo `.npmrc`

**IMPORTANTE:** Sube el archivo `.npmrc` que acabo de crear a tu servidor en:
```
/home/eastonde/domains/survey.eastondesign.cl/public_html/.npmrc
```

Este archivo le dice a npm que use `--legacy-peer-deps` automáticamente.

### Paso 2: Ejecutar npm install nuevamente

**Opción A: Desde DirectAdmin**
- Ve a tu aplicación Node.js
- Busca la opción "Run Command" o "Execute Command"
- Ejecuta: `npm install --production`

**Opción B: Por SSH**
```bash
cd /home/eastonde/domains/survey.eastondesign.cl/public_html
npm install --production
npx prisma generate
```

### Paso 3: Verificar instalación

Después de que termine `npm install`, deberías ver:
- ✅ Carpeta `node_modules/` creada
- ✅ Sin errores de dependencias

---

## 📋 Archivos que debes subir (actualizado)

Asegúrate de subir también el archivo `.npmrc`:

```
✅ .npmrc              (NUEVO - importante para resolver el error)
✅ app/
✅ components/
✅ lib/
✅ prisma/
✅ public/
✅ hooks/
✅ .next/
✅ package.json
✅ package-lock.json
✅ next.config.js
✅ tailwind.config.ts
✅ tsconfig.json
✅ postcss.config.js
✅ server.js
✅ .env
```

---

## 🔄 Si DirectAdmin sigue dando error

Si DirectAdmin sigue ejecutando `npm install` sin el flag, puedes:

1. **Ignorar el error de DirectAdmin** y ejecutar manualmente por SSH:
   ```bash
   cd /home/eastonde/domains/survey.eastondesign.cl/public_html
   npm install --production --legacy-peer-deps
   npx prisma generate
   ```

2. **O modificar el package.json** para agregar un script de instalación (pero esto es más complejo)

---

## ✅ Después de instalar

Una vez que `npm install` termine correctamente:

1. **Generar Prisma Client:**
   ```bash
   npx prisma generate
   ```

2. **Configurar Base de Datos:**
   ```bash
   npx prisma db push
   ```

3. **Iniciar la aplicación** desde DirectAdmin

---

## 🎯 Resumen Rápido

1. ✅ Sube el archivo `.npmrc` al servidor
2. ✅ Ejecuta `npm install --production` (ahora funcionará sin errores)
3. ✅ Ejecuta `npx prisma generate`
4. ✅ Ejecuta `npx prisma db push`
5. ✅ Inicia la app desde DirectAdmin
