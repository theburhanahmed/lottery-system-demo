# Lottery System - Quick Reference Guide

## Start Backend & Frontend (60 seconds)

### Terminal 1 - Backend
```bash
cd lottery-system-demo
source venv/bin/activate      # On Windows: venv\Scripts\activate
python manage.py runserver
```

### Terminal 2 - Frontend
```bash
cd frontend
python -m http.server 8080
```

### Access
- **Frontend**: http://localhost:8080
- **Backend API**: http://localhost:8000/api
- **Admin Panel**: http://localhost:8000/admin

---

## Common Tasks

### First Time Setup

```bash
# Backend
cd lottery-system-demo
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py createsuperuser  # Create admin account
python manage.py runserver

# Frontend
cd frontend
python -m http.server 8080
```

### Reset Database

```bash
python manage.py flush
python manage.py migrate
```

### Create Test User

```bash
python manage.py shell
```

Then:
```python
from django.contrib.auth.models import User
user = User.objects.create_user('testuser', 'test@example.com', 'password')
print(user)
exit()
```

### Create Test Lottery

```bash
python manage.py shell
```

Then:
```python
from lottery.models import Lottery
from datetime import datetime, timedelta

lottery = Lottery.objects.create(
    name='Test Lottery',
    description='A test lottery',
    ticket_price=10.00,
    prize_amount=1000.00,
    total_tickets=100,
    draw_date=datetime.now() + timedelta(days=7),
    status='ACTIVE'
)
print(lottery)
exit()
```

---

## API Testing

### Using cURL

#### Register User
```bash
curl -X POST http://localhost:8000/api/users/register/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "password_confirm": "password123"
  }'
```

#### Login User
```bash
curl -X POST http://localhost:8000/api/users/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "password": "password123"
  }'
```

#### Get Lotteries
```bash
curl -X GET http://localhost:8000/api/lotteries/
```

#### Get User Profile (Requires Token)
```bash
curl -X GET http://localhost:8000/api/users/profile/ \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman

1. Create new collection
2. Add environment variable: `base_url = http://localhost:8000/api`
3. Add variable: `token` (auto-set from login response)
4. Create requests:
   - POST `{{base_url}}/users/register/`
   - POST `{{base_url}}/users/login/`
   - GET `{{base_url}}/lotteries/`
   - GET `{{base_url}}/users/profile/`

---

## Frontend Development

### File Locations

```
frontend/
├── index.html     # All pages and modals
├── api.js         # API calls
├── auth.js        # Auth logic
├── ui.js          # UI utilities
├── utils.js       # Helper functions
└── app.js         # Main logic
```

### Adding New Feature

1. **Add HTML** in `index.html` (new page or form)
2. **Add API methods** in `api.js`
3. **Add routing** in `app.js` (`routeToPage()`)
4. **Add page loader** in `app.js`
5. **Add event handlers** in `app.js`
6. **Test** in browser

### Debug Tips

```javascript
// In browser console
console.log(AUTH.getUser())           // Check user
console.log(AUTH.getToken())          // Check token
console.log(window.location.hash)     // Check current route

// Check API calls
// Open DevTools -> Network tab -> Filter by Fetch/XHR
```

---

## Backend Development

### File Locations

```
backend/
├── lottery/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
├── users/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   └── urls.py
└── settings.py
```

### Adding New Endpoint

1. **Create model** in `models.py`
2. **Create serializer** in `serializers.py`
3. **Create viewset** in `views.py`
4. **Register in admin** in `admin.py`
5. **Add URL** in `urls.py`
6. **Run migration**:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```
7. **Test** with cURL or Postman

### Django Shell

```bash
python manage.py shell

# Query data
from lottery.models import Lottery
Lottery.objects.all()
Lottery.objects.filter(status='ACTIVE')
Lottery.objects.get(id=1)

# Create data
from django.contrib.auth.models import User
User.objects.create_user('username', 'email@example.com', 'password')

# Update data
user = User.objects.get(username='testuser')
user.email = 'newemail@example.com'
user.save()

# Delete data
User.objects.get(username='testuser').delete()
```

---

## Frontend Pages & Routes

| Page | Route | Features |
|------|-------|----------|
| Home | `/` | Stats, hero section |
| Login | `#/login` | User login |
| Register | `#/register` | User registration |
| Lotteries | `#/lotteries` | Browse lotteries, filter |
| Lottery Detail | `#/lottery/:id` | View lottery, buy ticket |
| My Tickets | `#/tickets` | View purchased tickets |
| Dashboard | `#/dashboard` | User stats, wallet |
| Transactions | `#/transactions` | Transaction history |
| Admin | `#/admin-dashboard` | Admin panel |
| Create Lottery | `#/admin-create-lottery` | Create new lottery |

---

## User Roles & Permissions

### Regular User
- ✅ Register and login
- ✅ Browse lotteries
- ✅ Buy tickets
- ✅ View own tickets
- ✅ Manage wallet
- ✅ Add payment methods
- ✅ Request withdrawals
- ✅ View transactions
- ❌ Create lotteries
- ❌ Approve withdrawals

### Admin User
- ✅ All user features
- ✅ Create lotteries
- ✅ Edit lotteries
- ✅ Delete lotteries
- ✅ Conduct draws
- ✅ Approve withdrawals
- ✅ View all tickets
- ✅ View statistics

---

## Common Error Solutions

### Backend Won't Start

```bash
# Check port in use
lsof -i :8000  # macOS/Linux
netstat -ano | findstr :8000  # Windows

# Use different port
python manage.py runserver 8001
```

### Module Not Found

```bash
# Check virtual environment
which python  # Should show venv path

# Reinstall dependencies
pip install -r requirements.txt
```

### Database Errors

```bash
# Reset database
python manage.py flush
python manage.py migrate

# Create migrations
python manage.py makemigrations
python manage.py migrate
```

### Frontend CORS Error

```javascript
// Check API_BASE_URL in api.js
const API_BASE_URL = 'http://localhost:8000/api';

// Verify backend CORS is enabled
// Check settings.py for CORS_ALLOWED_ORIGINS
```

### Token Expired

```javascript
// In app.js, will auto-logout on 401
if (response.status === 401) {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.hash = '#/login';
}
```

---

## Testing Checklist

### User Flow
- [ ] Register new user
- [ ] Login with credentials
- [ ] Add funds to wallet
- [ ] Browse lotteries
- [ ] Buy ticket(s)
- [ ] View my tickets
- [ ] Check wallet balance updated
- [ ] View transaction history
- [ ] Logout successfully

### Admin Flow
- [ ] Login as admin
- [ ] Navigate to admin panel
- [ ] Create new lottery
- [ ] View lottery in listings
- [ ] View lottery statistics
- [ ] (Conduct draw when ready)

### Edge Cases
- [ ] Invalid login credentials
- [ ] Register with existing username
- [ ] Buy more tickets than available
- [ ] Add funds with invalid amount
- [ ] Access admin page as regular user
- [ ] Modify URL directly

---

## Performance Tips

### Backend
```python
# Use select_related for foreign keys
Ticket.objects.select_related('lottery', 'user')

# Use prefetch_related for many-to-many
Lottery.objects.prefetch_related('ticket_set')

# Use pagination
from rest_framework.pagination import PageNumberPagination

# Add database indexes
class Meta:
    indexes = [
        models.Index(fields=['user', 'created_at']),
    ]
```

### Frontend
```javascript
// Debounce search input
const debouncedSearch = UTILS.debounce(searchFunction, 300);

// Cache API responses
const cache = {};
if (cache[url]) return cache[url];

// Lazy load images
<img loading="lazy" src="..." />

// Minimize DOM manipulation
const fragment = document.createDocumentFragment();
// Add elements to fragment
document.body.appendChild(fragment);
```

---

## Useful Commands

```bash
# Backend
python manage.py shell                    # Python shell
python manage.py dbshell                  # Database shell
python manage.py makemigrations           # Create migrations
python manage.py migrate                  # Apply migrations
python manage.py collectstatic            # Collect static files
python manage.py runserver 0.0.0.0:8000  # Run on all interfaces

# Frontend
python -m http.server 8080                # Start HTTP server
cd frontend && python -m http.server 8080 # From root directory

# Git
git log --oneline                        # View commit history
git diff                                  # View changes
git status                                # Check status
git add .                                 # Stage all changes
git commit -m "message"                   # Commit changes
git push                                  # Push to remote
```

---

## Deployment Checklist

- [ ] Update Django SECRET_KEY
- [ ] Set DEBUG = False
- [ ] Configure ALLOWED_HOSTS
- [ ] Set up production database
- [ ] Configure CORS for production domain
- [ ] Update API_BASE_URL in frontend
- [ ] Enable HTTPS
- [ ] Configure static files
- [ ] Set up error logging
- [ ] Configure email backend
- [ ] Set up backups
- [ ] Test thoroughly
- [ ] Monitor logs

---

## Documentation Links

- **Backend Docs**: See `backend/README.md`
- **Frontend Docs**: See `frontend/README.md`
- **Integration Guide**: See `INTEGRATION_GUIDE.md`
- **Completion Summary**: See `COMPLETION_SUMMARY.md`
- **Django Docs**: https://docs.djangoproject.com/
- **DRF Docs**: https://www.django-rest-framework.org/
- **MDN Web Docs**: https://developer.mozilla.org/en-US/

---

## Quick Fixes

### Reset Everything
```bash
# Backend
python manage.py flush
python manage.py migrate

# Frontend
# Clear browser localStorage
localStorage.clear()
# Refresh page
window.location.reload()
```

### Export Database
```bash
python manage.py dumpdata > backup.json
```

### Import Database
```bash
python manage.py loaddata backup.json
```

### Create Backup
```bash
cp db.sqlite3 db.sqlite3.backup
```

---

## Support

For detailed information, see the full documentation files.
For specific features, check the README in respective directories.

**Project Status**: ✅ Production Ready

**Last Updated**: December 31, 2025
