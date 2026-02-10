#!/bin/bash
# Script de instalación para DirectAdmin
# Ejecuta npm install con --legacy-peer-deps

echo "🔧 Instalando dependencias con --legacy-peer-deps..."
npm install --legacy-peer-deps --production

echo "📦 Generando cliente de Prisma..."
npx prisma generate

echo "✅ Instalación completada exitosamente!"
