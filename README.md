# Lottery System Demo

A comprehensive lottery system prototype with user features and admin controls. Built with Django backend, PostgreSQL database, and HTML5/CSS3/JavaScript frontend.

## Features

### User Features
- User registration and authentication
- Browse available lotteries
- Purchase lottery tickets
- View purchase history
- Check lottery results
- View winnings and prize distribution
- Wallet/balance management
- User profile management

### Admin Features
- Create and manage lottery draws
- Set ticket prices and prize amounts
- View all participants
- Manual and automated draw functionality
- Winner selection and announcement
- Prize management
- Revenue tracking and analytics
- User management and moderation
- Lottery status management (active, completed, cancelled)

### System Features
- Cryptographically secure random winner selection
- Real-time transaction tracking
- Role-based access control (User, Admin)
- Responsive design for desktop and mobile
- Data validation and security
- Audit logging for all transactions

## Tech Stack

### Backend
- **Framework**: Django 4.2+
- **Database**: PostgreSQL
- **API**: Django REST Framework
- **Authentication**: JWT (Token-based)
- **Utilities**: Celery (for async tasks), Gunicorn (production server)

### Frontend
- **HTML5** - Semantic markup
- **CSS3** - Modern styling with flexbox and grid
- **JavaScript (ES6+)** - Client-side logic
- **Fetch API** - HTTP requests

### Development & Deployment
- Python 3.10+
- pip (Python package manager)
- Docker (optional, for containerization)

## Project Structure

```
lottery-system-demo/
├── backend/
│   ├── lottery/
│   │   ├── settings.py           # Django settings
│   │   ├── urls.py               # URL configuration
│   │   ├── wsgi.py               # WSGI application
│   │   └── asgi.py               # ASGI application
│   ├── apps/
│   │   ├── users/
│   │   │   ├── models.py         # User models
│   │   │   ├── views.py          # User views
│   │   │   ├── serializers.py    # DRF serializers
│   │   │   └── urls.py           # User endpoints
│   │   ├── lotteries/
│   │   │   ├── models.py         # Lottery models
│   │   │   ├── views.py          # Lottery views
│   │   │   ├── serializers.py    # DRF serializers
│   │   │   └── urls.py           # Lottery endpoints
│   │   └── transactions/
│   │       ├── models.py         # Transaction models
│   │       ├── views.py          # Transaction views
│   │       └── serializers.py    # DRF serializers
│   ├── manage.py                 # Django management script
│   ├── requirements.txt           # Python dependencies
│   └── .env.example              # Environment variables template
├── frontend/
│   ├── index.html                # Main entry point
│   ├── css/
│   │   ├── styles.css            # Main styles
│   │   └── responsive.css        # Responsive design
│   ├── js/
│   │   ├── app.js                # Main application logic
│   │   ├── api.js                # API communication
│   │   ├── auth.js               # Authentication logic
│   │   ├── ui.js                 # UI interactions
│   │   └── utils.js              # Utility functions
│   └── pages/
│       ├── login.html            # Login page
│       ├── register.html         # Registration page
│       ├── dashboard.html        # User dashboard
│       ├── lotteries.html        # Browse lotteries
│       ├── admin-dashboard.html  # Admin dashboard
│       └── admin-create.html     # Create lottery
├── docker-compose.yml            # Docker compose configuration
├── Dockerfile                    # Docker configuration
├── .gitignore                    # Git ignore rules
└── SETUP.md                      # Detailed setup guide
```

## Quick Start

### Prerequisites
- Python 3.10+
- PostgreSQL 12+
- Node.js/npm (optional, for frontend tooling)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/theburhanahmed/lottery-system-demo.git
   cd lottery-system-demo
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb lottery_db
   
   # Run migrations
   python manage.py migrate
   
   # Create superuser (admin)
   python manage.py createsuperuser
   ```

4. **Run Backend**
   ```bash
   python manage.py runserver
   ```

5. **Frontend Setup**
   ```bash
   cd ../frontend
   # Serve using any static server
   # Option 1: Python
   python -m http.server 8000
   # Option 2: Node.js (if installed)
   npx serve
   ```

6. **Access the Application**
   - Frontend: `http://localhost:8000`
   - Admin Panel: `http://localhost:8000/admin` (Django admin)
   - API: `http://localhost:8000/api`

## API Endpoints

### Authentication
- `POST /api/users/register/` - Register new user
- `POST /api/users/login/` - User login
- `POST /api/users/logout/` - User logout
- `POST /api/users/refresh-token/` - Refresh JWT token

### Users
- `GET /api/users/profile/` - Get user profile
- `PUT /api/users/profile/` - Update user profile
- `GET /api/users/wallet/` - Get wallet balance
- `GET /api/users/transactions/` - Get user transactions

### Lotteries
- `GET /api/lotteries/` - List all lotteries
- `GET /api/lotteries/<id>/` - Get lottery details
- `POST /api/lotteries/` - Create new lottery (Admin only)
- `PUT /api/lotteries/<id>/` - Update lottery (Admin only)
- `DELETE /api/lotteries/<id>/` - Delete lottery (Admin only)
- `GET /api/lotteries/<id>/participants/` - Get lottery participants (Admin only)

### Tickets
- `POST /api/lotteries/<id>/buy-ticket/` - Purchase ticket
- `GET /api/lotteries/<id>/my-tickets/` - Get user's tickets for lottery
- `GET /api/tickets/` - Get all user tickets

### Draw & Results
- `POST /api/lotteries/<id>/draw/` - Conduct draw (Admin only)
- `GET /api/lotteries/<id>/results/` - Get lottery results
- `GET /api/lotteries/<id>/winner/` - Get winner information

### Transactions
- `GET /api/transactions/` - Get all transactions
- `GET /api/transactions/<id>/` - Get transaction details

## Admin Functions

### Creating a Lottery
1. Navigate to Admin Dashboard
2. Click "Create New Lottery"
3. Fill in details:
   - Lottery name
   - Description
   - Ticket price
   - Total tickets available
   - Prize amount
   - Draw date/time
4. Click "Create"

### Conducting a Draw
1. Go to lottery details
2. Click "Conduct Draw" (only available on or after draw date)
3. System randomly selects winner from participants
4. Winner is notified and prize transferred

### Viewing Analytics
- Total revenue
- Number of lotteries conducted
- Active participants
- Prize distribution
- Transaction history

## Security Considerations

⚠️ **This is a demonstration project.** For production use, implement:

- [ ] HTTPS/SSL certificates
- [ ] Rate limiting on API endpoints
- [ ] CSRF protection
- [ ] SQL injection prevention (Django ORM provides this)
- [ ] XSS prevention (use Content Security Policy headers)
- [ ] Secure password hashing (Django provides this)
- [ ] Payment gateway integration (Stripe, PayPal, etc.)
- [ ] KYC/AML verification
- [ ] Regulatory compliance checks
- [ ] Regular security audits
- [ ] Penetration testing
- [ ] DDoS protection

## Database Schema

### Users
- id (PK)
- username (unique)
- email (unique)
- password_hash
- first_name
- last_name
- is_admin
- wallet_balance
- created_at
- updated_at

### Lotteries
- id (PK)
- name
- description
- ticket_price
- total_tickets
- available_tickets
- prize_amount
- draw_date
- status (active, completed, cancelled)
- created_by (FK to User)
- created_at
- updated_at

### Tickets
- id (PK)
- user_id (FK to User)
- lottery_id (FK to Lottery)
- ticket_number
- is_winner
- purchased_at

### Transactions
- id (PK)
- user_id (FK to User)
- type (purchase, prize, withdrawal)
- amount
- status (pending, completed, failed)
- related_lottery_id (FK to Lottery)
- description
- created_at

### Winners
- id (PK)
- user_id (FK to User)
- lottery_id (FK to Lottery)
- ticket_id (FK to Ticket)
- prize_amount
- announced_at
- claimed_at

## Testing

```bash
# Run tests
python manage.py test

# Run with coverage
coverage run --source='.' manage.py test
coverage report
coverage html
```

## Deployment

### Using Docker
```bash
docker-compose up -d
```

### Using Heroku
```bash
heroku create your-app-name
heroku addons:create heroku-postgresql:standard-0
git push heroku main
```

### Manual Deployment
See SETUP.md for detailed production deployment guide.

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see LICENSE file for details.

## Disclaimer

⚠️ **LEGAL NOTICE**: This is an educational/demonstration project. Lottery operations are heavily regulated. Before deploying any real lottery system:

1. Consult with legal experts in your jurisdiction
2. Obtain proper licenses and permits
3. Implement robust compliance and regulatory measures
4. Ensure user data protection and privacy
5. Implement responsible gambling features
6. Comply with all local, state, and federal laws

Use this only for learning, demonstration, and testing purposes.

## Support

For questions or issues, please open an issue on GitHub or contact the development team.

---

**Last Updated**: January 2026
**Version**: 1.0.0
