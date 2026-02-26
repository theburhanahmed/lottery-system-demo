import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Trophy,
  Ticket,
  Users,
  DollarSign,
  Shield,
  Zap,
  Award,
  ArrowRight,
  Star,
  Gamepad2 } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { LotteryCard } from '../components/LotteryCard';
import { Card } from '../components/ui/Card';
import type { AdapterLottery, AdapterUser } from '../types/adapter';
interface HomePageProps {
  lotteries: AdapterLottery[];
  user: AdapterUser | null;
}
export function HomePage({ lotteries, user }: HomePageProps) {
  const featured = lotteries.filter((l) => l.status === 'active').slice(0, 3);
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
  const handleDraw = () => {
    setDrawnNumbers([]);
    const numbers = [7, 14, 23, 31, 42];
    numbers.forEach((num, i) => {
      setTimeout(
        () => {
          setDrawnNumbers((prev) => [...prev, num]);
        },
        (i + 1) * 500
      );
    });
  };
  // Trigger draw animation on mount
  useEffect(() => {
    handleDraw();
  }, []);
  // Generate random coins for the rain effect
  const coins = Array.from({
    length: 20
  }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 3}s`
  }));
  const bouncingBalls = [
  {
    num: 5,
    color: 'bg-red-500',
    delay: '0s'
  },
  {
    num: 12,
    color: 'bg-blue-500',
    delay: '0.2s'
  },
  {
    num: 28,
    color: 'bg-green-500',
    delay: '0.4s'
  },
  {
    num: 33,
    color: 'bg-purple-500',
    delay: '0.1s'
  },
  {
    num: 45,
    color: 'bg-amber-500',
    delay: '0.3s'
  },
  {
    num: 8,
    color: 'bg-pink-500',
    delay: '0.5s'
  },
  {
    num: 19,
    color: 'bg-teal-500',
    delay: '0.2s'
  },
  {
    num: 36,
    color: 'bg-orange-500',
    delay: '0.6s'
  }];

  return (
    <div className="animate-page-in overflow-x-hidden">
      {/* Hero Section - Lottery Draw Machine */}
      <section className="relative bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 min-h-[800px] flex flex-col items-center justify-center overflow-hidden py-12">
        {/* Animated Background Lights */}
        <div className="absolute inset-0 overflow-hidden">
          {Array.from({
            length: 30
          }).map((_, i) =>
          <div
            key={i}
            className="absolute rounded-full bg-white opacity-20 animate-twinkle"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 4}px`,
              height: `${2 + Math.random() * 4}px`,
              animationDelay: `${Math.random() * 2}s`
            }} />

          )}
        </div>

        {/* Coin Rain */}
        <div className="absolute inset-0 pointer-events-none z-10">
          {coins.map((coin, i) =>
          <div
            key={i}
            className="absolute text-2xl animate-coin-fall opacity-0"
            style={{
              left: coin.left,
              animationDelay: coin.delay,
              animationDuration: coin.duration
            }}>

              🪙
            </div>
          )}
        </div>

        {/* Lottery Machine Frame */}
        <div className="relative z-20 w-full max-w-sm md:max-w-lg mx-auto px-4">
          <div className="bg-gradient-to-b from-yellow-400 via-amber-500 to-yellow-600 rounded-[2.5rem] p-2 shadow-2xl border-4 border-yellow-700 relative">
            {/* Decorative Lights around frame */}
            <div className="absolute inset-0 rounded-[2.3rem] border-[3px] border-dashed border-yellow-200/50 pointer-events-none"></div>

            {/* Machine Header */}
            <div className="text-center py-4 bg-gradient-to-b from-red-900 to-red-800 rounded-t-[2rem] border-b-4 border-yellow-600 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
              <h1 className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-200 via-yellow-400 to-yellow-600 drop-shadow-md tracking-wider relative z-10">
                49FLASH
              </h1>
              <div className="flex justify-center gap-1 mt-1">
                <Star size={12} className="text-yellow-300 animate-pulse" />
                <Star
                  size={12}
                  className="text-yellow-300 animate-pulse delay-75" />

                <Star
                  size={12}
                  className="text-yellow-300 animate-pulse delay-150" />

              </div>
            </div>

            {/* Jackpot Display */}
            <div className="bg-slate-900 p-3 grid grid-cols-3 gap-2 border-x-4 border-yellow-600">
              <div className="bg-gradient-to-b from-purple-900 to-purple-950 rounded border border-purple-500/50 p-1 text-center shadow-[0_0_10px_rgba(168,85,247,0.4)]">
                <div className="text-[10px] text-purple-300 font-bold uppercase tracking-wider">
                  Minor
                </div>
                <div className="text-sm font-mono font-bold text-white animate-pulse">
                  $200
                </div>
              </div>
              <div className="bg-gradient-to-b from-yellow-900 to-yellow-950 rounded border border-yellow-500/50 p-1 text-center shadow-[0_0_15px_rgba(234,179,8,0.5)] transform scale-110 z-10">
                <div className="text-[10px] text-yellow-300 font-bold uppercase tracking-wider">
                  Grand
                </div>
                <div className="text-base font-mono font-bold text-white animate-pulse">
                  $198k
                </div>
              </div>
              <div className="bg-gradient-to-b from-green-900 to-green-950 rounded border border-green-500/50 p-1 text-center shadow-[0_0_10px_rgba(34,197,94,0.4)]">
                <div className="text-[10px] text-green-300 font-bold uppercase tracking-wider">
                  Major
                </div>
                <div className="text-sm font-mono font-bold text-white animate-pulse">
                  $4k
                </div>
              </div>
            </div>

            {/* Lottery Drum Container */}
            <div className="bg-black p-4 border-x-4 border-yellow-600 relative h-64 flex flex-col items-center justify-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-black/60 pointer-events-none z-20"></div>

              {/* The Drum */}
              <div className="relative w-full h-full bg-white/10 backdrop-blur-sm border-2 border-yellow-500/30 rounded-[2rem] overflow-hidden flex items-center justify-center">
                {/* Bouncing Balls */}
                {bouncingBalls.map((ball, i) =>
                <div
                  key={i}
                  className={`absolute w-12 h-12 rounded-full ${ball.color} flex items-center justify-center shadow-lg animate-ball-tumble`}
                  style={{
                    animationDelay: ball.delay
                  }}>

                    <div className="w-8 h-8 bg-white/20 rounded-full absolute top-1 left-1 blur-[2px]"></div>
                    <span className="text-white font-bold text-lg drop-shadow-md">
                      {ball.num}
                    </span>
                  </div>
                )}
              </div>

              {/* Winning Numbers Display */}
              <div className="absolute bottom-4 left-0 w-full flex justify-center gap-2 z-30 px-2">
                {drawnNumbers.map((num, i) =>
                <div
                  key={i}
                  className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-xl border-2 border-white animate-ball-reveal">

                    <span className="text-white font-black text-sm drop-shadow-md">
                      {num}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Control Panel */}
            <div className="bg-gradient-to-b from-slate-800 to-slate-900 p-4 rounded-b-[2rem] border-t-4 border-yellow-600 flex items-center justify-between">
              <div className="flex flex-col gap-1">
                <div className="bg-black/50 px-2 py-1 rounded border border-slate-600">
                  <div className="text-[10px] text-slate-400 uppercase">
                    Numbers
                  </div>
                  <div className="text-xs font-mono text-yellow-400 font-bold text-center">
                    6
                  </div>
                </div>
                <div className="bg-black/50 px-2 py-1 rounded border border-slate-600">
                  <div className="text-[10px] text-slate-400 uppercase">
                    Picks
                  </div>
                  <div className="text-xs font-mono text-yellow-400 font-bold text-center">
                    1
                  </div>
                </div>
              </div>

              <div className="flex flex-col items-center">
                <div className="text-[10px] text-yellow-500 font-bold uppercase mb-1 tracking-widest">
                  Ticket Price
                </div>
                <div className="bg-black px-4 py-1 rounded border border-yellow-600/50 shadow-[0_0_10px_rgba(234,179,8,0.2)]">
                  <span className="text-xl font-mono font-bold text-white">
                    $1.00
                  </span>
                </div>
              </div>

              <button
                onClick={handleDraw}
                className="w-14 h-14 rounded-full bg-gradient-to-br from-green-500 to-emerald-700 border-4 border-green-900 shadow-[0_4px_0_rgb(20,83,45),0_5px_10px_rgba(0,0,0,0.5)] active:shadow-none active:translate-y-1 transition-all flex items-center justify-center group relative overflow-hidden">

                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-white/30 rounded-full"></div>
                <span className="font-bold text-white text-[10px] tracking-wider group-hover:scale-110 transition-transform z-10">
                  DRAW
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* CTA Area */}
        <div className="mt-12 text-center relative z-20 px-4">
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 drop-shadow-lg">
            Your Lucky Numbers Await!
          </h2>
          <p className="text-purple-200 mb-6 text-lg">
            Pick to Win Life-Changing Prizes!
          </p>

          <div className="flex flex-wrap justify-center gap-4 animate-spin-in">
            <Link to="/lotteries">
              <Button
                variant="gold"
                size="lg"
                className="shadow-[0_0_20px_rgba(234,179,8,0.4)] hover:shadow-[0_0_30px_rgba(234,179,8,0.6)] border-2 border-yellow-300">

                Browse Lotteries <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/slots">
              <Button
                variant="primary"
                size="lg"
                className="shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] border-2 border-purple-400 bg-gradient-to-r from-purple-600 to-indigo-600">

                Play Slots <Gamepad2 size={18} className="ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 -mt-8 relative z-30">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
          {
            icon: Ticket,
            label: 'Total Lotteries',
            value: '24',
            color: 'text-yellow-600 bg-yellow-50',
            delay: '0.5s'
          },
          {
            icon: Users,
            label: 'Tickets Sold',
            value: '12,450',
            color: 'text-purple-600 bg-purple-50',
            delay: '0.7s'
          },
          {
            icon: DollarSign,
            label: 'Prizes Won',
            value: '$2.4M',
            color: 'text-green-600 bg-green-50',
            delay: '0.9s'
          }].
          map((stat) =>
          <div
            key={stat.label}
            className="bg-white rounded-2xl shadow-xl p-5 flex items-center gap-4 animate-slide-up opacity-0 border border-gray-100"
            style={{
              animationDelay: stat.delay,
              animationFillMode: 'forwards'
            }}>

              <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}>

                <stat.icon size={22} />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-gray-900">
                  {stat.value}
                </p>
                <p className="text-sm text-gray-500">{stat.label}</p>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Featured Lotteries */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Star size={20} className="text-yellow-500 fill-yellow-500" />
              <span className="text-sm font-bold text-purple-600 uppercase tracking-wider">
                Hot Picks
              </span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-900">
              Featured Lotteries
            </h2>
            <p className="text-gray-500 mt-1">
              Don't miss your chance to hit the jackpot
            </p>
          </div>
          <Link to="/lotteries">
            <Button
              variant="ghost"
              size="sm"
              className="text-purple-600 hover:text-purple-700 hover:bg-purple-50">

              View All <ArrowRight size={16} />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map((lottery) =>
          <LotteryCard key={lottery.id} lottery={lottery} />
          )}
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-slate-50 py-16 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <h2 className="text-3xl font-black text-gray-900 text-center mb-10">
            Why Choose <span className="text-purple-600">49flashmoney</span>?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
              icon: Shield,
              title: 'Secure & Safe',
              desc: 'SSL encrypted transactions and verified fair draws. Your money and data are always protected.',
              color: 'text-emerald-600 bg-emerald-50'
            },
            {
              icon: Zap,
              title: 'Instant Payouts',
              desc: 'Winnings are credited to your wallet instantly. Withdraw anytime with no hidden fees.',
              color: 'text-yellow-600 bg-yellow-50'
            },
            {
              icon: Award,
              title: 'Licensed & Fair',
              desc: 'Fully licensed and regulated. Every draw is transparent and independently verified.',
              color: 'text-purple-600 bg-purple-50'
            }].
            map((item) =>
            <Card
              key={item.title}
              className="text-center hover:shadow-lg transition-shadow border-none shadow-md">

                <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${item.color}`}>

                  <item.icon size={32} />
                </div>
                <h3 className="font-bold text-gray-900 text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-gray-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="bg-gradient-to-r from-indigo-900 via-purple-800 to-indigo-900 rounded-3xl p-8 md:p-16 text-center relative overflow-hidden shadow-2xl">
          {/* Background decoration */}
          <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent opacity-50"></div>

          <div className="relative z-10">
            <Trophy
              size={64}
              className="text-yellow-400 mx-auto mb-6 drop-shadow-[0_0_15px_rgba(250,204,21,0.5)]" />

            <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
              Ready to Win Big?
            </h2>
            <p className="text-purple-200 mb-8 max-w-lg mx-auto text-lg">
              Join thousands of winners today. Your next big win is just a spin
              away.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/lotteries">
                <Button
                  variant="gold"
                  size="lg"
                  className="px-8 py-4 text-lg shadow-lg shadow-yellow-900/20">

                  Browse Lotteries
                </Button>
              </Link>
              {!user &&
              <Link to="/login">
                  <Button
                  variant="outline"
                  size="lg"
                  className="px-8 py-4 text-lg !border-white/30 !text-white hover:!bg-white/10">

                    Sign Up Free
                  </Button>
                </Link>
              }
            </div>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes ball-tumble {
          0% { transform: translate(0, 0) rotate(0deg); }
          25% { transform: translate(10px, -15px) rotate(90deg); }
          50% { transform: translate(-5px, 5px) rotate(180deg); }
          75% { transform: translate(8px, -10px) rotate(270deg); }
          100% { transform: translate(0, 0) rotate(360deg); }
        }
        @keyframes ball-reveal {
          from { transform: scale(0) rotate(-180deg); opacity: 0; }
          to { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes coin-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.2; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.2); }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes spin-in {
          from { transform: rotateX(90deg); opacity: 0; }
          to { transform: rotateX(0); opacity: 1; }
        }
        .animate-ball-tumble {
          animation: ball-tumble 3s ease-in-out infinite;
        }
        .animate-ball-reveal {
          animation: ball-reveal 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-coin-fall {
          animation: coin-fall linear infinite;
        }
        .animate-twinkle {
          animation: twinkle ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
        }
        .animate-spin-in {
          animation: spin-in 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
      `}</style>
    </div>);

}