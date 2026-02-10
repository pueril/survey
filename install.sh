#!/bin/bash
# Script de instalación para DirectAdmin
# Este script instala las dependencias con --legacy-peer-deps

echo "🔧 Instalando dependencias..."
npm install --legacy-peer-deps --production

echo "📦 Generando cliente de Prisma..."
npx prisma generate

echo "✅ Instalación completada!"
