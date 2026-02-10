# ✅ Checklist de Despliegue - Easton Surveys

## Pre-Despliegue

### Servidor y Software
- [ ] Node.js 18.x+ instalado (`node -v`)
- [ ] MariaDB 10.5+ o MySQL 8.0+ instalado (`mysql --version`)
- [ ] npm o yarn instalado (`npm -v` o `yarn -v`)
- [ ] Git instalado (opcional) (`git --version`)
- [ ] Nginx instalado (recomendado) (`nginx -v`)
- [ ] Certbot instalado para SSL (recomendado)

### Base de Datos
- [ ] Base de datos `easton_surveys` creada
- [ ] Usuario `easton_user` creado con contraseña segura
- [ ] Permisos otorgados al usuario
- [ ] Conexión a la base de datos verificada
- [ ] MariaDB configurado para iniciar en el arranque

---

## Instalación

### Archivos
- [ ] Código fuente subido al servidor
- [ ] Permisos de archivos configurados correctamente
- [ ] Directorio en ubicación apropiada (ej: `/var/www/easton-surveys`)

### Variables de Entorno
- [ ] Archivo `.env` creado desde `.env.example`
- [ ] `DATABASE_URL` configurada correctamente
  - Formato: `mysql://usuario:contraseña@host:puerto/base_datos`
- [ ] `NEXTAUTH_SECRET` generado con `openssl rand -base64 32`
- [ ] `NEXTAUTH_URL` configurado con dominio público
- [ ] `NODE_ENV=production` configurado

### Dependencias
- [ ] `npm install` o `yarn install` ejecutado sin errores
- [ ] Todas las dependencias instaladas correctamente
- [ ] No hay vulnerabilidades críticas (`npm audit`)

---

## Base de Datos

### Prisma
- [ ] `npx prisma generate` ejecutado correctamente
- [ ] Cliente Prisma generado en `node_modules/.prisma/client`
- [ ] `npx prisma db push` ejecutado sin errores
- [ ] Todas las 7 tablas creadas:
  - [ ] Account
  - [ ] Client
  - [ ] Question
  - [ ] Session
  - [ ] SurveyResponse
  - [ ] User
  - [ ] VerificationToken

### Datos Iniciales
- [ ] `npm run prisma:seed` ejecutado correctamente
- [ ] Usuario admin creado: `admin@easton.cl`
- [ ] Usuario de prueba creado: `john@doe.com`
- [ ] 11 preguntas creadas
- [ ] 4 clientes de prueba creados (opcional)

### Verificación de BD
- [ ] Tablas verificadas con `SHOW TABLES;`
- [ ] Usuario admin existe: `SELECT * FROM User WHERE email='admin@easton.cl';`
- [ ] Preguntas activas: `SELECT COUNT(*) FROM Question WHERE active=true;` (debe ser 11)

---

## Construcción

### Build
- [ ] `npm run build` ejecutado sin errores
- [ ] Directorio `.next` creado
- [ ] Build completado exitosamente
- [ ] No hay errores de TypeScript
- [ ] No hay errores de compilación

### Verificación del Build
- [ ] Tamaño del build razonable (< 100MB)
- [ ] Archivos estáticos generados en `.next/static`
- [ ] Páginas generadas en `.next/server`

---

## Ejecución

### Proceso de Aplicación
**Opción A - PM2 (Recomendado):**
- [ ] PM2 instalado globalmente (`npm install -g pm2`)
- [ ] Aplicación iniciada con PM2
- [ ] PM2 configurado para auto-inicio (`pm2 startup`)
- [ ] Configuración guardada (`pm2 save`)
- [ ] Estado verificado (`pm2 status`)
- [ ] Logs accesibles (`pm2 logs`)

**Opción B - systemd:**
- [ ] Servicio systemd creado en `/etc/systemd/system/`
- [ ] Servicio habilitado (`systemctl enable`)
- [ ] Servicio iniciado (`systemctl start`)
- [ ] Estado verificado (`systemctl status`)

### Verificación de Ejecución
- [ ] Aplicación corriendo en puerto 3000
- [ ] Puerto 3000 escuchando (`netstat -tlnp | grep 3000`)
- [ ] No hay errores en logs
- [ ] Aplicación responde en `http://localhost:3000`

---

## Servidor Web (Nginx)

### Configuración
- [ ] Nginx instalado y corriendo
- [ ] Configuración de sitio creada en `/etc/nginx/sites-available/`
- [ ] Enlace simbólico creado en `/etc/nginx/sites-enabled/`
- [ ] Configuración probada (`nginx -t`)
- [ ] Nginx reiniciado
- [ ] Proxy reverso funcionando correctamente

### SSL/HTTPS
- [ ] Certbot instalado
- [ ] Certificado SSL obtenido con Let's Encrypt
- [ ] HTTPS funcionando
- [ ] Redirección HTTP → HTTPS configurada
- [ ] Renovación automática configurada

### DNS
- [ ] Registro A apuntando al servidor
- [ ] Registro AAAA configurado (si usa IPv6)
- [ ] DNS propagado (verifica con `dig tu-dominio.com`)

---

## Seguridad

### Firewall
- [ ] UFW o firewall configurado
- [ ] Puerto 22 (SSH) permitido
- [ ] Puerto 80 (HTTP) permitido
- [ ] Puerto 443 (HTTPS) permitido
- [ ] Puerto 3306 (MySQL) bloqueado externamente
- [ ] Firewall habilitado

### Base de Datos
- [ ] `mysql_secure_installation` ejecutado
- [ ] Contraseña root cambiada
- [ ] Usuarios anónimos eliminados
- [ ] Login remoto de root deshabilitado
- [ ] Base de datos de prueba eliminada

### Aplicación
- [ ] Contraseñas de admin cambiadas de valores por defecto
- [ ] `NEXTAUTH_SECRET` único y seguro
- [ ] Variables de entorno protegidas (`.env` no en git)
- [ ] Permisos de archivos correctos

---

## Pruebas Post-Despliegue

### Funcionalidad Básica
- [ ] Página de inicio carga (`https://tu-dominio.com`)
- [ ] Login funciona con `admin@easton.cl` / `easton2026`
- [ ] Dashboard se muestra correctamente
- [ ] No hay errores en la consola del navegador

### Panel de Administración
- [ ] Crear cliente funciona
- [ ] Link de encuesta se genera
- [ ] Editar cliente funciona
- [ ] Eliminar cliente funciona
- [ ] Gestión de preguntas funciona
- [ ] Exportación a Excel funciona

### Encuesta Pública
- [ ] Link de encuesta abre correctamente
- [ ] Barra de progreso funciona
- [ ] Todas las preguntas se muestran
- [ ] Validación de campos requeridos funciona
- [ ] Envío de encuesta funciona
- [ ] Página de agradecimiento se muestra

### Estadísticas
- [ ] Dashboard de estadísticas carga
- [ ] Gráficos se muestran correctamente
- [ ] Métricas calculan correctamente
- [ ] Filtros funcionan (si aplica)

### Datos
- [ ] Respuestas se guardan en la base de datos
- [ ] Datos se muestran correctamente en el admin
- [ ] Exportación incluye todas las respuestas

---

## Rendimiento

### Optimización
- [ ] Archivos estáticos comprimidos (gzip)
- [ ] Imágenes optimizadas
- [ ] Caché del navegador configurado
- [ ] Tiempo de carga < 3 segundos

### Monitoreo
- [ ] Logs configurados y rotando
- [ ] Monitoreo de recursos configurado (opcional)
- [ ] Alertas configuradas (opcional)

---

## Backup y Recuperación
### Backup
- [ ] Script de backup de BD creado
- [ ] Backup automático configurado (cron)
- [ ] Backup de archivos configurado
- [ ] Ubicación de backup segura
- [ ] Primer backup manual exitoso

### Procedimiento de Recuperación
- [ ] Procedimiento de restauración documentado
- [ ] Restauración probada (en ambiente de pruebas)

---

## Documentación

### Interna
- [ ] Credenciales documentadas de forma segura
- [ ] Procedimientos de mantenimiento documentados
- [ ] Contactos de soporte documentados
- [ ] Información del servidor documentada

### Para el Cliente
- [ ] Manual de usuario creado (si aplica)
- [ ] Credenciales entregadas de forma segura
- [ ] Capacitación realizada (si aplica)

---

## Finalización

### Entrega
- [ ] Cliente notificado del despliegue
- [ ] Acceso proporcionado
- [ ] Pruebas de aceptación completadas
- [ ] Feedback del cliente recibido

### Post-Despliegue
- [ ] Monitoreo activo por 48 horas
- [ ] Errores iniciales corregidos
- [ ] Sistema estable
- [ ] Documentación actualizada con cambios

---

## 🚨 En Caso de Problemas

### Recursos de Ayuda
1. [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Sección Troubleshooting
2. Logs de la aplicación: `pm2 logs` o `journalctl`
3. Logs de Nginx: `/var/log/nginx/error.log`
4. Logs de MariaDB: `/var/log/mysql/error.log`

### Comandos Útiles
```bash
# Verificar estado de servicios
sudo systemctl status nginx
sudo systemctl status mariadb
pm2 status

# Ver logs en tiempo real
pm2 logs easton-surveys --lines 100
sudo tail -f /var/log/nginx/error.log

# Reiniciar servicios
pm2 restart easton-surveys
sudo systemctl restart nginx
sudo systemctl restart mariadb
```

---

## ✅ Despliegue Completado

**Fecha de despliegue**: _______________

**Realizado por**: _______________

**URL de producción**: _______________

**Notas adicionales**: 

_______________________________________________________________

_______________________________________________________________

_______________________________________________________________


**Firma**: _______________
