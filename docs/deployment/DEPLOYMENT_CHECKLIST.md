# Deployment Checklist

Use this checklist before deploying to production.

## Pre-Deployment

### Environment Setup
- [ ] All environment variables configured
- [ ] `DEBUG=False` set
- [ ] Strong `SECRET_KEY` generated
- [ ] `ALLOWED_HOSTS` configured
- [ ] Database credentials set
- [ ] Stripe production keys configured
- [ ] Email service configured (SendGrid/Mailgun)
- [ ] Redis configured
- [ ] CORS origins configured

### Security
- [ ] SSL certificate obtained
- [ ] Security headers configured
- [ ] Rate limiting enabled
- [ ] CSRF protection enabled
- [ ] Password validation rules set
- [ ] 2FA available (if required)
- [ ] Audit logging enabled

### Database
- [ ] PostgreSQL installed and running
- [ ] Database created
- [ ] User created with proper permissions
- [ ] Migrations tested
- [ ] Backup strategy configured
- [ ] Connection pooling configured

### Application
- [ ] All tests passing
- [ ] Code coverage > 80%
- [ ] No linting errors
- [ ] Dependencies updated
- [ ] Static files collected
- [ ] Media files configured
- [ ] Logging configured

### Services
- [ ] Gunicorn configured
- [ ] Celery worker configured
- [ ] Celery beat configured
- [ ] Nginx configured
- [ ] All services enabled

## Deployment Steps

### 1. Server Preparation
- [ ] Server provisioned
- [ ] System dependencies installed
- [ ] Application user created
- [ ] Directory structure created
- [ ] Permissions set

### 2. Application Deployment
- [ ] Code deployed
- [ ] Virtual environment created
- [ ] Dependencies installed
- [ ] Environment variables set
- [ ] Migrations run
- [ ] Superuser created
- [ ] Static files collected

### 3. Service Configuration
- [ ] Gunicorn service created
- [ ] Celery worker service created
- [ ] Celery beat service created
- [ ] Nginx configuration created
- [ ] SSL certificate installed
- [ ] All services started

### 4. Verification
- [ ] Application accessible
- [ ] API endpoints working
- [ ] Admin panel accessible
- [ ] User registration works
- [ ] Payment flow works (test mode)
- [ ] Email sending works
- [ ] Background jobs running
- [ ] Logs being written

## Post-Deployment

### Monitoring
- [ ] Error tracking configured (Sentry)
- [ ] Log aggregation set up
- [ ] Health checks configured
- [ ] Uptime monitoring set up
- [ ] Performance monitoring set up

### Backup
- [ ] Database backup script created
- [ ] Backup cron job configured
- [ ] Backup restoration tested
- [ ] Backup storage configured

### Documentation
- [ ] Deployment documented
- [ ] Runbook created
- [ ] Troubleshooting guide created
- [ ] Contact information documented

### Security Review
- [ ] Security headers verified
- [ ] SSL configuration verified
- [ ] Firewall rules configured
- [ ] Access logs reviewed
- [ ] Penetration testing (if required)

## Rollback Plan

- [ ] Previous version tagged
- [ ] Database migration rollback tested
- [ ] Rollback procedure documented
- [ ] Rollback script prepared

## Performance Testing

- [ ] Load testing performed
- [ ] Database query optimization verified
- [ ] Caching working correctly
- [ ] CDN configured (if applicable)
- [ ] Response times acceptable

## Compliance

- [ ] GDPR compliance verified
- [ ] Age verification working
- [ ] Responsible gaming features enabled
- [ ] Terms of service displayed
- [ ] Privacy policy displayed
- [ ] Cookie consent implemented

