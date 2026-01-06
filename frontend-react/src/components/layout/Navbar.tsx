import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useWallet } from '../../contexts/WalletContext';
import { Button } from '../ui/Button';
import { Ticket, User, Wallet, LogOut, Menu, X, Gift } from 'lucide-react';
import { cn } from '../../utils/cn';

export function Navbar() {
  const { user, logout } = useAuth();
  const { balance } = useWallet();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return <nav className="bg-white border-b border-slate-200 sticky top-0 z-40 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link to={user?.role === 'org_admin' ? '/org/dashboard' : '/dashboard'} className="flex-shrink-0 flex items-center">
              <img src="https://cdn.magicpatterns.com/uploads/aRWamKBusTbYaXC3PiunuC/1000115406.jpg" alt="49FLASHMONEY" className="h-10 w-auto" />
            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
            {user ? <>
                <div className="flex items-center px-4 py-2 bg-gradient-to-r from-brand-gold-50 to-brand-gold-100 rounded-full border border-brand-gold-200">
                  <Wallet className="h-4 w-4 text-brand-gold-600 mr-2" />
                  <span className="text-sm font-bold text-brand-gold-900 tabular-nums">
                    ${balance.toFixed(2)}
                  </span>
                </div>

                <Link to="/wallet">
                  <Button variant="ghost" size="sm">
                    Wallet
                  </Button>
                </Link>

                {user.role === 'user' && <>
                    <Link to="/dashboard">
                      <Button variant="ghost" size="sm">
                        My Tickets
                      </Button>
                    </Link>
                    <Link to="/referrals">
                      <Button variant="ghost" size="sm">
                        <Gift className="h-4 w-4 mr-1" />
                        Referrals
                      </Button>
                    </Link>
                  </>}

                <div className="h-6 w-px bg-slate-200 mx-2" />

                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium text-slate-700">
                    {user.name}
                  </span>
                  <Button variant="ghost" size="sm" onClick={handleLogout} title="Logout">
                    <LogOut className="h-4 w-4" />
                  </Button>
                </div>
              </> : <>
                <Link to="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button>Sign Up</Button>
                </Link>
              </>}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center sm:hidden">
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-gold-500">
              {isMenuOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && <div className="sm:hidden bg-white border-b border-slate-200">
          <div className="pt-2 pb-3 space-y-1 px-4">
            {user ? <>
                <div className="flex items-center justify-between py-2 border-b border-slate-100 mb-2">
                  <span className="text-sm font-medium text-slate-900">
                    {user.name}
                  </span>
                  <span className="text-sm font-bold text-brand-gold-600 tabular-nums">
                    ${balance.toFixed(2)}
                  </span>
                </div>
                <Link to="/wallet" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>
                  Wallet
                </Link>
                {user.role === 'user' && <>
                    <Link to="/dashboard" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>
                      My Tickets
                    </Link>
                    <Link to="/referrals" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>
                      <Gift className="inline h-4 w-4 mr-2" />
                      Referrals
                    </Link>
                  </>}
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-red-600 hover:text-red-700 hover:bg-red-50">
                  Sign Out
                </button>
              </> : <>
                <Link to="/login" className="block px-3 py-2 rounded-md text-base font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-50" onClick={() => setIsMenuOpen(false)}>
                  Login
                </Link>
                <Link to="/signup" className="block px-3 py-2 rounded-md text-base font-medium text-brand-gold-600 hover:text-brand-gold-700 hover:bg-brand-gold-50" onClick={() => setIsMenuOpen(false)}>
                  Sign Up
                </Link>
              </>}
          </div>
        </div>}
    </nav>;
}

