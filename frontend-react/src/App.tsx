import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { LotteryProvider } from './contexts/LotteryContext';
import { Layout } from './components/layout/Layout';
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/LoginPage';
import { SignupPage } from './pages/SignupPage';
import { EmailVerification } from './pages/EmailVerification';
import { ForgotPassword } from './pages/ForgotPassword';
import { ResetPassword } from './pages/ResetPassword';
import { UserDashboard } from './pages/UserDashboard';
import { OrgDashboard } from './pages/OrgDashboard';
import { CreateLottery } from './pages/CreateLottery';
import { WalletPage } from './pages/WalletPage';
import { LotteryDetails } from './pages/LotteryDetails';
import { ReferralDashboard } from './pages/ReferralDashboard';
import { WithdrawalApprovalPage } from './pages/admin/WithdrawalApprovalPage';
import { DrawExecutionPage } from './pages/admin/DrawExecutionPage';
import { DrawResultsPage } from './pages/DrawResultsPage';

// Protected Route Wrapper
function ProtectedRoute({
  children,
  requiredRole
}: {
  children: React.ReactNode;
  requiredRole?: 'user' | 'org_admin';
}) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold-500 mx-auto mb-4"></div>
          <p className="text-slate-600">Loading...</p>
        </div>
      </div>;
  }
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to={user.role === 'org_admin' ? '/org/dashboard' : '/dashboard'} replace />;
  }
  return <>{children}</>;
}

export function App() {
  return <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AuthProvider>
        <WalletProvider>
          <LotteryProvider>
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
              <Route path="/email-verification" element={<EmailVerification />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Public Draw Results */}
              <Route path="/lottery/:id/results" element={<DrawResultsPage />} />

              {/* Org Admin Routes */}
              <Route path="/org/*" element={<ProtectedRoute requiredRole="org_admin">
                    <Layout>
                      <Routes>
                        <Route path="dashboard" element={<OrgDashboard />} />
                        <Route path="lottery/create" element={<CreateLottery />} />
                        <Route path="lottery/:id/results" element={<DrawResultsPage />} />
                        <Route path="draw" element={<DrawExecutionPage />} />
                        <Route path="withdrawals" element={<WithdrawalApprovalPage />} />
                        <Route path="*" element={<Navigate to="dashboard" />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>} />

              {/* User Routes */}
              <Route path="/*" element={<ProtectedRoute requiredRole="user">
                    <Layout>
                      <Routes>
                        <Route path="dashboard" element={<UserDashboard />} />
                        <Route path="wallet" element={<WalletPage />} />
                        <Route path="referrals" element={<ReferralDashboard />} />
                        <Route path="lottery/:id" element={<LotteryDetails />} />
                        <Route path="*" element={<Navigate to="dashboard" />} />
                      </Routes>
                    </Layout>
                  </ProtectedRoute>} />
            </Routes>
          </LotteryProvider>
        </WalletProvider>
      </AuthProvider>
    </Router>;
}

