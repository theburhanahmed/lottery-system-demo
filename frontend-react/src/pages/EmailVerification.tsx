import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { authService } from '../services/auth.service';
import { CheckCircle2, AlertCircle, Mail, Loader2 } from 'lucide-react';

export function EmailVerification() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error'>('verifying');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const token = searchParams.get('token');
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
      setMessage('No verification token provided');
    }
  }, [searchParams]);

  const verifyEmail = async (token: string) => {
    try {
      const response = await authService.verifyEmail(token);
      setStatus('success');
      setMessage(response.message || 'Email verified successfully!');
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (error: any) {
      setStatus('error');
      setMessage(error.message || 'Verification failed. The link may be expired or invalid.');
    }
  };

  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src="https://cdn.magicpatterns.com/uploads/aRWamKBusTbYaXC3PiunuC/1000115406.jpg" alt="49FLASHMONEY" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Email Verification
          </CardTitle>
        </CardHeader>

        <CardContent className="text-center py-8">
          {status === 'verifying' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-brand-gold-100 rounded-full flex items-center justify-center mx-auto">
                <Loader2 className="h-8 w-8 text-brand-gold-600 animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Verifying your email...
              </h3>
              <p className="text-slate-600">
                Please wait while we confirm your email address.
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="h-8 w-8 text-emerald-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Email Verified!
              </h3>
              <p className="text-slate-600">{message}</p>
              <p className="text-sm text-slate-500">Redirecting to login...</p>
              <Button onClick={() => navigate('/login')} className="mt-4">
                Go to Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
                <AlertCircle className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                Verification Failed
              </h3>
              <p className="text-slate-600">{message}</p>
              <div className="flex flex-col gap-3 mt-6">
                <Button onClick={() => navigate('/signup')}>
                  Create New Account
                </Button>
                <Button variant="outline" onClick={() => navigate('/login')}>
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>;
}

