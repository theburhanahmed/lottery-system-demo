import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { LotteryProvider } from './contexts/LotteryContext';
import { useAppStateAdapter } from './hooks/useAppStateAdapter';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { ToastContainer } from './components/ui/Toast';
import { CookieConsent } from './components/CookieConsent';
import { Card } from './components/ui/Card';
import { Button } from './components/ui/Button';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { DashboardPage } from './pages/DashboardPage';
import { LotteriesPage } from './pages/LotteriesPage';
import { LotteryDetailPage } from './pages/LotteryDetailPage';
import { MyTicketsPage } from './pages/MyTicketsPage';
import { TransactionsPage } from './pages/TransactionsPage';
import { WalletPage } from './pages/WalletPage';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { CreateLotteryPage } from './pages/admin/CreateLotteryPage';
import { TermsPage } from './pages/legal/TermsPage';
import { PrivacyPage } from './pages/legal/PrivacyPage';
import { ResponsibleGamingPage } from './pages/legal/ResponsibleGamingPage';
import { SupportPage } from './pages/legal/SupportPage';
import { PromosPage } from './pages/PromosPage';
import { ProfilePage } from './pages/ProfilePage';
import { ResultsPage } from './pages/ResultsPage';
import { CheckNumbersPage } from './pages/CheckNumbersPage';
import { NotificationsPage } from './pages/NotificationsPage';
import { GamesPage } from './pages/GamesPage';
import { SlotsPage } from './pages/SlotsPage';
import { SignupPage } from './pages/SignupPage';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { EmailVerification } from './pages/EmailVerification';
import { WithdrawalApprovalPage } from './pages/admin/WithdrawalApprovalPage';
import { DrawExecutionPage } from './pages/admin/DrawExecutionPage';
import { DrawResultsPage } from './pages/DrawResultsPage';
import { Link } from 'react-router-dom';
import { SnakesLaddersLobbyPage } from './pages/SnakesLaddersLobbyPage';
import { SnakesLaddersPage } from './pages/SnakesLaddersPage';


const DASHBOARD_ROUTES = [
  '/dashboard',
  '/my-tickets',
  '/transactions',
  '/wallet',
  '/profile',
  '/notifications',
  '/slots',
  '/admin',
  '/admin/create',
  '/games/snakes-ladders',
];

function isDashboardRoute(path: string): boolean {
  return DASHBOARD_ROUTES.some(
    (route) => path === route || path.startsWith(route + '/')
  );
}

function NotFoundPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 animate-page-in">
      <Card className="max-w-lg mx-auto text-center py-12">
        <div className="text-7xl font-extrabold text-gray-200 dark:text-slate-700 mb-2">
          404
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Page Not Found
        </h2>
        <p className="text-gray-500 dark:text-slate-400 mb-6">
          The page you're looking for doesn't exist.
        </p>
        <Link to="/">
          <Button variant="primary">Go Home</Button>
        </Link>
      </Card>
    </div>
  );
}

function AppContent() {
  const state = useAppStateAdapter();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isOnDashboard = isDashboardRoute(location.pathname);
  const isLoginPage = location.pathname === '/login';

  useEffect(() => {
    if (isOnDashboard && !state.user) {
      navigate('/login');
    }
  }, [isOnDashboard, state.user, navigate]);

  const path = location.pathname;
  const segments = path.split('/').filter(Boolean);

  const renderPublicPage = () => {
    if (path === '/' || path === '') {
      return <HomePage lotteries={state.lotteries} user={state.user} />;
    }
    if (path === '/home') {
      return <Navigate to="/" replace />;
    }
    if (path === '/games') return <GamesPage />;
    if (path === '/lotteries') return <LotteriesPage lotteries={state.lotteries} />;
    if (path === '/results') return <ResultsPage lotteries={state.lotteries} />;
    if (path === '/check-numbers') {
      return (
        <CheckNumbersPage tickets={state.tickets} lotteries={state.lotteries} />
      );
    }
    if (path === '/login') {
      if (state.user) {
        return <Navigate to="/dashboard" replace />;
      }
      return <LoginPage onLogin={state.login} addToast={state.addToast} />;
    }
    if (path === '/signup') return <SignupPage />;
    if (path === '/forgot-password') return <ForgotPassword />;
    if (path === '/reset-password') return <ResetPassword />;
    if (path === '/email-verification') return <EmailVerification />;
    if (path === '/promos') return <PromosPage />;
    if (path === '/terms') return <TermsPage />;
    if (path === '/privacy') return <PrivacyPage />;
    if (path === '/responsible-gaming') {
      return (
        <ResponsibleGamingPage
          onSetLimit={state.setDepositLimit}
          onSelfExclude={state.selfExclude}
        />
      );
    }
    if (path === '/support') return <SupportPage />;
    return null;
  };

  const renderDashboardPage = () => {
    if (!state.user) return null;
    if (path === '/dashboard') {
      return (
        <DashboardPage
          user={state.user}
          tickets={state.tickets}
          transactions={state.transactions}
        />
      );
    }
    if (path === '/my-tickets') return <MyTicketsPage tickets={state.tickets} />;
    if (path === '/transactions') {
      return <TransactionsPage transactions={state.transactions} />;
    }
    if (path === '/wallet') {
      return (
        <WalletPage
          user={state.user}
          transactions={state.transactions}
          onAddFunds={state.addFunds}
          onWithdraw={state.withdrawFunds}
        />
      );
    }
    if (path === '/profile') {
      return (
        <ProfilePage
          user={state.user}
          onUpdateProfile={state.updateProfile}
          onSetDepositLimit={state.setDepositLimit}
          onSelfExclude={state.selfExclude}
        />
      );
    }
    if (path === '/notifications') {
      return (
        <NotificationsPage
          notifications={state.notifications}
          onMarkRead={state.markNotificationRead}
          onMarkAllRead={state.markAllNotificationsRead}
          onClear={state.clearNotifications}
        />
      );
    }
    if (path === '/slots') return <SlotsPage />;
    if (path === '/games/snakes-ladders' && !segments[3]) return <SnakesLaddersLobbyPage />;
    if (path.startsWith('/games/snakes-ladders/') && segments[2]) {
      return <SnakesLaddersPage />;
    }
    if (path === '/admin') {
      if (state.user.role !== 'admin') {
        return (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 animate-page-in">
            <Card className="max-w-lg mx-auto text-center py-12">
              <div className="w-16 h-16 bg-red-50 dark:bg-red-900/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                Access Denied
              </h2>
              <p className="text-gray-500 dark:text-slate-400 mb-6">
                You need admin privileges to access this page.
              </p>
              <Link to="/dashboard">
                <Button variant="primary">Go to Dashboard</Button>
              </Link>
            </Card>
          </div>
        );
      }
      return (
        <AdminDashboardPage
          lotteries={state.lotteries}
          transactions={state.transactions}
          onRunDraw={state.runDraw}
        />
      );
    }
    if (path === '/admin/create') {
      if (state.user.role !== 'admin') {
        return <Navigate to="/admin" replace />;
      }
      return <CreateLotteryPage onCreate={state.createLottery} />;
    }
    return null;
  };

  if (segments[0] === 'lottery' && segments[1]) {
    const lotteryId = segments[1];
    const lottery = state.lotteries.find((l) => l.id === lotteryId);
    if (!lottery) {
      return (
        <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
          <Navbar user={state.user} onLogout={state.logout} notifications={state.notifications} />
          <main className="flex-1">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16 animate-page-in">
              <Card className="max-w-lg mx-auto text-center py-12">
                <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎰</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  Lottery Not Found
                </h2>
                <p className="text-gray-500 dark:text-slate-400 mb-6">
                  The lottery you're looking for doesn't exist or has been removed.
                </p>
                <Link to="/lotteries">
                  <Button variant="primary">Browse Lotteries</Button>
                </Link>
              </Card>
            </div>
          </main>
          <Footer />
          <ToastContainer toasts={state.toasts} onRemove={state.removeToast} />
          <CookieConsent />
        </div>
      );
    }
    const userTickets = state.tickets.filter((t) => t.lotteryId === lottery.id);
    return (
      <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
        <Navbar user={state.user} onLogout={state.logout} notifications={state.notifications} />
        <main className="flex-1">
          <LotteryDetailPage
            lottery={lottery}
            user={state.user}
            userTickets={userTickets}
            onBuyTicket={state.buyTicket}
          />
        </main>
        <Footer />
        <ToastContainer toasts={state.toasts} onRemove={state.removeToast} />
        <CookieConsent />
      </div>
    );
  }

  if (path.startsWith('/org/')) {
    return (
      <OrgRoutes
        path={path}
        state={state}
        Navbar={Navbar}
        ToastContainer={ToastContainer}
      />
    );
  }

  if (isOnDashboard) {
    if (!state.user) return null;
    return (
      <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950 transition-colors duration-300">
        <Navbar
          user={state.user}
          onLogout={state.logout}
          notifications={state.notifications}
        />
        <main className="flex-1">
          {renderDashboardPage() || <NotFoundPage />}
        </main>
        <ToastContainer toasts={state.toasts} onRemove={state.removeToast} />
        <CookieConsent />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900 transition-colors duration-300">
      {!isLoginPage && (
        <Navbar
          user={state.user}
          onLogout={state.logout}
          notifications={state.notifications}
        />
      )}
      <main className="flex-1">{renderPublicPage() || <NotFoundPage />}</main>
      {!isLoginPage && <Footer />}
      <ToastContainer toasts={state.toasts} onRemove={state.removeToast} />
      <CookieConsent />
    </div>
  );
}

function OrgRoutes({
  path,
  state,
  Navbar,
  ToastContainer,
}: {
  path: string;
  state: ReturnType<typeof useAppStateAdapter>;
  Navbar: React.ComponentType<any>;
  ToastContainer: React.ComponentType<any>;
}) {
  const { user } = useAuth();
  if (!user || user.role !== 'org_admin') {
    return <Navigate to="/login" replace />;
  }
  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-slate-950">
      <Navbar
        user={state.user}
        onLogout={state.logout}
        notifications={state.notifications}
      />
      <main className="flex-1">
        {path === '/org/dashboard' && <AdminDashboardPage lotteries={state.lotteries} transactions={state.transactions} onRunDraw={state.runDraw} />}
        {path === '/org/draw' && <DrawExecutionPage />}
        {path === '/org/withdrawals' && <WithdrawalApprovalPage />}
        {path === '/org/lottery/create' && <CreateLotteryPage onCreate={state.createLottery} />}
        {path === '/org/profile' && (
          <ProfilePage
            user={state.user!}
            onUpdateProfile={state.updateProfile}
            onSetDepositLimit={state.setDepositLimit}
            onSelfExclude={state.selfExclude}
          />
        )}
        {!['/org/dashboard', '/org/draw', '/org/withdrawals', '/org/lottery/create', '/org/profile'].includes(path) && (
          <Navigate to="/org/dashboard" replace />
        )}
      </main>
      <ToastContainer toasts={state.toasts} onRemove={state.removeToast} />
      <CookieConsent />
    </div>
  );
}

function DrawResultsLayout() {
  const state = useAppStateAdapter();
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-900">
      <Navbar user={state.user} onLogout={state.logout} notifications={state.notifications} />
      <main className="flex-1">
        <DrawResultsPage />
      </main>
      <Footer />
      <ToastContainer toasts={state.toasts} onRemove={state.removeToast} />
      <CookieConsent />
    </div>
  );
}

export function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <WalletProvider>
          <LotteryProvider>
            <Routes>
              <Route path="/lottery/:id/results" element={<DrawResultsLayout />} />
              <Route path="*" element={<AppContent />} />
            </Routes>
          </LotteryProvider>
        </WalletProvider>
      </AuthProvider>
    </Router>
  );
}
