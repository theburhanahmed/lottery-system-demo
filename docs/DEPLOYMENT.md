# Deployment Guide

This guide covers production deployment of the Lottery System.

## Prerequisites

- Server with Ubuntu 20.04+ or similar Linux distribution
- PostgreSQL 12+ installed
- Redis installed
- Nginx installed
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)

## Step 1: Server Setup

### Install System Dependencies

```bash
sudo apt update
sudo apt install -y python3-pip python3-venv postgresql postgresql-contrib redis-server nginx git
```

### Create Application User

```bash
sudo adduser --system --group --home /var/www/lottery-system lottery
```

## Step 2: Database Setup

### Create PostgreSQL Database

```bash
sudo -u postgres psql
```

```sql
CREATE DATABASE lottery_db;
CREATE USER lottery_user WITH PASSWORD 'your-secure-password';
ALTER ROLE lottery_user SET client_encoding TO 'utf8';
ALTER ROLE lottery_user SET default_transaction_isolation TO 'read committed';
GRANT ALL PRIVILEGES ON DATABASE lottery_db TO lottery_user;
\q
```

## Step 3: Application Deployment

### Clone Repository

```bash
cd /var/www/lottery-system
sudo -u lottery git clone https://github.com/your-repo/lottery-system-demo.git .
```

### Create Virtual Environment

```bash
cd /var/www/lottery-system/backend
sudo -u lottery python3 -m venv venv
source venv/bin/activate
pip install --upgrade pip
pip install -r requirements.txt
```

### Configure Environment Variables

```bash
sudo -u lottery cp .env.example .env
sudo -u lottery nano .env
```

Update all required variables (see `ENVIRONMENT_VARIABLES.md`).

### Run Migrations

```bash
cd /var/www/lottery-system/backend
source venv/bin/activate
python manage.py migrate
python manage.py collectstatic --noinput
python manage.py createsuperuser
```

## Step 4: Gunicorn Setup

### Install Gunicorn

```bash
pip install gunicorn
```

### Create Gunicorn Service

Create `/etc/systemd/system/lottery-backend.service`:

```ini
[Unit]
Description=Lottery System Gunicorn daemon
After=network.target

[Service]
User=lottery
Group=lottery
WorkingDirectory=/var/www/lottery-system/backend
Environment="PATH=/var/www/lottery-system/backend/venv/bin"
ExecStart=/var/www/lottery-system/backend/venv/bin/gunicorn \
    --workers 3 \
    --bind unix:/var/www/lottery-system/backend/lottery.sock \
    --access-logfile /var/log/lottery/access.log \
    --error-logfile /var/log/lottery/error.log \
    lottery.wsgi:application

[Install]
WantedBy=multi-user.target
```

### Create Log Directory

```bash
sudo mkdir -p /var/log/lottery
sudo chown lottery:lottery /var/log/lottery
```

### Start Service

```bash
sudo systemctl daemon-reload
sudo systemctl start lottery-backend
sudo systemctl enable lottery-backend
```

## Step 5: Celery Setup

### Create Celery Worker Service

Create `/etc/systemd/system/lottery-celery-worker.service`:

```ini
[Unit]
Description=Lottery System Celery Worker
After=network.target

[Service]
User=lottery
Group=lottery
WorkingDirectory=/var/www/lottery-system/backend
Environment="PATH=/var/www/lottery-system/backend/venv/bin"
ExecStart=/var/www/lottery-system/backend/venv/bin/celery -A lottery worker -l info

[Install]
WantedBy=multi-user.target
```

### Create Celery Beat Service

Create `/etc/systemd/system/lottery-celery-beat.service`:

```ini
[Unit]
Description=Lottery System Celery Beat
After=network.target

[Service]
User=lottery
Group=lottery
WorkingDirectory=/var/www/lottery-system/backend
Environment="PATH=/var/www/lottery-system/backend/venv/bin"
ExecStart=/var/www/lottery-system/backend/venv/bin/celery -A lottery beat -l info

[Install]
WantedBy=multi-user.target
```

### Start Celery Services

```bash
sudo systemctl daemon-reload
sudo systemctl start lottery-celery-worker
sudo systemctl start lottery-celery-beat
sudo systemctl enable lottery-celery-worker
sudo systemctl enable lottery-celery-beat
```

## Step 6: Nginx Configuration

### Create Nginx Configuration

Create `/etc/nginx/sites-available/lottery-system`:

```nginx
upstream lottery_backend {
    server unix:/var/www/lottery-system/backend/lottery.sock fail_timeout=0;
}

server {
    listen 80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;

    client_max_body_size 4G;

    access_log /var/log/nginx/lottery-access.log;
    error_log /var/log/nginx/lottery-error.log;

    location /static/ {
        alias /var/www/lottery-system/backend/staticfiles/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }

    location /media/ {
        alias /var/www/lottery-system/backend/media/;
        expires 30d;
        add_header Cache-Control "public";
    }

    location / {
        try_files $uri $uri/ /index.html;
        root /var/www/lottery-system/frontend;
    }

    location /api/ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_pass http://lottery_backend;
    }

    location /admin/ {
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Host $http_host;
        proxy_redirect off;
        proxy_pass http://lottery_backend;
    }
}
```

### Enable Site

```bash
sudo ln -s /etc/nginx/sites-available/lottery-system /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## Step 7: SSL Certificate

### Install Certbot

```bash
sudo apt install certbot python3-certbot-nginx
```

### Obtain Certificate

```bash
sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
```

## Step 8: Database Backups

### Create Backup Script

Create `/usr/local/bin/lottery-backup.sh`:

```bash
#!/bin/bash
BACKUP_DIR="/var/backups/lottery"
DATE=$(date +%Y%m%d_%H%M%S)
mkdir -p $BACKUP_DIR

pg_dump -U lottery_user lottery_db | gzip > $BACKUP_DIR/lottery_db_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "lottery_db_*.sql.gz" -mtime +7 -delete
```

### Make Executable

```bash
sudo chmod +x /usr/local/bin/lottery-backup.sh
```

### Add to Crontab

```bash
sudo crontab -e
```

Add:
```
0 2 * * * /usr/local/bin/lottery-backup.sh
```

## Step 9: Monitoring

### Install Sentry (Optional)

Add Sentry DSN to `.env`:
```
SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id
```

### Health Check Endpoint

The application includes health check endpoints:
- `/api/health/` - Basic health check
- `/api/health/db/` - Database health check

## Step 10: Post-Deployment

### Verify Services

```bash
sudo systemctl status lottery-backend
sudo systemctl status lottery-celery-worker
sudo systemctl status lottery-celery-beat
sudo systemctl status nginx
```

### Test Application

1. Visit `https://yourdomain.com`
2. Test user registration
3. Test payment flow (use Stripe test mode)
4. Test lottery creation (admin)
5. Check logs for errors

### Log Locations

- Application logs: `/var/log/lottery/`
- Nginx logs: `/var/log/nginx/lottery-*.log`
- System logs: `journalctl -u lottery-backend`

## Troubleshooting

### Service Won't Start

```bash
sudo systemctl status lottery-backend
sudo journalctl -u lottery-backend -n 50
```

### Database Connection Issues

```bash
sudo -u postgres psql -c "SELECT * FROM pg_stat_activity WHERE datname='lottery_db';"
```

### Permission Issues

```bash
sudo chown -R lottery:lottery /var/www/lottery-system
sudo chmod -R 755 /var/www/lottery-system
```

## Maintenance

### Update Application

```bash
cd /var/www/lottery-system
sudo -u lottery git pull
cd backend
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py collectstatic --noinput
sudo systemctl restart lottery-backend
sudo systemctl restart lottery-celery-worker
sudo systemctl restart lottery-celery-beat
```

### Clear Cache

```bash
cd /var/www/lottery-system/backend
source venv/bin/activate
python manage.py shell
>>> from django.core.cache import cache
>>> cache.clear()
```

