#!/bin/bash

# Easton Surveys - Script de Despliegue Automatizado
# Este script automatiza el proceso de despliegue

set -e

echo "🚀 Easton Surveys - Despliegue Automatizado"
echo "==========================================="
echo ""

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Funciones de ayuda
success() {
    echo -e "${GREEN}✅ $1${NC}"
}

warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

error() {
    echo -e "${RED}❌ $1${NC}"
    exit 1
}

# 1. Verificar Node.js
echo "📋 Verificando requisitos..."
if ! command -v node &> /dev/null; then
    error "Node.js no está instalado. Instalar con: curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash - && sudo apt-get install -y nodejs"
fi
success "Node.js instalado: $(node -v)"

# 2. Verificar npm
if ! command -v npm &> /dev/null; then
    error "npm no está instalado"
fi
success "npm instalado: $(npm -v)"

# 3. Verificar MySQL/MariaDB
if ! command -v mysql &> /dev/null; then
    error "MySQL/MariaDB no está instalado. Instalar con: sudo apt install mariadb-server"
fi
success "MySQL/MariaDB instalado"

# 4. Verificar archivo .env
if [ ! -f .env ]; then
    warning "Archivo .env no encontrado"
    echo "Creando .env desde .env.example..."
    cp .env.example .env
    warning "⚠️  IMPORTANTE: Edita el archivo .env con tus credenciales reales"
    warning "nano .env"
    exit 1
fi
success "Archivo .env encontrado"

# 5. Instalar dependencias
echo ""
echo "📦 Instalando dependencias..."
npm install || error "Error al instalar dependencias"
success "Dependencias instaladas"

# 6. Generar cliente Prisma
echo ""
echo "🔧 Generando cliente Prisma..."
npx prisma generate || error "Error al generar cliente Prisma"
success "Cliente Prisma generado"

# 7. Crear tablas en la base de datos
echo ""
echo "🗄️  Creando tablas en la base de datos..."
npx prisma db push || error "Error al crear tablas. Verifica DATABASE_URL en .env"
success "Tablas creadas"

# 8. Cargar datos iniciales
echo ""
echo "🌱 Cargando datos iniciales..."
npm run prisma:seed || warning "Error al cargar datos iniciales. Puede que ya existan."
success "Datos iniciales cargados"

# 9. Construir aplicación
echo ""
echo "🏗️  Construyendo aplicación..."
npm run build || error "Error al construir aplicación"
success "Aplicación construida"

# 10. Verificar PM2
echo ""
if command -v pm2 &> /dev/null; then
    success "PM2 instalado"
    
    echo "¿Deseas iniciar la aplicación con PM2? (s/n)"
    read -r response
    if [[ "$response" =~ ^([sS][iI]|[sS])$ ]]; then
        echo "Iniciando aplicación con PM2..."
        pm2 start npm --name "easton-surveys" -- start || warning "Ya existe una instancia corriendo"
        pm2 save
        success "Aplicación iniciada con PM2"
        pm2 status
    fi
else
    warning "PM2 no está instalado. Instalar con: npm install -g pm2"
    echo "Puedes iniciar la aplicación manualmente con: npm start"
fi

echo ""
echo "========================================="
echo "🎉 Despliegue completado exitosamente!"
echo "========================================="
echo ""
echo "📝 Próximos pasos:"
echo "1. Verifica que la aplicación esté corriendo: pm2 status"
echo "2. Accede a http://localhost:3000"
echo "3. Login con: admin@easton.cl / easton2026"
echo "4. Configura Nginx para producción (ver DEPLOYMENT_GUIDE.md)"
echo ""
