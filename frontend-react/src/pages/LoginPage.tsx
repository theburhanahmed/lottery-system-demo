import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User as UserIcon, Eye, EyeOff, Ticket } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
interface LoginPageProps {
  onLogin: (email: string, password: string, role?: 'user' | 'admin') => void;
  addToast: (msg: string, type: 'success' | 'error' | 'info') => void;
}
export function LoginPage({ onLogin, addToast }: LoginPageProps) {
  const navigate = useNavigate();
  const [tab, setTab] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email is required';else
    if (!/\S+@\S+\.\S+/.test(email)) errs.email = 'Invalid email address';
    if (!password) errs.password = 'Password is required';else
    if (password.length < 6)
    errs.password = 'Password must be at least 6 characters';
    if (tab === 'register') {
      if (!name.trim()) errs.name = 'Name is required';
      if (password !== confirmPassword)
      errs.confirmPassword = 'Passwords do not match';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      const role = email.includes('admin') ? 'admin' : 'user';
      await onLogin(email, password, role);
      navigate('/dashboard');
    } catch {
      // Error handled by addToast in adapter
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 bg-gray-50 animate-page-in">
      <Card className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-green-700 rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Ticket size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900">
            {tab === 'login' ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {tab === 'login' ?
            'Sign in to your account' :
            'Join 49flashmoney today'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
          {(['login', 'register'] as const).map((t) =>
          <button
            key={t}
            onClick={() => {
              setTab(t);
              setErrors({});
            }}
            className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${tab === t ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}>

              {t === 'login' ? 'Log In' : 'Register'}
            </button>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {tab === 'register' &&
          <Input
            label="Full Name"
            value={name}
            onChange={setName}
            placeholder="John Doe"
            error={errors.name}
            icon={<UserIcon size={16} />} />

          }
          <Input
            label="Email Address"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            error={errors.email}
            icon={<Mail size={16} />} />

          <div className="relative">
            <Input
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={setPassword}
              placeholder="••••••••"
              error={errors.password}
              icon={<Lock size={16} />} />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[2.1rem] text-gray-400 hover:text-gray-600">

              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {tab === 'register' &&
          <Input
            label="Confirm Password"
            type="password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            placeholder="••••••••"
            error={errors.confirmPassword}
            icon={<Lock size={16} />} />

          }

          {tab === 'login' &&
          <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-600 cursor-pointer">
                <input
                type="checkbox"
                className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />

                Remember me
              </label>
              <Link
              to="/forgot-password"
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">

                Forgot password?
              </Link>
            </div>
          }

          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            loading={loading}>

            {tab === 'login' ? 'Sign In' : 'Create Account'}
          </Button>
        </form>

        {/* Divider */}
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-200" />
          </div>
          <div className="relative flex justify-center">
            <span className="bg-white px-3 text-sm text-gray-400">
              or continue with
            </span>
          </div>
        </div>

        {/* Google */}
        <button
          onClick={() => addToast('Google sign-in coming soon!', 'info')}
          className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">

          <svg width="18" height="18" viewBox="0 0 24 24">
            <path
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              fill="#4285F4" />

            <path
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              fill="#34A853" />

            <path
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              fill="#FBBC05" />

            <path
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              fill="#EA4335" />

          </svg>
          Continue with Google
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          By continuing, you agree to our Terms of Service and Privacy Policy.
        </p>
      </Card>
    </div>);

}