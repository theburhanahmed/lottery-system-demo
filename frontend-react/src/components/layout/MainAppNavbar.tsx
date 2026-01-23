import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { NavBar } from '../ui/tubelight-navbar';
import { 
  Home, 
  Ticket, 
  Wallet, 
  Gift, 
  User, 
  LayoutDashboard, 
  PlusCircle, 
  Zap, 
  Settings 
} from 'lucide-react';

export function MainAppNavbar() {
  const { user } = useAuth();
  const location = useLocation();

  const navItems = useMemo(() => {
    if (!user) {
      return [
        { name: 'Home', url: '/', icon: Home },
        { name: 'Login', url: '/login', icon: User },
        { name: 'Sign Up', url: '/signup', icon: PlusCircle },
      ];
    }

    if (user.role === 'org_admin') {
      return [
        { name: 'Home', url: '/', icon: Home },
        { name: 'Dashboard', url: '/org/dashboard', icon: LayoutDashboard },
        { name: 'Create', url: '/org/lottery/create', icon: PlusCircle },
        { name: 'Draw', url: '/org/draw', icon: Zap },
        { name: 'Settings', url: '/org/settings', icon: Settings },
      ];
    }

    return [
      { name: 'Home', url: '/', icon: Home },
      { name: 'My Tickets', url: '/dashboard', icon: Ticket },
      { name: 'Wallet', url: '/wallet', icon: Wallet },
      { name: 'Referrals', url: '/referrals', icon: Gift },
      { name: 'Profile', url: '/profile', icon: User },
    ];
  }, [user]);

  // Map the items to include the active state based on the current path
  const items = navItems.map(item => ({
    ...item,
    active: location.pathname === item.url
  }));

  return <NavBar items={items} />;
}
