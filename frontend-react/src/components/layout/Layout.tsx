import React from 'react';
import { Navbar } from './Navbar';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, PlusCircle, Settings, Wallet, ArrowDownToLine, Zap } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Layout({
  children
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const location = useLocation();

  // Org Admin Sidebar Layout
  if (user?.role === 'org_admin') {
    const navItems = [
      { icon: LayoutDashboard, label: 'Dashboard', path: '/org/dashboard' },
      { icon: PlusCircle, label: 'Create Lottery', path: '/org/lottery/create' },
      { icon: Zap, label: 'Execute Draw', path: '/org/draw' },
      { icon: ArrowDownToLine, label: 'Withdrawals', path: '/org/withdrawals' },
      { icon: Settings, label: 'Settings', path: '/org/settings' }
    ];

    return <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 gap-8">
          <aside className="w-64 hidden md:block flex-shrink-0">
            <nav className="space-y-1 sticky top-24">
              {navItems.map(item => {
              const isActive = location.pathname === item.path;
              return <Link key={item.path} to={item.path} className={cn('flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors', isActive ? 'bg-brand-gold-50 text-brand-gold-700' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900')}>
                    <item.icon className={cn('mr-3 h-5 w-5', isActive ? 'text-brand-gold-600' : 'text-slate-400')} />
                    {item.label}
                  </Link>;
            })}
            </nav>
          </aside>
          <main className="flex-1 min-w-0">{children}</main>
        </div>
      </div>;
  }

  // Standard User Layout
  return <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      <main className="flex-grow">{children}</main>
      <footer className="bg-white border-t border-slate-200 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>
            &copy; {new Date().getFullYear()} 49FLASHMONEY. All rights reserved.
          </p>
          <p className="mt-2">
            Licensed and regulated. Please play responsibly.
          </p>
        </div>
      </footer>
    </div>;
}

