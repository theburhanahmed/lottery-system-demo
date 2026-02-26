# Lottery System Demo - Complete Setup Guide

## Prerequisites

Before starting, ensure you have the following installed:

1. **Python 3.10 or higher**
   ```bash
   python --version
   ```

2. **PostgreSQL 12 or higher** (optional for local dev – SQLite is used by default)
   ```bash
   psql --version
   ```

3. **Git**
   ```bash
   git --version
   ```

4. **pip** (Python package manager - usually comes with Python)
   ```bash
   pip --version
   ```

## Installation Steps

### Step 1: Clone the Repository

```bash
git clone https://github.com/theburhanahmed/lottery-system-demo.git
cd lottery-system-demo
```

### Step 2: Set Up Backend Environment

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Linux/Mac:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend/` directory:

```bash
cd backend
cat > .env << EOF
# Django Settings
DEBUG=True
SECRET_KEY=django-insecure-dev-key-change-in-production-12345

# Database – SQLite for local dev (no PostgreSQL required)
DB_ENGINE=django.db.backends.sqlite3

# CORS Settings
CORS_ALLOWED_ORIGINS=http://localhost:8000,http://127.0.0.1:8000,http://localhost:3000

# Security
SECURE_SSL_REDIRECT=False
SESSION_COOKIE_SECURE=False
CSRF_COOKIE_SECURE=False
EOF
```

### Step 4: Run Database Migrations

```bash
# From backend directory
python manage.py makemigrations
python manage.py migrate
```

This creates `db.sqlite3` in the backend directory. For production, use PostgreSQL and set `DATABASE_URL` instead.

### Step 5: Create Superuser (Admin)

```bash
python manage.py createsuperuser

# Follow the prompts:
# Username: admin
# Email: admin@example.com
# Password: (enter a secure password)
# Password (again): (confirm password)
```

### Step 6: Create Sample Data (Optional)

```bash
python manage.py shell
```

Inside the shell:

```python
from apps.users.models import User
from apps.lotteries.models import Lottery
from django.utils import timezone
from datetime import timedelta

# Create a test user
user = User.objects.create_user(
    username='testuser',
    email='testuser@example.com',
    password='testpass123'
)
user.wallet_balance = 1000
user.save()

# Create a sample lottery
admin = User.objects.get(username='admin')
lottery = Lottery.objects.create(
    name='New Year Lucky Draw',
    description='Win big in our New Year lottery!',
    ticket_price=10.00,
    total_tickets=100,
    available_tickets=100,
    prize_amount=1000.00,
    status='ACTIVE',
    draw_date=timezone.now() + timedelta(days=7),
    created_by=admin
)

print("Sample data created successfully!")
exit()
```

### Step 7: Run Backend Server

```bash
# From backend directory
python manage.py runserver

# Output should show:
# Starting development server at http://127.0.0.1:8000/
```

The backend will be running on `http://localhost:8000`

### Step 8: Set Up Frontend

In a new terminal, navigate to the frontend directory:

```bash
cd frontend

# Option A: Using Python's built-in server
python -m http.server 8080

# Option B: Using Node.js (if installed)
npx serve -l 8080

# Option C: Using PHP (if installed)
php -S localhost:8080
```

The frontend will be running on `http://localhost:8080`

## Verify Installation

### Backend Health Check

```bash
curl http://localhost:8000/api/lotteries/
```

You should receive a JSON response with lottery data.

### Frontend Access

Open your browser and visit:
- Frontend: `http://localhost:8080`
- Django Admin: `http://localhost:8000/admin` (login with superuser)

## Testing the Application

### 1. User Registration

1. Go to frontend home page
2. Click "Register Now"
3. Fill in the registration form
4. Click "Register"

### 2. User Login

1. Click "Login"
2. Enter your credentials
3. You'll be redirected to the dashboard

### 3. Browse Lotteries

1. From dashboard, click "Lotteries"
2. View available lotteries
3. Click "Buy Ticket"

### 4. Admin Functions

1. Login with superuser account
2. Access "Admin" menu
3. Create a new lottery
4. Manage active lotteries

## Troubleshooting

### Database Connection Error

If you get a `psycopg2` error:

```bash
# Install psycopg2
pip install psycopg2-binary

# Or compile it
pip install --no-binary psycopg2 psycopg2
```

### Port Already in Use

If port 8000 or 8080 is in use:

```bash
# For backend (use different port):
python manage.py runserver 0.0.0.0:8001

# For frontend:
python -m http.server 8081
```

Then update the API URL in `frontend/js/app.js` to match your backend port.

### CORS Errors

If you see CORS errors in the browser console:

1. Ensure frontend and backend URLs are in `CORS_ALLOWED_ORIGINS` in `.env`
2. Restart the Django server

### Migration Errors

If you encounter migration issues:

```bash
# Reset migrations (for development only!)
python manage.py migrate apps.users zero
python manage.py migrate apps.lotteries zero
python manage.py migrate apps.transactions zero

# Then re-run migrations
python manage.py migrate
```

## Production Deployment

### Using Docker

1. Build the Docker image:
   ```bash
   docker-compose build
   ```

2. Start containers:
   ```bash
   docker-compose up -d
   ```

### Using Heroku

1. Install Heroku CLI
2. Login to Heroku:
   ```bash
   heroku login
   ```

3. Create app:
   ```bash
   heroku create your-app-name
   ```

4. Add PostgreSQL addon:
   ```bash
   heroku addons:create heroku-postgresql:standard-0
   ```

5. Set environment variables:
   ```bash
   heroku config:set DEBUG=False
   heroku config:set SECRET_KEY="your-secure-key-here"
   ```

6. Deploy:
   ```bash
   git push heroku main
   ```

### Using AWS/DigitalOcean

Refer to Django deployment guides:
- AWS: https://docs.aws.amazon.com/elasticbeanstalk/latest/dg/create-deploy-python-django.html
- DigitalOcean: https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn

## API Documentation

### Authentication Endpoints

**Register:**
```
POST /api/users/register/
Body: {
  "username": "user123",
  "email": "user@example.com",
  "password": "securepass"
}
```

**Login:**
```
POST /api/users/login/
Body: {
  "username": "user123",
  "password": "securepass"
}
Response: {
  "token": "jwt-token-here",
  "user": {...user details...}
}
```

### Protected Endpoints (Require JWT Token)

Add header: `Authorization: Bearer {token}`

**Get Profile:**
```
GET /api/users/profile/
```

**Get Wallet:**
```
GET /api/users/wallet/
```

**Get Lotteries:**
```
GET /api/lotteries/?status=ACTIVE
```

**Buy Ticket:**
```
POST /api/lotteries/{lottery_id}/buy-ticket/
```

**Get My Tickets:**
```
GET /api/tickets/
```

**Get Transactions:**
```
GET /api/transactions/
```

## Development Tips

### Run Tests

```bash
cd backend
python manage.py test

# With coverage
coverage run --source='.' manage.py test
coverage report
coverage html  # generates HTML report
```

### Code Formatting

```bash
# Format code with Black
black .

# Check code style
flake8 .

# Sort imports
isort .
```

### Database Backup

```bash
# Backup database
pg_dump -U lottery_user lottery_db > backup.sql

# Restore database
psql -U lottery_user lottery_db < backup.sql
```

## Security Checklist for Production

- [ ] Change `SECRET_KEY` to a secure random value
- [ ] Set `DEBUG=False`
- [ ] Set `ALLOWED_HOSTS` to your domain
- [ ] Use HTTPS (SSL/TLS certificates)
- [ ] Set up secure database password
- [ ] Enable CSRF protection
- [ ] Implement rate limiting
- [ ] Add security headers
- [ ] Set up monitoring and logging
- [ ] Regular security updates
- [ ] Implement KYC/AML verification
- [ ] Add responsible gambling features

## Support and Issues

For issues or questions:
1. Check the GitHub Issues page
2. Review the README.md
3. Check Django/DRF documentation
4. Open a new issue with detailed information

## License

MIT License - See LICENSE file for details

---

**Last Updated:** January 2026
**Version:** 1.0.0
