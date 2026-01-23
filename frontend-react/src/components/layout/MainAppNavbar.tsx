import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { NavBar } from '../ui/tubelight-navbar';
import { 
  Ticket, 
  Wallet, 
  Gift, 
  User, 
  LayoutDashboard, 
  BarChart, 
  Settings,
  Home,
  LogIn,
  UserPlus
} from 'lucide-react';

export function MainAppNavbar() {
  const { user } = useAuth();

  const userItems = [
    { name: 'Dashboard', url: '/dashboard', icon: Ticket },
    { name: 'Wallet', url: '/wallet', icon: Wallet },
    { name: 'Referrals', url: '/referrals', icon: Gift },
    { name: 'Profile', url: '/profile', icon: User },
  ];

  const adminItems = [
    { name: 'Dashboard', url: '/org/dashboard', icon: LayoutDashboard },
    { name: 'Lotteries', url: '/org/lotteries', icon: Ticket },
    { name: 'Analytics', url: '/org/analytics', icon: BarChart },
    { name: 'Settings', url: '/settings', icon: Settings },
  ];

  const guestItems = [
    { name: 'Home', url: '/', icon: Home },
    { name: 'Login', url: '/login', icon: LogIn },
    { name: 'Sign Up', url: '/signup', icon: UserPlus },
  ];

  const items = user 
    ? (user.role === 'org_admin' ? adminItems : userItems)
    : guestItems;

  return <NavBar items={items} />;
}
