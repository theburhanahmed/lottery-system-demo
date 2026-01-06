# 49FLASHMONEY Lottery Platform - React Frontend

This is the React + TypeScript frontend for the lottery system, integrated from Magic Patterns design.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- Backend API running on `http://localhost:8000`

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables (create .env file)
cp .env.example .env

# Update .env with your values:
# VITE_API_BASE_URL=http://localhost:8000/api
# VITE_STRIPE_PUBLIC_KEY=pk_test_your_key

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── ui/          # Base UI components (Button, Input, Card, etc.)
│   ├── layout/      # Layout components (Navbar, Layout)
│   ├── auth/        # Authentication components
│   ├── lottery/     # Lottery-specific components
│   ├── wallet/      # Wallet & payment components
│   └── referral/    # Referral program components
├── pages/           # Page components
│   └── admin/       # Admin-only pages
├── contexts/        # React contexts (Auth, Wallet, Lottery)
├── services/        # API service layers
├── utils/           # Utility functions
├── types/           # TypeScript type definitions
└── config/          # Configuration files
```

## 🔌 Backend Integration

The frontend is configured to work with the Django backend:

- **API Base URL**: `http://localhost:8000/api` (configurable via `.env`)
- **Authentication**: JWT tokens (stored in sessionStorage)
- **API Client**: Axios with automatic token refresh

### Key Adaptations Made:

1. **Authentication**: Backend uses `username` instead of `email` for login
2. **Token Format**: Backend returns `token` instead of `access`/`refresh`
3. **Response Format**: Django REST Framework response format
4. **User Model**: Adapted Django user fields to frontend User interface

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 📝 Notes

This integration includes:

✅ Core configuration files (Vite, TypeScript, Tailwind)
✅ Authentication system (login, register, JWT)
✅ Service layers adapted for Django backend
✅ UI components (Button, Input, Card, Modal, Badge, Tabs)
✅ Layout components (Navbar, Layout)
✅ Context providers (Auth, Wallet, Lottery)
✅ Landing page, Login, Signup pages

⚠️ **Still Need to Implement:**
- Additional page components (UserDashboard, WalletPage, etc.)
- Lottery components (LotteryCard, TicketPurchaseModal, etc.)
- Wallet components (StripeCheckout, TransactionHistory, etc.)
- Referral components (ReferralCodeCard, ReferralStats, etc.)
- Admin pages (DrawExecutionPage, WithdrawalApprovalPage, etc.)
- Additional auth pages (EmailVerification, ForgotPassword, etc.)

## 🔧 Environment Variables

Create a `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_WS_URL=ws://localhost:8000/ws
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key_here
VITE_APP_ENV=development
```

## 📚 Next Steps

To complete the integration:

1. Download remaining components from Magic Patterns design
2. Create missing page components
3. Implement Stripe integration
4. Add WebSocket support for real-time updates
5. Test all API endpoints
6. Add error handling and loading states
7. Implement form validation

## 🐛 Known Issues

- Token refresh may need backend updates to return refresh tokens
- Some API endpoints may need adaptation based on actual backend implementation
- Stripe integration needs configuration

## 📄 License

Proprietary - All rights reserved

