# Frontend & Backend Integration Guide

Complete guide to running the Lottery System with both frontend and backend components working together.

## Project Structure Overview

```
lottery-system-demo/
├── backend/          # Django REST API
├── frontend/         # Vanilla JavaScript SPA
├── docker-compose.yml # Docker orchestration (if using)
├── requirements.txt   # Python dependencies
├── manage.py         # Django management
└── README.md         # Project overview
```

## Quick Start (5 Minutes)

### Step 1: Start Backend

```bash
# Navigate to project root
cd lottery-system-demo

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Apply migrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Start backend server
python manage.py runserver 0.0.0.0:8000
```

Backend runs at: `http://localhost:8000`
Admin interface: `http://localhost:8000/admin`

### Step 2: Start Frontend

```bash
# In new terminal, navigate to frontend
cd frontend

# Python 3
python -m http.server 8080
```

Frontend runs at: `http://localhost:8080`

## Detailed Setup Instructions

### Prerequisites

- **Python 3.8+**
- **pip** (Python package manager)
- **Node.js** (optional, for frontend build tools)
- **Modern web browser**
- **Git**

### Backend Setup (Detailed)

#### 1. Clone Repository

```bash
git clone <repository-url>
cd lottery-system-demo
```

#### 2. Create Virtual Environment

```bash
# Create
python -m venv venv

# Activate
# Linux/Mac
source venv/bin/activate

# Windows
venv\Scripts\activate
```

#### 3. Install Dependencies

```bash
pip install -r requirements.txt
```

#### 4. Configure Database

Edit `backend/settings.py` if using non-SQLite database:

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3',
        'NAME': BASE_DIR / 'db.sqlite3',
    }
}
```

#### 5. Run Migrations

```bash
python manage.py migrate
```

#### 6. Create Superuser (Admin)

```bash
python manage.py createsuperuser
```

Follow prompts to create admin account.

#### 7. Create Sample Data (Optional)

```bash
python manage.py shell
```

Then in Python shell:

```python
from django.contrib.auth.models import User
from lottery.models import Lottery
from datetime import datetime, timedelta

# Create test user
user = User.objects.create_user(
    username='testuser',
    email='test@example.com',
    password='testpass123'
)

# Create test lottery
lottery = Lottery.objects.create(
    name='Test Lottery',
    description='A test lottery',
    ticket_price=10.00,
    prize_amount=1000.00,
    total_tickets=100,
    draw_date=datetime.now() + timedelta(days=7),
    status='ACTIVE'
)

print(f"Created user: {user}")
print(f"Created lottery: {lottery}")
```

#### 8. Run Backend Server

```bash
python manage.py runserver 0.0.0.0:8000
```

Visit `http://localhost:8000/api/` to verify API is running.

### Frontend Setup (Detailed)

#### 1. Configure API Endpoint

Edit `frontend/api.js` and update:

```javascript
const API_BASE_URL = 'http://localhost:8000/api';
```

#### 2. Start Frontend Server

**Option A: Python HTTP Server**

```bash
cd frontend
python -m http.server 8080
```

**Option B: Node.js HTTP Server**

```bash
cd frontend
npx http-server -p 8080
```

**Option C: Live Server (VS Code)**

1. Install "Live Server" extension
2. Right-click `index.html`
3. Select "Open with Live Server"

#### 3. Access Frontend

Open browser: `http://localhost:8080`

## Full Integration Workflow

### Testing User Registration & Login

1. **Navigate to Frontend**: `http://localhost:8080`
2. **Click Register**
3. **Enter Details**:
   - Username: `demo_user`
   - Email: `demo@example.com`
   - Password: `Demo@123456`
   - Confirm: `Demo@123456`
4. **Submit** - Should register and auto-login
5. **Redirect** - Should go to Dashboard

### Testing Lottery Features

1. **Add Funds**:
   - Click "+ Add Funds" on Dashboard
   - Enter amount: `100.00`
   - Click "Add Funds"
   - Wallet should update

2. **Browse Lotteries**:
   - Click "Lotteries" in nav
   - See lottery listings
   - Click any lottery card for details

3. **Buy Ticket**:
   - On lottery detail page
   - Click "🎫 Buy Ticket Now"
   - Set quantity: `5`
   - Click "Purchase Tickets"
   - Wallet should deduct amount

4. **View Tickets**:
   - Click "My Tickets" in nav
   - See purchased tickets
   - Check ticket numbers

### Testing Admin Features

1. **Login as Admin**:
   - Click Logout
   - Click Login
   - Use superuser credentials created earlier
   - Should see "Admin" in navigation

2. **Create Lottery**:
   - Click "Admin" > "Admin Dashboard"
   - Click "+ Create New Lottery"
   - Fill details:
     - Name: `Summer Jackpot`
     - Description: `Big summer lottery`
     - Ticket Price: `5.00`
     - Prize Amount: `5000.00`
     - Total Tickets: `1000`
     - Draw Date: `2 weeks from now`
   - Click "Create Lottery"
   - Should appear in lottery listings

## API Endpoint Reference

### Authentication

```
POST   /api/users/register/          Register new user
POST   /api/users/login/             Login user
POST   /api/users/logout/            Logout user
GET    /api/users/profile/           Get user profile
PUT    /api/users/update_profile/    Update profile
```

### Lotteries

```
GET    /api/lotteries/                List all lotteries
POST   /api/lotteries/                Create lottery (admin)
GET    /api/lotteries/{id}/           Get lottery details
PUT    /api/lotteries/{id}/           Update lottery (admin)
DELETE /api/lotteries/{id}/           Delete lottery (admin)
POST   /api/lotteries/{id}/buy_ticket/  Buy ticket
GET    /api/lotteries/{id}/results/   Get lottery results
POST   /api/lotteries/{id}/draw/      Conduct draw (admin)
```

### Wallet & Funds

```
GET    /api/users/wallet/             Get wallet info
POST   /api/users/add_funds/          Add funds to wallet
GET    /api/users/transactions/       Get transactions
```

### Payment Methods

```
GET    /api/payment-methods/          List payment methods
POST   /api/payment-methods/          Create payment method
GET    /api/payment-methods/{id}/     Get payment method
DELETE /api/payment-methods/{id}/     Delete payment method
POST   /api/payment-methods/{id}/set_primary/  Set primary method
```

### Tickets

```
GET    /api/tickets/                  List user tickets
GET    /api/tickets/{id}/             Get ticket details
GET    /api/lotteries/{id}/my_tickets/  Get tickets for lottery
```

### Withdrawals

```
GET    /api/withdrawals/              List withdrawals
POST   /api/withdrawals/              Request withdrawal
POST   /api/withdrawals/{id}/approve/ Approve withdrawal (admin)
POST   /api/withdrawals/{id}/reject/  Reject withdrawal (admin)
```

## CORS Configuration

If frontend and backend are on different domains, ensure CORS is enabled.

### Backend CORS Setup

Already configured in `backend/settings.py`:

```python
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://localhost:3000",
    "http://127.0.0.1:8080",
]
```

For production, update with actual domain:

```python
CORS_ALLOWED_ORIGINS = [
    "https://yourdomain.com",
    "https://www.yourdomain.com",
]
```

## Environment Variables

### Backend (.env)

Create `.env` file in project root:

```
DEBUG=True
SECRET_KEY=your-secret-key-here
ALLOWED_HOSTS=localhost,127.0.0.1
DATABASE_URL=sqlite:///db.sqlite3
```

### Frontend

Update `frontend/api.js`:

```javascript
// Development
const API_BASE_URL = 'http://localhost:8000/api';

// Production
const API_BASE_URL = 'https://api.yourdomain.com/api';
```

## Troubleshooting

### Backend Issues

#### Port Already in Use

```bash
# Use different port
python manage.py runserver 8001
```

#### Database Errors

```bash
# Reset database
python manage.py flush
python manage.py migrate
```

#### Module Not Found

```bash
# Verify virtual environment
source venv/bin/activate
pip install -r requirements.txt
```

### Frontend Issues

#### CORS Errors

- Check backend is running
- Verify API_BASE_URL in api.js
- Check backend CORS configuration

#### Blank Page

- Open browser console (F12)
- Check for JavaScript errors
- Verify all .js files are loading

#### Can't Connect to API

- Verify backend is running: `http://localhost:8000/api/`
- Check API_BASE_URL
- Check browser network tab for failed requests

## Docker Deployment (Optional)

### Using Docker Compose

```bash
# Build and start
docker-compose up -d

# View logs
docker-compose logs -f

# Stop
docker-compose down
```

Services:
- Backend: `http://localhost:8000`
- Frontend: `http://localhost:8080`
- Database: PostgreSQL (if configured)

## Production Deployment

### Backend (Django)

1. **Set Production Settings**
   ```python
   DEBUG = False
   ALLOWED_HOSTS = ['yourdomain.com']
   ```

2. **Use Production Database** (PostgreSQL/MySQL)

3. **Collect Static Files**
   ```bash
   python manage.py collectstatic
   ```

4. **Use Production Server** (Gunicorn/uWSGI)
   ```bash
   pip install gunicorn
   gunicorn backend.wsgi:application
   ```

5. **Use Web Server** (Nginx/Apache)

### Frontend

1. **Build for Production** (Optional)
   ```bash
   # If using build tools
   npm run build
   ```

2. **Deploy Static Files**
   - Upload entire `frontend/` directory
   - Or use CDN for static assets

3. **Configure API URL**
   - Point to production API endpoint

4. **Enable HTTPS**
   - Use SSL certificate
   - Redirect HTTP to HTTPS

## Performance Optimization

### Backend
- Use database indexing
- Implement pagination
- Cache API responses
- Use CDN for static files

### Frontend
- Minimize JavaScript bundles
- Lazy load images
- Use service workers for caching
- Implement code splitting

## Security Checklist

- [ ] Change Django SECRET_KEY
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Sanitize user inputs
- [ ] Use secure password hashing
- [ ] Enable CSRF protection
- [ ] Set secure headers
- [ ] Regular security updates
- [ ] SQL injection prevention
- [ ] XSS protection

## Testing

### Backend Tests

```bash
python manage.py test
```

### Frontend Manual Testing

1. User registration and login
2. Wallet operations
3. Lottery browsing and purchasing
4. Admin lottery creation
5. Transaction history
6. Payment methods

### Automated Testing

```bash
# Using Jest/Mocha
npm test
```

## Development Workflow

### Code Organization

```
backend/
├── lottery/        # Main app
├── users/          # User app
├── settings.py     # Settings
├── urls.py         # URL routing
└── wsgi.py         # WSGI entry

frontend/
├── index.html      # Main HTML
├─══ api.js         # API calls
├══ auth.js         # Auth logic
├══ ui.js           # UI utilities
├══ utils.js        # General utils
└══ app.js          # App logic
```

### Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
git add .
git commit -m "Add new feature"

# Push to remote
git push origin feature/new-feature

# Create pull request
# After review and approval
git checkout main
git pull
git merge feature/new-feature
```

## Debugging Tips

### Backend Debugging

```python
# Add print statements
print(f"Debug: {variable}")

# Use Django shell
python manage.py shell

# Use debugger
import pdb; pdb.set_trace()
```

### Frontend Debugging

```javascript
// Console logging
console.log('Debug:', variable);

// Debugger statement
debugger;

// Browser DevTools
F12 -> Sources -> Set breakpoints
```

## Support & Resources

- Django Docs: https://docs.djangoproject.com/
- Django REST Framework: https://www.django-rest-framework.org/
- JavaScript MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/
- REST API Best Practices: https://restfulapi.net/

## License

MIT License

## Contact

For questions or issues, please contact the development team.
