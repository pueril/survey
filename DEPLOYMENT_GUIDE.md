# Guía de Despliegue - Easton Design Survey App

## 📋 Requisitos del Servidor

### Software Necesario
- **Node.js**: v18.x o superior
- **MariaDB**: v10.5 o superior (o MySQL 8.0+)
- **npm** o **yarn**: Gestor de paquetes
- **PM2**: (Opcional) Para gestión de procesos

### Recursos Mínimos Recomendados
- **CPU**: 1 core
- **RAM**: 1GB mínimo, 2GB recomendado
- **Almacenamiento**: 500MB para la aplicación

---

## 🗄️ Configuración de la Base de Datos

### 1. Crear la Base de Datos

Conéctate a tu servidor MariaDB:

```bash
mysql -u root -p
```

Crea la base de datos y el usuario:

```sql
-- Crear base de datos
CREATE DATABASE easton_surveys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Crear usuario (cambia 'tu_contraseña' por una contraseña segura)
CREATE USER 'easton_user'@'localhost' IDENTIFIED BY 'tu_contraseña';

-- Otorgar permisos
GRANT ALL PRIVILEGES ON easton_surveys.* TO 'easton_user'@'localhost';
FLUSH PRIVILEGES;

-- Verificar
SHOW DATABASES;
SHOW GRANTS FOR 'easton_user'@'localhost';

EXIT;
```

### 2. Verificar Conexión

```bash
mysql -u easton_user -p easton_surveys
```

---

## 📦 Instalación de la Aplicación

### 1. Subir Archivos al Servidor

Transfiere todos los archivos del proyecto a tu servidor (vía FTP, SFTP, rsync, etc.):

```bash
# Ejemplo con rsync (desde tu máquina local)
rsync -avz --exclude='node_modules' ./ usuario@tu-servidor.com:/var/www/easton-surveys/
```

### 2. Instalar Dependencias

En el servidor, navega al directorio del proyecto:

```bash
cd /var/www/easton-surveys

# Instalar dependencias
npm install
# o con yarn
yarn install
```

### 3. Configurar Variables de Entorno

Copia el archivo de ejemplo y edítalo:

```bash
cp .env.example .env
nano .env  # o usa tu editor preferido
```

Configura las siguientes variables:

```env
# Base de Datos
DATABASE_URL="mysql://easton_user:tu_contraseña@localhost:3306/easton_surveys"

# Autenticación
NEXTAUTH_SECRET="tu_secret_generado"  # Genera con: openssl rand -base64 32
NEXTAUTH_URL="https://tu-dominio.com"  # URL pública de tu app

# Entorno
NODE_ENV="production"
```

**⚠️ IMPORTANTE**: Para generar `NEXTAUTH_SECRET`:

```bash
openssl rand -base64 32
```

### 4. Ejecutar Migraciones de Prisma

Genera el cliente de Prisma y crea las tablas:

```bash
# Generar cliente Prisma
npx prisma generate

# Crear tablas en la base de datos
npx prisma db push

# Verificar que las tablas se crearon
mysql -u easton_user -p easton_surveys -e "SHOW TABLES;"
```

**Resultado esperado:**
```
+---------------------------+
| Tables_in_easton_surveys  |
+---------------------------+
| Account                   |
| Client                    |
| Question                  |
| Session                   |
| SurveyResponse            |
| User                      |
| VerificationToken         |
+---------------------------+
```

### 5. Poblar la Base de Datos (Seed)

Carga los datos iniciales (usuario admin, preguntas):

```bash
npm run prisma:seed
# o con yarn
yarn prisma:seed
```

Esto creará:
- ✅ Usuario administrador: `admin@easton.cl` / `easton2026`
- ✅ Usuario de prueba: `john@doe.com` / `johndoe123`
- ✅ 11 preguntas de la encuesta
- ✅ 4 clientes de ejemplo

### 6. Construir la Aplicación

```bash
npm run build
# o con yarn
yarn build
```

---

## 🚀 Opciones de Despliegue

### Opción A: Usando PM2 (Recomendado)

PM2 mantiene tu aplicación corriendo y la reinicia automáticamente si falla.

#### Instalar PM2

```bash
npm install -g pm2
```

#### Configurar y Iniciar

```bash
# Iniciar la aplicación
pm2 start npm --name "easton-surveys" -- start

# Configurar PM2 para iniciar al arrancar el servidor
pm2 startup
pm2 save

# Ver logs
pm2 logs easton-surveys

# Ver estado
pm2 status

# Reiniciar
pm2 restart easton-surveys

# Detener
pm2 stop easton-surveys
```

### Opción B: Usando systemd

Crea un servicio systemd:

```bash
sudo nano /etc/systemd/system/easton-surveys.service
```

Contenido:

```ini
[Unit]
Description=Easton Design Survey Application
After=network.target mariadb.service

[Service]
Type=simple
User=www-data
WorkingDirectory=/var/www/easton-surveys
Environment="NODE_ENV=production"
ExecStart=/usr/bin/npm start
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
```

Habilitar e iniciar:

```bash
sudo systemctl daemon-reload
sudo systemctl enable easton-surveys
sudo systemctl start easton-surveys
sudo systemctl status easton-surveys
```

### Opción C: Servidor Simple (Solo para pruebas)

```bash
npm start
# La aplicación estará disponible en http://localhost:3000
```

---

## 🌐 Configuración del Servidor Web (Nginx)

### 1. Instalar Nginx

```bash
sudo apt update
sudo apt install nginx
```

### 2. Configurar Reverse Proxy

Crea la configuración:

```bash
sudo nano /etc/nginx/sites-available/easton-surveys
```

Contenido:

```nginx
server {
    listen 80;
    server_name tu-dominio.com www.tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
```

Habilitar la configuración:

```bash
sudo ln -s /etc/nginx/sites-available/easton-surveys /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

### 3. Configurar SSL con Let's Encrypt (Recomendado)

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com -d www.tu-dominio.com
```

Let's Encrypt configurará automáticamente SSL y renovará los certificados.

---

## 🔒 Seguridad

### 1. Firewall

```bash
# Permitir solo puertos necesarios
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
```

### 2. Proteger MySQL/MariaDB

```bash
sudo mysql_secure_installation
```

Responde "Sí" a todas las preguntas de seguridad.

### 3. Actualizar el Sistema

```bash
sudo apt update
sudo apt upgrade
```

---

## 📝 Mantenimiento

### Ver Logs

```bash
# Con PM2
pm2 logs easton-surveys

# Con systemd
sudo journalctl -u easton-surveys -f

# Logs de Nginx
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

### Backup de la Base de Datos

```bash
# Crear backup
mysqldump -u easton_user -p easton_surveys > backup_$(date +%Y%m%d_%H%M%S).sql

# Restaurar backup
mysql -u easton_user -p easton_surveys < backup_20240127_120000.sql
```

### Actualizar la Aplicación

```bash
cd /var/www/easton-surveys

# Backup de archivos actuales
tar -czf backup_app_$(date +%Y%m%d).tar.gz .

# Subir nuevos archivos
# ...

# Instalar dependencias nuevas (si las hay)
npm install

# Reconstruir
npm run build

# Ejecutar migraciones (si las hay)
npx prisma migrate deploy

# Reiniciar
pm2 restart easton-surveys
# o
sudo systemctl restart easton-surveys
```

---

## 🆘 Solución de Problemas

### La aplicación no inicia

1. Verifica las variables de entorno:
   ```bash
   cat .env
   ```

2. Verifica la conexión a la base de datos:
   ```bash
   mysql -u easton_user -p easton_surveys -e "SELECT 1;"
   ```

3. Revisa los logs:
   ```bash
   pm2 logs easton-surveys --lines 100
   ```

### Error de conexión a la base de datos

1. Verifica que MariaDB esté corriendo:
   ```bash
   sudo systemctl status mariadb
   ```

2. Verifica las credenciales en `.env`

3. Verifica los permisos del usuario:
   ```sql
   SHOW GRANTS FOR 'easton_user'@'localhost';
   ```

### Error 502 Bad Gateway

1. Verifica que la aplicación esté corriendo:
   ```bash
   pm2 status
   ```

2. Verifica que el puerto 3000 esté escuchando:
   ```bash
   sudo netstat -tlnp | grep 3000
   ```

3. Revisa logs de Nginx:
   ```bash
   sudo tail -f /var/log/nginx/error.log
   ```

---

## 📞 Soporte

Para problemas o preguntas:
- Revisa los logs de la aplicación
- Verifica la configuración de la base de datos
- Consulta la documentación de Next.js: https://nextjs.org/docs
- Consulta la documentación de Prisma: https://www.prisma.io/docs

---

## ✅ Checklist de Despliegue

- [ ] MariaDB instalado y configurado
- [ ] Base de datos creada
- [ ] Usuario de base de datos creado
- [ ] Node.js instalado (v18+)
- [ ] Archivos subidos al servidor
- [ ] Dependencias instaladas (`npm install`)
- [ ] Variables de entorno configuradas (`.env`)
- [ ] Cliente Prisma generado (`npx prisma generate`)
- [ ] Tablas creadas (`npx prisma db push`)
- [ ] Datos iniciales cargados (`npm run prisma:seed`)
- [ ] Aplicación construida (`npm run build`)
- [ ] PM2 o systemd configurado
- [ ] Nginx configurado como reverse proxy
- [ ] SSL/HTTPS configurado
- [ ] Firewall configurado
- [ ] Primer login exitoso como admin

---

## 🎉 ¡Listo!

Tu aplicación debería estar funcionando en:
- **HTTP**: http://tu-dominio.com
- **HTTPS**: https://tu-dominio.com

**Credenciales de acceso:**
- Email: `admin@easton.cl`
- Password: `easton2026`
