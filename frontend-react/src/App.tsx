import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { WalletProvider } from './contexts/WalletContext';
import { LotteryProvider } from './contexts/LotteryContext';
import { Layout } from './components/layout/Layout';
import { AnalyticsTracker } from './components/AnalyticsTracker';
import { Analytics } from '@vercel/analytics/react';

// Lazy-loaded pages for code splitting
const LandingPage = lazy(() => import('./pages/LandingPage').then(m => ({ default: m.LandingPage })));
const LoginPage = lazy(() => import('./pages/LoginPage').then(m => ({ default: m.LoginPage })));
const SignupPage = lazy(() => import('./pages/SignupPage').then(m => ({ default: m.SignupPage })));
const EmailVerification = lazy(() => import('./pages/EmailVerification').then(m => ({ default: m.EmailVerification })));
const ForgotPassword = lazy(() => import('./pages/ForgotPassword').then(m => ({ default: m.ForgotPassword })));
const ResetPassword = lazy(() => import('./pages/ResetPassword').then(m => ({ default: m.ResetPassword })));
const UserDashboard = lazy(() => import('./pages/UserDashboard').then(m => ({ default: m.UserDashboard })));
const OrgDashboard = lazy(() => import('./pages/OrgDashboard').then(m => ({ default: m.OrgDashboard })));
const CreateLottery = lazy(() => import('./pages/CreateLottery').then(m => ({ default: m.CreateLottery })));
const WalletPage = lazy(() => import('./pages/WalletPage').then(m => ({ default: m.WalletPage })));
const LotteryDetails = lazy(() => import('./pages/LotteryDetails').then(m => ({ default: m.LotteryDetails })));
const ReferralDashboard = lazy(() => import('./pages/ReferralDashboard').then(m => ({ default: m.ReferralDashboard })));
const ProfilePage = lazy(() => import('./pages/ProfilePage').then(m => ({ default: m.ProfilePage })));
const SettingsPage = lazy(() => import('./pages/SettingsPage').then(m => ({ default: m.SettingsPage })));
const DrawResultsPage = lazy(() => import('./pages/DrawResultsPage').then(m => ({ default: m.DrawResultsPage })));
const WithdrawalApprovalPage = lazy(() => import('./pages/admin/WithdrawalApprovalPage').then(m => ({ default: m.WithdrawalApprovalPage })));
const DrawExecutionPage = lazy(() => import('./pages/admin/DrawExecutionPage').then(m => ({ default: m.DrawExecutionPage })));

function RouteFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-gold-500 mx-auto mb-4" />
        <p className="text-slate-600">Loading...</p>
      </div>
    </div>
  );
}

function ProtectedRoute({
  children,
  requiredRole
}: {
  children: React.ReactNode;
  requiredRole?: 'user' | 'org_admin';
}) {
  const { user, isLoading } = useAuth();
  if (isLoading) {
    return <RouteFallback />;
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
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AnalyticsTracker />
      <Analytics />
      <AuthProvider>
        <WalletProvider>
          <LotteryProvider>
            <Suspense fallback={<RouteFallback />}>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/email-verification" element={<EmailVerification />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/lottery/:id/results" element={<DrawResultsPage />} />

                <Route
                  path="/org/*"
                  element={
                    <ProtectedRoute requiredRole="org_admin">
                      <Layout>
                        <Suspense fallback={<RouteFallback />}>
                          <Routes>
                            <Route path="dashboard" element={<OrgDashboard />} />
                            <Route path="lottery/create" element={<CreateLottery />} />
                            <Route path="lottery/:id/results" element={<DrawResultsPage />} />
                            <Route path="draw" element={<DrawExecutionPage />} />
                            <Route path="withdrawals" element={<WithdrawalApprovalPage />} />
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="*" element={<Navigate to="dashboard" />} />
                          </Routes>
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />

                <Route
                  path="/*"
                  element={
                    <ProtectedRoute requiredRole="user">
                      <Layout>
                        <Suspense fallback={<RouteFallback />}>
                          <Routes>
                            <Route path="dashboard" element={<UserDashboard />} />
                            <Route path="wallet" element={<WalletPage />} />
                            <Route path="referrals" element={<ReferralDashboard />} />
                            <Route path="profile" element={<ProfilePage />} />
                            <Route path="settings" element={<SettingsPage />} />
                            <Route path="lottery/:id" element={<LotteryDetails />} />
                            <Route path="*" element={<Navigate to="dashboard" />} />
                          </Routes>
                        </Suspense>
                      </Layout>
                    </ProtectedRoute>
                  }
                />
              </Routes>
            </Suspense>
          </LotteryProvider>
        </WalletProvider>
      </AuthProvider>
    </Router>
  );
}
