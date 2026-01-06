# Environment Variables Guide

This document describes all environment variables used in the Lottery System.

## Required Variables

### Database Configuration
- `DB_ENGINE` - Database engine (default: `django.db.backends.postgresql`)
- `DB_NAME` - Database name (default: `lottery_db`)
- `DB_USER` - Database user (default: `lottery_user`)
- `DB_PASSWORD` - Database password (default: `lottery_password`)
- `DB_HOST` - Database host (default: `localhost`)
- `DB_PORT` - Database port (default: `5432`)

### Django Configuration
- `SECRET_KEY` - Django secret key (REQUIRED in production)
- `DEBUG` - Debug mode (default: `True`, set to `False` in production)
- `ALLOWED_HOSTS` - Comma-separated list of allowed hosts

### Stripe Configuration
- `STRIPE_PUBLIC_KEY` - Stripe publishable key (REQUIRED for payments)
- `STRIPE_SECRET_KEY` - Stripe secret key (REQUIRED for payments)
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook signing secret (REQUIRED for webhooks)
- `STRIPE_CURRENCY` - Currency code (default: `usd`)

## Optional Variables

### Email Configuration
- `EMAIL_BACKEND` - Email backend (default: `django.core.mail.backends.smtp.EmailBackend`)
- `EMAIL_HOST` - SMTP host (default: `smtp.gmail.com`)
- `EMAIL_PORT` - SMTP port (default: `587`)
- `EMAIL_USE_TLS` - Use TLS (default: `True`)
- `EMAIL_USE_SSL` - Use SSL (default: `False`)
- `EMAIL_HOST_USER` - SMTP username
- `EMAIL_HOST_PASSWORD` - SMTP password
- `DEFAULT_FROM_EMAIL` - Default sender email (default: `noreply@lottery-system.com`)

### SendGrid Configuration
- `SENDGRID_API_KEY` - SendGrid API key
- `USE_SENDGRID` - Use SendGrid (default: `False`)

### Mailgun Configuration
- `MAILGUN_API_KEY` - Mailgun API key
- `MAILGUN_DOMAIN` - Mailgun domain
- `USE_MAILGUN` - Use Mailgun (default: `False`)

### Frontend Configuration
- `FRONTEND_URL` - Frontend URL for email links (default: `http://localhost:3000`)

### Celery Configuration
- `CELERY_BROKER_URL` - Celery broker URL (default: `redis://localhost:6379/0`)
- `CELERY_RESULT_BACKEND` - Celery result backend (default: `redis://localhost:6379/0`)

### Redis Configuration
- `REDIS_URL` - Redis URL for caching (default: `redis://localhost:6379/1`)

### CORS Configuration
- `CORS_ALLOWED_ORIGINS` - Comma-separated list of allowed origins

### Security Settings (Production)
- `SECURE_SSL_REDIRECT` - Redirect HTTP to HTTPS (default: `False`)
- `SESSION_COOKIE_SECURE` - Secure session cookies (default: `False`)
- `CSRF_COOKIE_SECURE` - Secure CSRF cookies (default: `False`)
- `SECURE_HSTS_SECONDS` - HSTS seconds (default: `0`)
- `SECURE_HSTS_INCLUDE_SUBDOMAINS` - Include subdomains in HSTS (default: `False`)
- `SECURE_HSTS_PRELOAD` - Preload HSTS (default: `False`)

### Session Configuration
- `SESSION_COOKIE_AGE` - Session cookie age in seconds (default: `86400`)

### Rate Limiting
- `RATELIMIT_ENABLE` - Enable rate limiting (default: `True`)

## Example .env File

```bash
# Database
DB_ENGINE=django.db.backends.postgresql
DB_NAME=lottery_db
DB_USER=lottery_user
DB_PASSWORD=lottery_password
DB_HOST=localhost
DB_PORT=5432

# Django
SECRET_KEY=your-secret-key-here-change-in-production
DEBUG=False
ALLOWED_HOSTS=yourdomain.com,www.yourdomain.com

# Stripe
STRIPE_PUBLIC_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_CURRENCY=usd

# Email
EMAIL_BACKEND=django.core.mail.backends.smtp.EmailBackend
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USE_TLS=True
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-app-password
DEFAULT_FROM_EMAIL=noreply@lottery-system.com

# Frontend
FRONTEND_URL=https://yourdomain.com

# Celery
CELERY_BROKER_URL=redis://localhost:6379/0
CELERY_RESULT_BACKEND=redis://localhost:6379/0

# Redis
REDIS_URL=redis://localhost:6379/1

# CORS
CORS_ALLOWED_ORIGINS=https://yourdomain.com,https://www.yourdomain.com

# Security (Production)
SECURE_SSL_REDIRECT=True
SESSION_COOKIE_SECURE=True
CSRF_COOKIE_SECURE=True
SECURE_HSTS_SECONDS=31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS=True
SECURE_HSTS_PRELOAD=True
```

## Production Checklist

- [ ] Set `DEBUG=False`
- [ ] Set strong `SECRET_KEY`
- [ ] Configure `ALLOWED_HOSTS`
- [ ] Set up Stripe production keys
- [ ] Configure email service (SendGrid/Mailgun)
- [ ] Enable SSL/TLS security settings
- [ ] Set up proper CORS origins
- [ ] Configure database connection pooling
- [ ] Set up Redis for caching and Celery
- [ ] Configure logging
- [ ] Set up monitoring (Sentry)

