# 🚀 Quick Start - Easton Surveys

## Despliegue Rápido en 5 Pasos

### 1️⃣ Crear Base de Datos MariaDB

```bash
mysql -u root -p
```

```sql
CREATE DATABASE easton_surveys CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'easton_user'@'localhost' IDENTIFIED BY 'TU_CONTRASEÑA_SEGURA';
GRANT ALL PRIVILEGES ON easton_surveys.* TO 'easton_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

---

### 2️⃣ Configurar Variables de Entorno

```bash
cp .env.example .env
nano .env
```

Edita el archivo `.env`:

```env
DATABASE_URL="mysql://easton_user:TU_CONTRASEÑA_SEGURA@localhost:3306/easton_surveys"
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="https://tu-dominio.com"
NODE_ENV="production"
```

**⚠️ Genera el secret:**
```bash
openssl rand -base64 32
```

---

### 3️⃣ Instalar Dependencias y Preparar Base de Datos

```bash
# Instalar dependencias
npm install

# Generar cliente Prisma
npx prisma generate

# Crear tablas
npx prisma db push

# Cargar datos iniciales
npm run prisma:seed
```

---

### 4️⃣ Construir y Ejecutar

```bash
# Construir aplicación
npm run build

# Iniciar con PM2 (recomendado)
npm install -g pm2
pm2 start npm --name "easton-surveys" -- start
pm2 save

# O iniciar directamente
npm start
```

---

### 5️⃣ Configurar Nginx (Opcional pero Recomendado)

```bash
sudo nano /etc/nginx/sites-available/easton-surveys
```

Contenido:

```nginx
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Habilitar:

```bash
sudo ln -s /etc/nginx/sites-available/easton-surveys /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

**SSL con Let's Encrypt:**

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## ✅ Verificación

Accede a tu aplicación:

- **URL**: https://tu-dominio.com
- **Email**: `admin@easton.cl`
- **Password**: `easton2026`

---

## 📝 Comandos Útiles

### Ver logs
```bash
pm2 logs easton-surveys
```

### Reiniciar aplicación
```bash
pm2 restart easton-surveys
```

### Backup de base de datos
```bash
mysqldump -u easton_user -p easton_surveys > backup.sql
```

### Ver estado
```bash
pm2 status
sudo systemctl status nginx
```

---

## 🔧 Troubleshooting

### Aplicación no inicia

1. Verifica logs: `pm2 logs easton-surveys`
2. Verifica conexión DB: `mysql -u easton_user -p easton_surveys`
3. Verifica puerto 3000: `sudo netstat -tlnp | grep 3000`

### Error de conexión a DB

1. Verifica que MariaDB esté corriendo: `sudo systemctl status mariadb`
2. Verifica credenciales en `.env`
3. Verifica permisos: `SHOW GRANTS FOR 'easton_user'@'localhost';`

---

## 📚 Documentación Completa

- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guía completa de despliegue
- [MIGRATION_NOTES.md](./MIGRATION_NOTES.md) - Notas de migración PostgreSQL → MariaDB

---

¡Listo! Tu aplicación debería estar funcionando. 🎉
