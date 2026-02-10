@echo off
REM Script de instalación para Windows (para probar localmente antes de subir)
echo Instalando dependencias...
call npm install --legacy-peer-deps --production
echo Generando cliente de Prisma...
call npx prisma generate
echo Instalacion completada!
pause
