import React, { useEffect, useState, createContext, useContext } from 'react';
import { User, UserRole } from '../types';
import { authService } from '../services/auth.service';
import { storage } from '../utils/storage';
import { RegisterRequest, ApiError } from '../types/api';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (username: string, password: string, role?: UserRole) => Promise<void>;
  register: (data: RegisterRequest) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  error: ApiError | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<ApiError | null>(null);

  // Check for existing session on mount
  useEffect(() => {
    const initializeAuth = async () => {
      const token = storage.getAccessToken();
      if (token) {
        try {
          const profile = await authService.getProfile();
          setUser(profile);
        } catch (err) {
          console.error('Failed to fetch user profile:', err);
          storage.clearTokens();
        }
      }
      setIsLoading(false);
    };
    initializeAuth();
  }, []);

  const login = async (username: string, password: string, role?: UserRole) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await authService.login({ username, password });
      // Transform backend user format to frontend format
      const userData = response.user;
      setUser({
        id: userData.id.toString(),
        email: userData.email,
        name: `${userData.first_name || ''} ${userData.last_name || ''}`.trim() || userData.username,
        role: userData.role === 'admin' ? 'org_admin' : 'user',
        walletBalance: parseFloat(userData.wallet_balance || 0),
        referralCode: userData.profile?.referral_code || '',
      });
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setIsLoading(true);
    setError(null);
    try {
      await authService.register(data);
      // After registration, user needs to verify email
      // Don't automatically log them in
    } catch (err) {
      setError(err as ApiError);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await authService.logout();
    } catch (err) {
      console.error('Logout error:', err);
    } finally {
      setUser(null);
      setIsLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const profile = await authService.getProfile();
      setUser(profile);
    } catch (err) {
      console.error('Failed to refresh user:', err);
      throw err;
    }
  };

  const clearError = () => {
    setError(null);
  };

  return <AuthContext.Provider value={{
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    refreshUser,
    error,
    clearError
  }}>
      {children}
    </AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

