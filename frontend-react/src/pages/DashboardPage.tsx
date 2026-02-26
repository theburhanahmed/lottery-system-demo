import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Ticket,
  Trophy,
  DollarSign,
  TrendingUp,
  Wallet,
  ArrowRight,
  Clock,
  BoxIcon,
  Star,
  Gamepad2 } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { OnboardingTour } from '../components/OnboardingTour';
import type { AdapterUser, AdapterTicket as TicketType, AdapterTransaction } from '../types/adapter';
interface DashboardPageProps {
  user: AdapterUser;
  tickets: TicketType[];
  transactions: AdapterTransaction[];
}
export function DashboardPage({
  user,
  tickets,
  transactions
}: DashboardPageProps) {
  // --- Data Logic (Preserved) ---
  const totalTickets = tickets.length;
  const wins = tickets.filter((t) => t.status === 'won').length;
  const totalSpent = transactions.
  filter((t) => t.type === 'purchase').
  reduce((sum, t) => sum + Math.abs(t.amount), 0);
  const totalWon = transactions.
  filter((t) => t.type === 'winning').
  reduce((sum, t) => sum + t.amount, 0);
  const pendingTickets = tickets.filter((t) => t.status === 'pending');
  const recentTx = transactions.slice(0, 4);
  // Helper for donut charts
  const DonutChart = ({
    color,
    percent,
    delay




  }: {color: string;percent: number;delay: string;}) => {
    const radius = 16;
    const circumference = 2 * Math.PI * radius;
    const offset = circumference - percent / 100 * circumference;
    return (
      <div className="relative w-12 h-12 flex items-center justify-center">
        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            className="text-gray-100 dark:text-gray-800" />

          <circle
            cx="24"
            cy="24"
            r={radius}
            stroke="currentColor"
            strokeWidth="4"
            fill="transparent"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className={`${color} animate-ring-fill`}
            style={{
              animationDelay: delay
            }} />

        </svg>
        <div className="absolute inset-0 flex items-center justify-center animate-pulse-slow">
          <div
            className={`w-2 h-2 rounded-full ${color.replace('text-', 'bg-')}`} />

        </div>
      </div>);

  };
  const [showTour, setShowTour] = useState(
    () => !localStorage.getItem('onboarding_complete')
  );
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 animate-page-in overflow-x-hidden">
      {showTour && <OnboardingTour onComplete={() => setShowTour(false)} />}

      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-extrabold text-gray-900 dark:text-white">
          Dashboard
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Welcome back, {user.name.split(' ')[0]}!
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* 2. WALLET BALANCE - GLOWING COIN STACK */}
        <div className="lg:col-span-1">
          <div className="h-full bg-gradient-to-br from-emerald-600 to-green-800 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-300 border border-emerald-500/30">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-3xl -mr-10 -mt-10"></div>

            <div className="flex items-center gap-4 mb-6">
              {/* Coin Stack Animation */}
              <div className="relative w-14 h-14">
                <div
                  className="absolute bottom-0 left-0 text-3xl animate-float-coin"
                  style={{
                    animationDelay: '0s'
                  }}>

                  🪙
                </div>
                <div
                  className="absolute bottom-2 left-2 text-3xl animate-float-coin"
                  style={{
                    animationDelay: '0.5s'
                  }}>

                  🪙
                </div>
                <div
                  className="absolute bottom-4 left-1 text-3xl animate-float-coin"
                  style={{
                    animationDelay: '1s'
                  }}>

                  🪙
                </div>
                <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full animate-pulse-glow"></div>
              </div>
              <div>
                <p className="text-emerald-100 text-sm font-medium mb-1">
                  Available Balance
                </p>
                <p className="text-3xl font-extrabold text-white drop-shadow-sm">
                  ${user.walletBalance.toLocaleString()}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-xs text-emerald-200 mb-1">Total Deposited</p>
                <p className="font-bold text-lg">
                  $
                  {transactions.
                  filter((t) => t.type === 'deposit').
                  reduce((s, t) => s + t.amount, 0).
                  toLocaleString()}
                </p>
              </div>
              <div className="bg-black/20 rounded-xl p-3 backdrop-blur-sm border border-white/10">
                <p className="text-xs text-emerald-200 mb-1">Total Won</p>
                <p className="font-bold text-lg text-yellow-300">
                  ${totalWon.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 3. STATS CARDS WITH DONUT CHARTS */}
        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
          {
            label: 'Tickets',
            value: totalTickets,
            percent: Math.min(totalTickets, 100),
            color: 'text-blue-500',
            delay: '0s'
          },
          {
            label: 'Wins',
            value: wins,
            percent: totalTickets > 0 ? wins / totalTickets * 100 : 0,
            color: 'text-amber-500',
            delay: '0.2s'
          },
          {
            label: 'Spent',
            value: `$${(totalSpent / 1000).toFixed(1)}k`,
            percent: 65,
            color: 'text-red-500',
            delay: '0.4s'
          },
          {
            label: 'Won',
            value: `$${(totalWon / 1000).toFixed(1)}k`,
            percent: 40,
            color: 'text-emerald-500',
            delay: '0.6s'
          }].
          map((stat, i) =>
          <Card
            key={stat.label}
            className="flex flex-col items-center justify-center p-4 hover:scale-[1.03] transition-transform duration-200 border-b-4 border-transparent hover:border-b-emerald-500">

              <div className="mb-3">
                <DonutChart
                color={stat.color}
                percent={stat.percent}
                delay={stat.delay} />

              </div>
              <p className="text-2xl font-extrabold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </p>
              <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
                {stat.label}
              </p>
            </Card>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 4. QUICK ACTIONS - SLIDE-IN CARDS */}
        <Card className="lg:col-span-1 h-fit">
          <h2 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
            <Star size={18} className="text-yellow-500 fill-yellow-500" /> Quick
            Actions
          </h2>
          <div className="space-y-3">
            {[
            {
              to: '/slots',
              icon: Gamepad2,
              label: 'Play Slots',
              desc: 'Instant wins',
              color:
              'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
              delay: '0.1s'
            },
            {
              to: '/wallet',
              icon: Wallet,
              label: 'Add Funds',
              desc: 'Top up wallet',
              color:
              'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
              delay: '0.3s'
            },
            {
              to: '/lotteries',
              icon: BoxIcon,
              label: 'Browse Lotteries',
              desc: 'Find next win',
              color:
              'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
              delay: '0.5s'
            },
            {
              to: '/my-tickets',
              icon: Ticket,
              label: 'My Tickets',
              desc: 'View tickets',
              color:
              'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400',
              delay: '0.7s'
            }].
            map((action, i) =>
            <Link
              key={action.label}
              to={action.to}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 transition-all group border-l-4 border-transparent hover:border-l-yellow-400 animate-slide-in-left opacity-0"
              style={{
                animationDelay: action.delay,
                animationFillMode: 'forwards'
              }}>

                <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>

                  <action.icon
                  size={20}
                  className="group-hover:animate-bounce" />

                </div>
                <div className="flex-1">
                  <p className="font-bold text-gray-900 dark:text-white text-sm">
                    {action.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {action.desc}
                  </p>
                </div>
                <ArrowRight
                size={16}
                className="text-gray-300 dark:text-gray-600 group-hover:text-emerald-500 transition-colors transform group-hover:translate-x-1" />

              </Link>
            )}
          </div>
        </Card>

        {/* 5. RECENT ACTIVITY - CASINO STYLE */}
        <Card className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-gray-900 dark:text-white">
              Recent Activity
            </h2>
            <Link to="/transactions">
              <Button variant="ghost" size="sm">
                View All
              </Button>
            </Link>
          </div>
          <div className="space-y-3">
            {recentTx.map((tx, i) =>
            <div
              key={tx.id}
              className={`flex items-center justify-between py-3 px-3 rounded-lg border border-transparent hover:border-gray-100 dark:hover:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors animate-slide-in-right opacity-0 ${tx.type === 'winning' ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-100 dark:border-amber-900/30' : ''}`}
              style={{
                animationDelay: `${0.2 + i * 0.15}s`,
                animationFillMode: 'forwards'
              }}>

                <div className="flex items-center gap-3">
                  <div
                  className={`w-9 h-9 rounded-lg flex items-center justify-center shadow-sm ${tx.type === 'deposit' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400' : tx.type === 'winning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400' : 'bg-red-100 text-red-500 dark:bg-red-900/30 dark:text-red-400'}`}>

                    {tx.type === 'deposit' ?
                  <TrendingUp size={16} /> :
                  tx.type === 'winning' ?
                  <Trophy size={16} /> :

                  <Ticket size={16} />
                  }
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      {tx.description}
                      {tx.type === 'winning' &&
                    <span className="animate-pulse">🎉</span>
                    }
                    </p>
                    <p className="text-xs text-gray-400 flex items-center gap-1">
                      <Clock size={10} /> {tx.date}
                    </p>
                  </div>
                </div>
                <span
                className={`text-sm font-bold px-2 py-1 rounded-md ${tx.type === 'winning' ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 animate-pulse-slow' : tx.amount > 0 ? 'text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-900/30' : 'text-red-500 bg-red-50 dark:text-red-400 dark:bg-red-900/30'}`}>

                  {tx.amount > 0 ? '+' : ''}$
                  {Math.abs(tx.amount).toLocaleString()}
                </span>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* 6. UPCOMING DRAWS - TICKET CARDS */}
      {pendingTickets.length > 0 &&
      <div className="mt-8">
          <Card className="border-t-4 border-t-emerald-500">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Ticket size={20} className="text-emerald-600" /> Upcoming Draws
              </h2>
              <Link to="/my-tickets">
                <Button variant="ghost" size="sm">
                  All Tickets
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pendingTickets.slice(0, 3).map((ticket, i) =>
            <Link
              key={ticket.id}
              to={`/lottery/${ticket.lotteryId}`}
              className="flex items-center gap-3 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-md hover:border-emerald-300 dark:hover:border-emerald-700 transition-all group animate-slide-up opacity-0 relative overflow-hidden"
              style={{
                animationDelay: `${0.5 + i * 0.2}s`,
                animationFillMode: 'forwards'
              }}>

                  <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-emerald-50 dark:from-emerald-900/20 to-transparent rounded-bl-full -mr-8 -mt-8 group-hover:scale-150 transition-transform duration-500"></div>

                  <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center group-hover:rotate-12 transition-transform duration-300 relative z-10">
                    <Ticket
                  size={24}
                  className="text-emerald-600 dark:text-emerald-400" />

                  </div>
                  <div className="flex-1 min-w-0 relative z-10">
                    <p className="text-sm font-bold text-gray-900 dark:text-white truncate group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
                      {ticket.lotteryTitle}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400 font-mono bg-gray-100 dark:bg-gray-700 px-1.5 py-0.5 rounded">
                        {ticket.ticketNumber}
                      </span>
                      <Badge
                    variant="pending"
                    className="text-[10px] px-1.5 py-0">

                        Pending
                      </Badge>
                    </div>
                  </div>
                  <div className="relative z-10">
                    <Star
                  size={14}
                  className="text-yellow-400 fill-yellow-400 animate-spin-slow" />

                  </div>
                </Link>
            )}
            </div>
          </Card>
        </div>
      }

      <style>{`
        @keyframes float-coin {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-glow {
          0%, 100% { transform: scale(1); opacity: 0.5; }
          50% { transform: scale(1.1); opacity: 0.8; }
        }
        @keyframes ring-fill {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: var(--offset, 0); }
        }
        @keyframes slide-in-left {
          from { transform: translateX(-20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-in-right {
          from { transform: translateX(20px); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-float-coin {
          animation: float-coin 3s ease-in-out infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s ease-in-out infinite;
        }
        .animate-ring-fill {
          animation: ring-fill 1.5s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.5s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
    </div>);

}