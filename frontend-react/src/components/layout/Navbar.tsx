import React, { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Ticket,
  Wallet,
  User,
  LogOut,
  Menu,
  X,
  Home,
  ArrowRightLeft,
  Shield,
  LayoutDashboard,
  BoxIcon,
  Bell,
  Settings,
  Trophy,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Plus,
  CreditCard,
  Check,
  Gamepad2 } from
'lucide-react';
import { Button } from '../ui/Button';
import type { AdapterUser as UserType, AdapterNotification } from '../../types/adapter';
import { useDarkMode } from '../../hooks/useDarkMode';
interface NavbarProps {
  user: UserType | null;
  onLogout: () => void;
  notifications?: AdapterNotification[];
}
export function Navbar({ user, onLogout, notifications = [] }: NavbarProps) {
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isDark, toggle } = useDarkMode();
  const unreadCount = notifications.filter((n) => !n.read).length;
  const [walletOpen, setWalletOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [gamesOpen, setGamesOpen] = useState(false);
  const walletRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const gamesRef = useRef<HTMLDivElement>(null);
  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
      walletRef.current &&
      !walletRef.current.contains(event.target as Node))
      {
        setWalletOpen(false);
      }
      if (
      notifRef.current &&
      !notifRef.current.contains(event.target as Node))
      {
        setNotifOpen(false);
      }
      if (
      profileRef.current &&
      !profileRef.current.contains(event.target as Node))
      {
        setProfileOpen(false);
      }
      if (
      gamesRef.current &&
      !gamesRef.current.contains(event.target as Node))
      {
        setGamesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  const isActive = (path: string) => {
    const current = location.pathname || '/';
    if (path === '/') return current === '/';
    return current.startsWith(path);
  };
  const navLinks = user
    ? [
        { href: '/', label: 'Home', icon: Home },
        { href: '/results', label: 'Results', icon: Trophy },
        { href: '/my-tickets', label: 'My Tickets', icon: Ticket },
        ...(user.role === 'admin' ? [{ href: '/admin', label: 'Admin', icon: Shield }] : []),
      ]
    : [];
  return (
    <nav className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2.5 group flex-shrink-0">

            <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-green-700 rounded-xl flex items-center justify-center shadow-md group-hover:shadow-lg transition-shadow">
              <Ticket size={18} className="text-white" />
            </div>
            <span className="text-lg font-extrabold text-gray-900 dark:text-white tracking-tight transition-colors">
              49
              <span className="text-emerald-600 dark:text-emerald-400">
                flash
              </span>
              money
            </span>
          </Link>

          {/* Desktop Nav */}
          {user &&
          <div className="hidden lg:flex items-center gap-0.5">
              <Link
              to="/"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/') ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10'}`}>

                <Home size={16} />
                Home
              </Link>

              {/* Games Dropdown */}
              <div className="relative" ref={gamesRef}>
                <button
                onClick={() => setGamesOpen(!gamesOpen)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/games') || isActive('/slots') || isActive('/lotteries') ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10'}`}>

                  <Gamepad2 size={16} />
                  Games
                  <ChevronDown
                  size={14}
                  className={`transition-transform duration-200 ${gamesOpen ? 'rotate-180' : ''}`} />

                </button>

                {gamesOpen &&
              <div className="absolute left-0 mt-2 w-48 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-scale-in z-50">
                    <div className="p-1">
                      <Link to="/lotteries" onClick={() => setGamesOpen(false)}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left">
                          <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                            <BoxIcon size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              Lottery
                            </p>
                          </div>
                        </button>
                      </Link>
                      <Link to="/slots" onClick={() => setGamesOpen(false)}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left">
                          <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
                            <Gamepad2 size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              Slots
                            </p>
                            <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-bold ml-2">
                              NEW
                            </span>
                          </div>
                        </button>
                      </Link>
                      <Link to="/games/snakes-ladders" onClick={() => setGamesOpen(false)}>
                        <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left">
                          <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                            <Trophy size={16} />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900 dark:text-white">
                              Snakes & Ladders
                            </p>
                          </div>
                        </button>
                      </Link>
                    </div>
                  </div>
              }
              </div>

              <Link
              to="/results"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/results') ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10'}`}>

                <Trophy size={16} />
                Results
              </Link>
              <Link
              to="/my-tickets"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/my-tickets') ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10'}`}>

                <Ticket size={16} />
                My Tickets
              </Link>
              {user.role === 'admin' &&
            <Link
              to="/admin"
              className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive('/admin') ? 'text-emerald-700 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400' : 'text-gray-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 hover:bg-emerald-50/60 dark:hover:bg-emerald-900/10'}`}>

                  <Shield size={16} />
                  Admin
                </Link>
            }
            </div>
          }

          {/* Right side */}
          <div className="flex items-center gap-2">
            <button
              onClick={toggle}
              className="p-2 rounded-lg text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-slate-800 dark:hover:text-yellow-400 transition-colors"
              title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}>

              {isDark ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            {user ?
            <>
                {/* Wallet Dropdown */}
                <div className="relative hidden sm:block" ref={walletRef}>
                  <button
                  onClick={() => setWalletOpen(!walletOpen)}
                  className="flex items-center gap-1.5 bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 px-3.5 py-1.5 rounded-full text-sm font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors border border-emerald-100 dark:border-emerald-800">

                    <Wallet size={14} />${user.walletBalance.toLocaleString()}
                  </button>

                  {walletOpen &&
                <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-scale-in z-50">
                      <div className="p-4 bg-gradient-to-br from-emerald-500 to-green-600 text-white">
                        <p className="text-xs font-medium text-emerald-100 mb-1">
                          Total Balance
                        </p>
                        <p className="text-2xl font-bold">
                          ${user.walletBalance.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-2">
                        <Link to="/wallet" onClick={() => setWalletOpen(false)}>
                          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left">
                            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                              <Plus size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                Add Funds
                              </p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                Top up your wallet
                              </p>
                            </div>
                          </button>
                        </Link>
                        <Link
                      to="/transactions"
                      onClick={() => setWalletOpen(false)}>

                          <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors text-left">
                            <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <ArrowRightLeft size={16} />
                            </div>
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">
                                Transactions
                              </p>
                              <p className="text-xs text-gray-500 dark:text-slate-400">
                                View history
                              </p>
                            </div>
                          </button>
                        </Link>
                      </div>
                      <div className="p-2 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                        <Link
                      to="/wallet"
                      onClick={() => setWalletOpen(false)}
                      className="block text-center text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">

                          Go to Wallet Page
                        </Link>
                      </div>
                    </div>
                }
                </div>

                {/* Notifications Dropdown */}
                <div className="relative" ref={notifRef}>
                  <button
                  onClick={() => setNotifOpen(!notifOpen)}
                  className="relative p-2 rounded-lg text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-slate-800 dark:hover:text-emerald-400 transition-colors">

                    <Bell size={20} />
                    {unreadCount > 0 &&
                  <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
                  }
                  </button>

                  {notifOpen &&
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-scale-in z-50">
                      <div className="p-3 border-b border-gray-100 dark:border-slate-800 flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">
                          Notifications
                        </h3>
                        {unreadCount > 0 &&
                    <span className="bg-red-100 text-red-600 text-xs font-bold px-2 py-0.5 rounded-full">
                            {unreadCount} new
                          </span>
                    }
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length > 0 ?
                    notifications.slice(0, 5).map((notif) =>
                    <div
                      key={notif.id}
                      className={`p-3 border-b border-gray-50 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50 transition-colors ${!notif.read ? 'bg-emerald-50/30 dark:bg-emerald-900/10' : ''}`}>

                              <div className="flex gap-3">
                                <div
                          className={`w-2 h-2 mt-1.5 rounded-full flex-shrink-0 ${!notif.read ? 'bg-emerald-500' : 'bg-gray-300 dark:bg-slate-600'}`} />

                                <div>
                                  <p
                            className={`text-sm ${!notif.read ? 'font-semibold text-gray-900 dark:text-white' : 'text-gray-600 dark:text-slate-400'}`}>

                                    {notif.title}
                                  </p>
                                  <p className="text-xs text-gray-500 dark:text-slate-500 line-clamp-2 mt-0.5">
                                    {notif.message}
                                  </p>
                                  <p className="text-[10px] text-gray-400 mt-1">
                                    {notif.date}
                                  </p>
                                </div>
                              </div>
                            </div>
                    ) :

                    <div className="p-8 text-center text-gray-500 dark:text-slate-400">
                            <Bell
                        size={24}
                        className="mx-auto mb-2 opacity-50" />

                            <p className="text-sm">No notifications yet</p>
                          </div>
                    }
                      </div>
                      <div className="p-2 border-t border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 text-center">
                        <Link
                      to="/notifications"
                      onClick={() => setNotifOpen(false)}
                      className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">

                          View All Notifications
                        </Link>
                      </div>
                    </div>
                }
                </div>

                {/* Profile Dropdown */}
                <div className="relative hidden lg:block" ref={profileRef}>
                  <button
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex items-center gap-1 ml-1 pl-2 border-l border-gray-200 dark:border-slate-700">

                    <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
                      <div className="w-8 h-8 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-full flex items-center justify-center">
                        <User
                        size={15}
                        className="text-emerald-700 dark:text-emerald-400" />

                      </div>
                      <span className="text-sm font-medium text-gray-700 dark:text-slate-200 max-w-[100px] truncate">
                        {user.name.split(' ')[0]}
                      </span>
                      <ChevronDown size={14} className="text-gray-400" />
                    </div>
                  </button>

                  {profileOpen &&
                <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-slate-900 rounded-xl shadow-xl border border-gray-100 dark:border-slate-800 overflow-hidden animate-scale-in z-50">
                      <div className="p-4 border-b border-gray-100 dark:border-slate-800">
                        <p className="font-semibold text-gray-900 dark:text-white truncate">
                          {user.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-slate-400 truncate">
                          {user.email}
                        </p>
                      </div>
                      <div className="p-1">
                        <Link
                      to="/profile"
                      onClick={() => setProfileOpen(false)}>

                          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-sm text-gray-700 dark:text-slate-300 transition-colors text-left">
                            <User size={16} />
                            My Profile
                          </button>
                        </Link>
                        <Link
                      to="/my-tickets"
                      onClick={() => setProfileOpen(false)}>

                          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-sm text-gray-700 dark:text-slate-300 transition-colors text-left">
                            <Ticket size={16} />
                            My Tickets
                          </button>
                        </Link>
                        <Link
                      to="/wallet"
                      onClick={() => setProfileOpen(false)}>

                          <button className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-800 text-sm text-gray-700 dark:text-slate-300 transition-colors text-left">
                            <Wallet size={16} />
                            Wallet
                          </button>
                        </Link>
                      </div>
                      <div className="p-1 border-t border-gray-100 dark:border-slate-800">
                        <button
                      onClick={() => {
                        onLogout();
                        setProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 text-sm text-red-600 dark:text-red-400 transition-colors text-left">

                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                }
                </div>

                <button
                onClick={() => setMobileOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">

                  <Menu
                  size={22}
                  className="text-gray-700 dark:text-slate-200" />

                </button>
              </> :

            <div className="flex items-center gap-2">
                <Link to="/login">
                  <Button variant="ghost" size="sm">
                    Log In
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button variant="primary" size="sm">
                    Register
                  </Button>
                </Link>
              </div>
            }
          </div>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen &&
      <div
        className="fixed inset-0 z-50 lg:hidden"
        style={{
          isolation: 'isolate'
        }}>

          <div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in"
          style={{
            zIndex: 1
          }}
          onClick={() => setMobileOpen(false)} />

          <div
          className="absolute right-0 top-0 bottom-0 w-72 shadow-2xl animate-slide-left bg-white dark:bg-slate-900 transition-colors duration-300"
          style={{
            zIndex: 2
          }}>

            <div className="flex items-center justify-between p-4 border-b border-gray-100 dark:border-slate-800">
              <span className="font-bold text-gray-900 dark:text-white">
                Menu
              </span>
              <button
              onClick={() => setMobileOpen(false)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">

                <X size={20} className="text-gray-600 dark:text-slate-400" />
              </button>
            </div>
            {user &&
          <div className="p-4 border-b border-gray-100 dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-100 to-green-100 dark:from-emerald-900 dark:to-green-900 rounded-full flex items-center justify-center">
                    <User
                  size={18}
                  className="text-emerald-700 dark:text-emerald-400" />

                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white text-sm">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-slate-400">
                      ${user.walletBalance.toLocaleString()} balance
                    </p>
                  </div>
                </div>
              </div>
          }
            <div className="p-2 space-y-0.5 overflow-y-auto max-h-[calc(100vh-140px)]">
              <Link
              to="/dashboard"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/dashboard') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-700 dark:hover:text-emerald-400'}`}>

                <LayoutDashboard size={18} />
                <span className="font-medium">Dashboard</span>
              </Link>

              {/* Mobile Games Links */}
              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider">
                Games
              </div>
              <Link
              to="/lotteries"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/lotteries') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-700 dark:hover:text-emerald-400'}`}>

                <BoxIcon size={18} />
                <span className="font-medium">Lotteries</span>
              </Link>
              <Link
              to="/slots"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/slots') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-700 dark:hover:text-emerald-400'}`}>

                <Gamepad2 size={18} />
                <span className="font-medium">Slots</span>
                <span className="text-[10px] bg-yellow-100 text-yellow-700 px-1.5 py-0.5 rounded-full font-bold ml-auto">
                  NEW
                </span>
              </Link>
              <Link
              to="/games/snakes-ladders"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/games/snakes-ladders') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-700 dark:hover:text-emerald-400'}`}>

                <Trophy size={18} />
                <span className="font-medium">Snakes & Ladders</span>
              </Link>

              <div className="px-4 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider mt-2">
                Account
              </div>
              <Link
              to="/profile"
              onClick={() => setMobileOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${isActive('/profile') ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400' : 'text-gray-700 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/10 hover:text-emerald-700 dark:hover:text-emerald-400'}`}>

                <Settings size={18} />
                <span className="font-medium">Settings</span>
              </Link>

              <hr className="my-2 border-gray-100 dark:border-slate-800" />
              <button
              onClick={() => {
                onLogout();
                setMobileOpen(false);
              }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 w-full transition-colors">

                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      }
    </nav>);

}