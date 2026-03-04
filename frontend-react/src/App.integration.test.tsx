import React from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

const mockUseAuth = vi.fn();
const mockUseAppStateAdapter = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual<typeof import('react-router-dom')>('react-router-dom');
  return {
    ...actual,
    BrowserRouter: ({ children }: { children: React.ReactNode }) => (
      <actual.MemoryRouter initialEntries={['/dashboard']}>{children}</actual.MemoryRouter>
    ),
  };
});

vi.mock('./contexts/AuthContext', () => ({
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  useAuth: () => mockUseAuth(),
}));

vi.mock('./contexts/WalletContext', () => ({
  WalletProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('./contexts/LotteryContext', () => ({
  LotteryProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>,
}));

vi.mock('./hooks/useAppStateAdapter', () => ({
  useAppStateAdapter: () => mockUseAppStateAdapter(),
}));

vi.mock('./components/layout/Navbar', () => ({ Navbar: () => <div>Navbar</div> }));
vi.mock('./components/layout/Footer', () => ({ Footer: () => <div>Footer</div> }));
vi.mock('./components/ui/Toast', () => ({ ToastContainer: () => <div>ToastContainer</div> }));
vi.mock('./components/CookieConsent', () => ({ CookieConsent: () => <div>CookieConsent</div> }));

vi.mock('./pages/HomePage', () => ({ HomePage: () => <div>Home Page</div> }));
vi.mock('./pages/LoginPage', () => ({ LoginPage: () => <div>Login Page</div> }));
vi.mock('./pages/DashboardPage', () => ({ DashboardPage: () => <div>Dashboard Page</div> }));
vi.mock('./pages/LotteriesPage', () => ({ LotteriesPage: () => <div>Lotteries Page</div> }));
vi.mock('./pages/LotteryDetailPage', () => ({ LotteryDetailPage: () => <div>Lottery Detail Page</div> }));
vi.mock('./pages/MyTicketsPage', () => ({ MyTicketsPage: () => <div>My Tickets Page</div> }));
vi.mock('./pages/TransactionsPage', () => ({ TransactionsPage: () => <div>Transactions Page</div> }));
vi.mock('./pages/WalletPage', () => ({ WalletPage: () => <div>Wallet Page</div> }));
vi.mock('./pages/admin/AdminDashboardPage', () => ({ AdminDashboardPage: () => <div>Admin Dashboard</div> }));
vi.mock('./pages/admin/CreateLotteryPage', () => ({ CreateLotteryPage: () => <div>Create Lottery</div> }));
vi.mock('./pages/legal/TermsPage', () => ({ TermsPage: () => <div>Terms</div> }));
vi.mock('./pages/legal/PrivacyPage', () => ({ PrivacyPage: () => <div>Privacy</div> }));
vi.mock('./pages/legal/ResponsibleGamingPage', () => ({ ResponsibleGamingPage: () => <div>Responsible Gaming</div> }));
vi.mock('./pages/legal/SupportPage', () => ({ SupportPage: () => <div>Support</div> }));
vi.mock('./pages/PromosPage', () => ({ PromosPage: () => <div>Promos</div> }));
vi.mock('./pages/ProfilePage', () => ({ ProfilePage: () => <div>Profile</div> }));
vi.mock('./pages/ResultsPage', () => ({ ResultsPage: () => <div>Results</div> }));
vi.mock('./pages/CheckNumbersPage', () => ({ CheckNumbersPage: () => <div>Check Numbers</div> }));
vi.mock('./pages/NotificationsPage', () => ({ NotificationsPage: () => <div>Notifications</div> }));
vi.mock('./pages/GamesPage', () => ({ GamesPage: () => <div>Games</div> }));
vi.mock('./pages/SlotsPage', () => ({ SlotsPage: () => <div>Slots</div> }));
vi.mock('./pages/SignupPage', () => ({ SignupPage: () => <div>Signup</div> }));
vi.mock('./pages/ForgotPassword', () => ({ ForgotPassword: () => <div>Forgot Password</div> }));
vi.mock('./pages/ResetPassword', () => ({ ResetPassword: () => <div>Reset Password</div> }));
vi.mock('./pages/EmailVerification', () => ({ EmailVerification: () => <div>Email Verification</div> }));
vi.mock('./pages/admin/WithdrawalApprovalPage', () => ({ WithdrawalApprovalPage: () => <div>Withdrawal Approval</div> }));
vi.mock('./pages/admin/DrawExecutionPage', () => ({ DrawExecutionPage: () => <div>Draw Execution</div> }));
vi.mock('./pages/DrawResultsPage', () => ({ DrawResultsPage: () => <div>Draw Results</div> }));
vi.mock('./pages/SnakesLaddersLobbyPage', () => ({ SnakesLaddersLobbyPage: () => <div>Snakes Ladders Lobby</div> }));
vi.mock('./pages/SnakesLaddersPage', () => ({ SnakesLaddersPage: () => <div>Snakes Ladders</div> }));

import { App } from './App';

const baseState = {
  user: null,
  lotteries: [],
  tickets: [],
  transactions: [],
  notifications: [],
  toasts: [],
  login: vi.fn(),
  logout: vi.fn(),
  addToast: vi.fn(),
  removeToast: vi.fn(),
  buyTicket: vi.fn(),
  setDepositLimit: vi.fn(),
  selfExclude: vi.fn(),
  createLottery: vi.fn(),
  updateProfile: vi.fn(),
  requestDeposit: vi.fn(),
  requestWithdrawal: vi.fn(),
  markNotificationRead: vi.fn(),
  runDraw: vi.fn(),
};

describe('App route protection', () => {
  beforeEach(() => {
    mockUseAuth.mockReturnValue({
      user: null,
      register: vi.fn(),
    });
    mockUseAppStateAdapter.mockReturnValue(baseState);
  });

  it('redirects unauthenticated users from dashboard to login', async () => {
    window.history.pushState({}, '', '/dashboard');

    render(<App />);

    expect(await screen.findByText('Login Page')).toBeInTheDocument();
  });

  it('renders dashboard when authenticated user is present', async () => {
    window.history.pushState({}, '', '/dashboard');

    mockUseAppStateAdapter.mockReturnValue({
      ...baseState,
      user: { id: '1', role: 'user', name: 'Player', walletBalance: 100 },
    });

    render(<App />);

    expect(await screen.findByText('Dashboard Page')).toBeInTheDocument();
  });
});
