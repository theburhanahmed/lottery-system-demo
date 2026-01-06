import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/Card';
import { PasswordStrength, validatePassword } from '../components/auth/PasswordStrength';
import { AlertCircle } from 'lucide-react';

export function SignupPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
  });
  const { register, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!validatePassword(formData.password)) {
      alert('Password does not meet requirements');
      return;
    }
    try {
      await register({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        name: formData.name,
        dateOfBirth: formData.dateOfBirth,
      });
      navigate('/email-verification');
    } catch (err) {
      console.error('Registration error:', err);
    }
  };

  return <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <img src="https://cdn.magicpatterns.com/uploads/aRWamKBusTbYaXC3PiunuC/1000115406.jpg" alt="49FLASHMONEY" className="h-16 w-auto" />
          </div>
          <CardTitle className="text-2xl font-bold text-slate-900">
            Create Your Account
          </CardTitle>
          <p className="text-sm text-slate-500">Join thousands of winners today</p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" name="name" placeholder="John Doe" value={formData.name} onChange={handleChange} required />
            <Input label="Email" name="email" type="email" placeholder="you@example.com" value={formData.email} onChange={handleChange} required />
            <Input label="Date of Birth" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} required />
            <div>
              <Input label="Password" name="password" type="password" placeholder="Create a strong password" value={formData.password} onChange={handleChange} required />
              <PasswordStrength password={formData.password} />
            </div>
            <Input label="Confirm Password" name="confirmPassword" type="password" placeholder="Re-enter your password" value={formData.confirmPassword} onChange={handleChange} required />

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Create Account
            </Button>
          </form>
        </CardContent>
        <CardFooter className="justify-center border-t border-slate-100 pt-4">
          <p className="text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-brand-gold-600 hover:underline font-semibold">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>;
}

