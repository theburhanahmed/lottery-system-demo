# Lottery System Frontend

A modern, responsive web application for the Lottery System. Built with vanilla JavaScript, HTML, and CSS - no build tools required!

## Features

### User Features
- **Authentication** - Register and login with secure token-based authentication
- **Browse Lotteries** - View all active lotteries with detailed information
- **Buy Tickets** - Purchase lottery tickets with real-time wallet updates
- **Wallet Management** - Add funds, view balance, and manage payment methods
- **Transaction History** - Track all deposits, purchases, withdrawals, and winnings
- **My Tickets** - View purchased tickets and check winning status
- **User Dashboard** - Monitor statistics, payment methods, and account activity

### Admin Features
- **Admin Dashboard** - Manage all lotteries and system statistics
- **Create Lotteries** - Set up new lotteries with custom parameters
- **Draw Management** - Conduct draws and manage lottery results
- **Withdrawal Approvals** - Review and approve user withdrawals

## Project Structure

```
frontend/
├── index.html          # Main HTML file with all pages and modals
├── api.js              # API communication module
├── auth.js             # Authentication management
├── ui.js               # UI utilities and helper functions
├── utils.js            # General utility functions
├── app.js              # Main application logic and routing
└── README.md           # This file
```

## File Descriptions

### index.html
- Contains all HTML markup for all pages
- Includes embedded CSS styling
- Defines all modals and forms
- Integrates all JavaScript modules

**Pages:**
- Home - Landing page with statistics
- Login/Register - Authentication pages
- Lotteries - Browse all available lotteries
- Lottery Detail - View specific lottery details
- My Tickets - View purchased tickets
- Dashboard - User dashboard with stats and payment methods
- Transactions - Transaction history
- Admin Dashboard - Admin panel (for admins only)
- Create Lottery - Create new lottery (for admins only)

### api.js
API communication module with all backend endpoints organized by resource.

**API Methods:**
```javascript
// Users
API.users.register(username, email, password, passwordConfirm)
API.users.login(username, password)
API.users.getProfile()
API.users.updateProfile(data)
API.users.getWallet()
API.users.addFunds(amount)
API.users.getTransactions()
API.users.logout()

// Lotteries
API.lotteries.list(status, ordering)
API.lotteries.get(id)
API.lotteries.create(data)
API.lotteries.update(id, data)
API.lotteries.delete(id)
API.lotteries.buyTicket(id, quantity)
API.lotteries.getResults(id)
API.lotteries.getWinner(id)
API.lotteries.conductDraw(id)
API.lotteries.getMyTickets(id)
API.lotteries.getParticipants(id)
API.lotteries.getStats(id)

// Tickets
API.tickets.list()
API.tickets.get(id)

// Transactions
API.transactions.list(type, status)
API.transactions.getSummary()

// Payment Methods
API.paymentMethods.list()
API.paymentMethods.get(id)
API.paymentMethods.create(data)
API.paymentMethods.update(id, data)
API.paymentMethods.delete(id)
API.paymentMethods.setPrimary(id)

// Withdrawals
API.withdrawals.list()
API.withdrawals.get(id)
API.withdrawals.request(amount, paymentMethodId)
API.withdrawals.approve(id)
API.withdrawals.reject(id)
```

### auth.js
Authentication and authorization management.

**Key Functions:**
```javascript
AUTH.isAuthenticated()     // Check if user is logged in
AUTH.getUser()             // Get current user data
AUTH.getToken()            // Get auth token
AUTH.isAdmin()             // Check if user is admin
AUTH.login(username, password)      // Login user
AUTH.register(username, email, password, passwordConfirm)
AUTH.logout()              // Logout user
AUTH.updateUser(user)      // Update user in storage
AUTH.requireAuth()         // Require authentication for page
AUTH.requireAdmin()        // Require admin for page
```

### ui.js
UI utilities for displaying data and managing user interface.

**Key Functions:**
```javascript
UI.showToast(message, type)                    // Show notification
UI.showModal(modalId)                          // Show modal
UI.closeModal(modalId)                         // Close modal
UI.setLoading(elementId, isLoading)            // Show loading state
UI.formatCurrency(amount)                      // Format money values
UI.formatDate(dateString)                      // Format dates
UI.createLotteryCard(lottery)                  // Create lottery card HTML
UI.createTicketCard(ticket)                    // Create ticket card HTML
UI.createTransactionItem(transaction)          // Create transaction item HTML
UI.updateWalletDisplay(balance)                // Update wallet in UI
UI.updateUserDisplay(user)                     // Update username in UI
```

### utils.js
General utility functions for common operations.

**Key Functions:**
```javascript
UTILS.debounce(func, delay)                    // Debounce function calls
UTILS.throttle(func, limit)                    // Throttle function calls
UTILS.isValidEmail(email)                      // Validate email format
UTILS.validateRequired(value)                  // Check if value is provided
UTILS.isValidNumber(value)                     // Validate number
UTILS.isValidPassword(password)                // Validate password
UTILS.getQueryParam(param)                     // Get URL query parameter
UTILS.parseRoute()                             // Parse hash route
UTILS.formatNumber(num)                        // Format number with commas
UTILS.daysDifference(date1, date2)             // Get days between dates
UTILS.isPast(dateString)                       // Check if date is past
UTILS.isFuture(dateString)                     // Check if date is future
UTILS.capitalize(str)                          // Capitalize string
UTILS.slugify(str)                             // Convert to URL-safe slug
UTILS.deepClone(obj)                           // Deep clone object
UTILS.mergeObjects(target, source)             // Merge objects
UTILS.filterArray(array, predicate)            // Filter array
UTILS.findInArray(array, predicate)            // Find item in array
UTILS.groupByKey(array, key)                   // Group array by key
UTILS.sortArray(array, key, desc)              // Sort array
UTILS.removeDuplicates(array, key)             // Remove duplicate items
UTILS.paginate(array, pageNum, pageSize)       // Paginate array
UTILS.getTotalPages(arrayLength, pageSize)     // Get total pages
```

### app.js
Main application logic including routing and page handlers.

**Key Functions:**
- `APP.init()` - Initialize application
- `APP.routeToPage()` - Handle page routing
- `APP.loadHome()` - Load home page statistics
- `APP.loadLotteries()` - Load lottery listings
- `APP.loadLotteryDetail(id)` - Load lottery detail page
- `APP.loadTickets()` - Load user's tickets
- `APP.loadDashboard()` - Load user dashboard
- `APP.loadTransactions()` - Load transaction history
- `APP.handleLogin(e)` - Handle login form submission
- `APP.handleRegister(e)` - Handle registration
- `APP.handleLogout()` - Handle logout
- `APP.handleAddFunds(e)` - Handle adding funds to wallet
- `APP.handleTicketPurchase(e)` - Handle buying tickets
- `APP.handleCreateLottery(e)` - Handle creating lottery

## Setup Instructions

### Prerequisites
- A running backend server (see backend README)
- Modern web browser with JavaScript enabled
- For local development: Simple HTTP server

### Option 1: Use Python HTTP Server (Recommended for Development)

```bash
# Navigate to frontend directory
cd frontend

# Python 3
python -m http.server 8080

# Or Python 2
python -m SimpleHTTPServer 8080
```

Access at: `http://localhost:8080`

### Option 2: Use Node.js http-server

```bash
# Install globally
npm install -g http-server

# Navigate to frontend directory
cd frontend

# Start server
http-server -p 8080
```

Access at: `http://localhost:8080`

### Option 3: Use Live Server (VS Code Extension)

1. Install "Live Server" extension in VS Code
2. Right-click `index.html`
3. Select "Open with Live Server"

### Configuration

Edit the API base URL in `api.js` if your backend is on a different server:

```javascript
const API_BASE_URL = 'http://localhost:8000/api'; // Change this
```

## Usage

### For Users

1. **Register** - Create a new account with username, email, and password
2. **Browse Lotteries** - View all available lotteries
3. **Add Funds** - Add money to your wallet via the dashboard
4. **Buy Tickets** - Purchase tickets for active lotteries
5. **Check Tickets** - View your purchased tickets and winning status
6. **View History** - Check transaction history in the dashboard

### For Admins

1. **Create Lotteries** - Go to Admin > Create Lottery
2. **Manage Lotteries** - View and edit lottery details
3. **Conduct Draws** - Perform lottery draws when ready
4. **Manage Withdrawals** - Approve or reject user withdrawal requests

## Routing

The application uses hash-based routing:

```
/                    - Home page
/login               - Login page
/register            - Registration page
/lotteries           - Browse all lotteries
/lottery/:id         - Lottery detail page
/tickets             - My tickets page
/dashboard           - User dashboard
/transactions        - Transaction history
/admin-dashboard     - Admin dashboard
/admin-create-lottery - Create new lottery
```

## Data Flow

```
User Action → App.js → API.js → Backend
   ↓
Backend Response → API.js → Auth/UI.js
   ↓
UI Update → Display to User
```

## Error Handling

- **Authentication Errors** - Automatically redirect to login
- **API Errors** - Display toast notification with error message
- **Validation Errors** - Show form validation messages
- **Network Errors** - Display user-friendly error messages

## Local Storage

The app stores the following in browser's localStorage:
- `token` - JWT authentication token
- `user` - Current user object

These are cleared on logout.

## Browser Support

- Chrome/Edge (Latest)
- Firefox (Latest)
- Safari (Latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Responsive Design

- Desktop: Full layout with multiple columns
- Tablet: Adjusted grid layout
- Mobile: Single column, touch-friendly buttons

Breakpoints:
- Small: < 768px
- Medium: 768px - 1024px
- Large: > 1024px

## Security Considerations

1. **Authentication** - Uses bearer token authentication
2. **CORS** - Ensure backend allows frontend origin
3. **XSS Prevention** - Sanitize user input
4. **HTTPS** - Use HTTPS in production
5. **Token Storage** - Tokens stored in localStorage (consider upgrading to secure cookie)

## Troubleshooting

### CORS Errors
- Check backend is running
- Verify API_BASE_URL in api.js
- Ensure backend CORS is configured

### Blank Pages
- Check browser console for errors
- Verify all JavaScript files are loading
- Check API server is running

### Login Not Working
- Verify backend is running
- Check credentials are correct
- Check backend user exists

### Tickets Not Showing
- Ensure user is logged in
- Check user has purchased tickets
- Verify backend API is returning data

## Development Tips

### Debugging
```javascript
// Enable debug logging in console
console.log('Debug message');

// Check user data
console.log(AUTH.getUser());

// Check token
console.log(AUTH.getToken());
```

### Testing
1. Create test user accounts
2. Add funds to test wallets
3. Purchase test tickets
4. Test admin functions

## Future Enhancements

- [ ] WebSocket support for real-time updates
- [ ] Dark mode support
- [ ] Offline support with Service Workers
- [ ] PWA installation
- [ ] Push notifications
- [ ] Advanced analytics
- [ ] Mobile app (React Native)

## License

MIT License - See LICENSE file

## Support

For issues or questions:
1. Check the backend README
2. Review console errors
3. Check API responses in Network tab
4. Contact development team
