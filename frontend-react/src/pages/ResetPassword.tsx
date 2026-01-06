import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { PasswordStrength, validatePassword } from '../components/auth/PasswordStrength';
import { authService } from '../services/auth.service';
import { CheckCircle2, AlertCircle } from 'lucide-react';

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const token = searchParams.get('token');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setStatus('error');
      setMessage('Invalid reset token');
      return;
    }
    if (password !== confirmPassword) {
      setStatus('error');
      setMessage('Passwords do not match');
      return;
    }
    if (!validatePassword(password)) {
      setStatus('error');
      setMessage('Password does not meet requirements');
      return;
    }

    setIsLoading(true);
    setStatus('idle');
    try {
      const response = await authService.confirmPasswordReset(token, password);
      setStatus('success');
      setMessage(response.message || 'Password reset successfully!');
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Failed to reset password. The link may be expired.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!token) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-slate-900 mb-2">
              Invalid Reset Link
            </h2>
            <p className="text-slate-600 mb-6">
              This password reset link is invalid or has expired.
            </p>
            <Button onClick={() => navigate('/forgot-password')}>
              Request New Link
            </Button>
          </CardContent>
        </Card>
      </div>;
  }

  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src="https://cdn.magicpatterns.com/uploads/aRWamKBusTbYaXC3PiunuC/1000115406.jpg" alt="49FLASHMONEY" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Create New Password
          </CardTitle>
          <p className="text-sm text-slate-500">
            Enter your new password below
          </p>
        </CardHeader>

        <CardContent>
          {status === 'success' ? (
            <div className="text-center py-6 space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Password Reset!
              </h3>
              <p className="text-slate-600">{message}</p>
              <p className="text-sm text-slate-500">Redirecting to login...</p>
              <Button onClick={() => navigate('/login')} className="mt-4">
                Go to Login
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {status === 'error' && (
                <div className="flex items-start gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-800">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <span>{message}</span>
                </div>
              )}

              <div>
                <Input label="New Password" type="password" placeholder="Create a strong password" value={password} onChange={e => setPassword(e.target.value)} required autoFocus />
                <PasswordStrength password={password} />
              </div>

              <Input label="Confirm Password" type="password" placeholder="Re-enter your password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required />

              <Button type="submit" className="w-full" isLoading={isLoading}>
                Reset Password
              </Button>
            </form>
          )}
        </CardContent>
      </Card>
    </div>;
}

