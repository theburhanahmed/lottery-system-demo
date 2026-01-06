#!/bin/bash

# Deployment script for Lottery System
# Usage: ./scripts/deploy.sh [environment]

set -e  # Exit on error

ENVIRONMENT=${1:-production}
PROJECT_DIR="/var/www/lottery-system"
BACKEND_DIR="$PROJECT_DIR/backend"

echo "Starting deployment for environment: $ENVIRONMENT"

# Check if running as correct user
if [ "$USER" != "lottery" ]; then
    echo "Warning: Not running as lottery user. Some operations may fail."
fi

# Navigate to project directory
cd $PROJECT_DIR || exit 1

# Activate virtual environment
source $BACKEND_DIR/venv/bin/activate

# Pull latest code
echo "Pulling latest code..."
git pull origin main || git pull origin master

# Install/update dependencies
echo "Installing dependencies..."
cd $BACKEND_DIR
pip install --upgrade pip
pip install -r requirements.txt

# Run database migrations
echo "Running database migrations..."
python manage.py migrate --noinput

# Collect static files
echo "Collecting static files..."
python manage.py collectstatic --noinput --clear

# Run tests (optional, can be skipped with --skip-tests)
if [ "$2" != "--skip-tests" ]; then
    echo "Running tests..."
    pytest --cov=apps --cov-report=term-missing || {
        echo "Tests failed! Deployment aborted."
        exit 1
    }
fi

# Restart services
echo "Restarting services..."
if [ "$ENVIRONMENT" = "production" ]; then
    sudo systemctl restart lottery-backend
    sudo systemctl restart lottery-celery-worker
    sudo systemctl restart lottery-celery-beat
    sudo systemctl reload nginx
else
    # Development: just restart the process
    echo "Development mode: Please restart services manually"
fi

# Health check
echo "Performing health check..."
sleep 5
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" http://localhost:8000/api/health/ || echo "000")

if [ "$HEALTH_CHECK" = "200" ]; then
    echo "✓ Health check passed"
else
    echo "✗ Health check failed (HTTP $HEALTH_CHECK)"
    echo "Please check logs: journalctl -u lottery-backend -n 50"
    exit 1
fi

echo "Deployment completed successfully!"

