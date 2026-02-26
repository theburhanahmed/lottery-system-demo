import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Gift,
  RotateCcw,
  TrendingUp,
  Copy,
  Check,
  Trophy,
  Star,
  Music,
  Gem,
  DollarSign,
  ArrowRight } from
'lucide-react';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
export function PromosPage() {
  const [copied, setCopied] = useState(false);
  const [drawnBalls, setDrawnBalls] = useState<number[]>([]);
  useEffect(() => {
    // Auto-draw on mount
    const numbers = [5, 12, 28, 33, 45];
    numbers.forEach((num, i) => {
      setTimeout(
        () => {
          setDrawnBalls((prev) => [...prev, num]);
        },
        (i + 1) * 800
      );
    });
  }, []);
  const handleCopy = () => {
    navigator.clipboard.writeText('https://49flashmoney.com/ref/USER123');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  const winners = [
  {
    name: 'Sarah M.',
    prize: '$25,000',
    game: 'Mega Jackpot',
    color: 'bg-pink-100 text-pink-600'
  },
  {
    name: 'James K.',
    prize: '$5,200',
    game: 'Lucky 7s',
    color: 'bg-blue-100 text-blue-600'
  },
  {
    name: 'Elena R.',
    prize: '$12,500',
    game: 'Golden Fortune',
    color: 'bg-purple-100 text-purple-600'
  },
  {
    name: 'Mike T.',
    prize: '$1,000',
    game: 'Flash Draw',
    color: 'bg-green-100 text-green-600'
  },
  {
    name: 'David L.',
    prize: '$50,000',
    game: 'Diamond Rush',
    color: 'bg-yellow-100 text-yellow-600'
  },
  {
    name: 'Anna P.',
    prize: '$8,400',
    game: 'Weekly Classic',
    color: 'bg-indigo-100 text-indigo-600'
  },
  {
    name: 'Tom H.',
    prize: '$3,300',
    game: 'Lucky 7s',
    color: 'bg-red-100 text-red-600'
  },
  {
    name: 'Lisa B.',
    prize: '$15,000',
    game: 'Mega Jackpot',
    color: 'bg-teal-100 text-teal-600'
  }];

  // Generate random particles for hero background
  const particles = Array.from({
    length: 30
  }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    color: ['#fbbf24', '#a855f7', '#22c55e', '#ef4444'][
    Math.floor(Math.random() * 4)],

    delay: `${Math.random() * 5}s`,
    duration: `${3 + Math.random() * 4}s`
  }));
  // Generate coins for rain
  const coins = Array.from({
    length: 15
  }).map((_, i) => ({
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 2}s`,
    duration: `${2 + Math.random() * 3}s`
  }));
  const tumblingBalls = [
  {
    num: 3,
    color: 'bg-red-500',
    delay: '0s'
  },
  {
    num: 17,
    color: 'bg-blue-500',
    delay: '0.3s'
  },
  {
    num: 22,
    color: 'bg-green-500',
    delay: '0.6s'
  },
  {
    num: 41,
    color: 'bg-purple-500',
    delay: '0.2s'
  },
  {
    num: 9,
    color: 'bg-amber-500',
    delay: '0.5s'
  },
  {
    num: 36,
    color: 'bg-pink-500',
    delay: '0.1s'
  }];

  return (
    <div className="animate-page-in overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-b from-indigo-950 via-purple-900 to-slate-900 min-h-[600px] flex flex-col items-center justify-center overflow-hidden py-16 text-center px-4">
        {/* Animated Particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p, i) =>
          <div
            key={i}
            className="absolute rounded-full w-2 h-2 opacity-60 animate-particle-float"
            style={{
              left: p.left,
              top: p.top,
              backgroundColor: p.color,
              animationDelay: p.delay,
              animationDuration: p.duration
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

        <div className="relative z-20 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-black text-white mb-4 drop-shadow-[0_4px_0_rgba(0,0,0,0.5)] tracking-tight">
            Pick Your{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 via-amber-400 to-yellow-600">
              Lucky Numbers!
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-purple-200 mb-8 max-w-2xl mx-auto font-medium">
            Exclusive promotions, free tickets, and massive jackpots await!
          </p>
          <Button
            variant="gold"
            size="lg"
            className="text-lg px-8 py-4 rounded-full shadow-[0_0_30px_rgba(234,179,8,0.6)] animate-pulse-glow border-2 border-yellow-200 transform hover:scale-105 transition-transform">

            Claim Free Tickets 🎟️
          </Button>
        </div>
      </section>

      {/* LIVE DRAW PREVIEW SECTION */}
      <section className="py-16 bg-slate-900 relative -mt-10 z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="relative w-full max-w-md md:max-w-lg mx-auto">
            {/* Machine Frame */}
            <div className="bg-gradient-to-b from-yellow-400 via-amber-500 to-yellow-600 rounded-[2rem] p-3 shadow-2xl border-4 border-yellow-800 relative">
              {/* Decorative Lights */}
              <div className="absolute inset-0 rounded-[1.8rem] border-[3px] border-dashed border-yellow-200/40 pointer-events-none animate-marquee-lights"></div>

              <div className="bg-slate-900 p-6 rounded-[1.5rem] border-4 border-yellow-700 relative overflow-hidden">
                <div className="text-center mb-4">
                  <h2 className="text-2xl font-black text-white flex items-center justify-center gap-2">
                    🎱 Live Lottery Draw
                  </h2>
                </div>

                {/* Drum Visual */}
                <div className="relative h-48 bg-white/5 rounded-2xl border border-white/10 mb-6 overflow-hidden flex items-center justify-center">
                  {tumblingBalls.map((ball, i) =>
                  <div
                    key={i}
                    className={`absolute w-10 h-10 rounded-full ${ball.color} flex items-center justify-center shadow-lg animate-ball-tumble`}
                    style={{
                      animationDelay: ball.delay
                    }}>

                      <span className="text-white font-bold text-sm">
                        {ball.num}
                      </span>
                    </div>
                  )}
                </div>

                {/* Drawn Balls */}
                <div className="flex justify-center gap-2 mb-4 h-12">
                  {drawnBalls.map((num, i) =>
                  <div
                    key={i}
                    className="w-10 h-10 rounded-full bg-gradient-to-br from-yellow-400 to-amber-500 flex items-center justify-center shadow-md border-2 border-white animate-ball-reveal">

                      <span className="text-white font-black text-sm">
                        {num}
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">
                    Next Draw In:
                  </p>
                  <p className="text-xl font-mono font-bold text-emerald-400">
                    00:04:32
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* BONUS EXPLOSIONS SECTION */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-2">
              💥 Explosive Bonuses
            </h2>
            <p className="text-gray-500">
              Claim these limited-time offers before they expire!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
            {
              title: 'Welcome Bonus',
              desc: '100% match up to $500 on your first deposit.',
              icon: Gift,
              color: 'bg-pink-50 text-pink-600'
            },
            {
              title: 'Daily Free Tickets',
              desc: 'Get 10 free lottery tickets every day you log in.',
              icon: RotateCcw,
              color: 'bg-blue-50 text-blue-600'
            },
            {
              title: 'Cashback Rewards',
              desc: 'Earn 10% weekly cashback on all your plays.',
              icon: TrendingUp,
              color: 'bg-green-50 text-green-600'
            }].
            map((promo, i) =>
            <Card
              key={i}
              className="text-center p-8 hover:scale-105 transition-transform duration-300 group relative overflow-hidden border-2 border-transparent hover:border-yellow-400">

                <div
                className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 ${promo.color} group-hover:animate-bounce`}>

                  <promo.icon size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {promo.title}
                </h3>
                <p className="text-gray-500 mb-6">{promo.desc}</p>
                <Button
                variant="gold"
                className="w-full shadow-md group-hover:shadow-lg">

                  Claim Now
                </Button>
                {/* Hover particles */}
                <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="absolute top-10 left-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping"></div>
                  <div className="absolute bottom-10 right-10 w-2 h-2 bg-yellow-400 rounded-full animate-ping delay-100"></div>
                </div>
              </Card>
            )}
          </div>
        </div>
      </section>

      {/* REFERRAL SECTION */}
      <section className="py-16 bg-gradient-to-br from-purple-900 to-indigo-900 text-white relative overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              🎫 Refer Friends, Win Tickets!
            </h2>
            <p className="text-purple-200 max-w-2xl mx-auto text-lg">
              Share your referral link and earn free lottery tickets for every
              friend who joins.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 text-center">
            {[
            {
              step: '1',
              text: 'Share Link',
              delay: '0s'
            },
            {
              step: '2',
              text: 'Friend Joins',
              delay: '0.2s'
            },
            {
              step: '3',
              text: 'Both Win!',
              delay: '0.4s'
            }].
            map((item, i) =>
            <div key={i} className="flex flex-col items-center">
                <div
                className="text-6xl mb-4 animate-bounce-ticket"
                style={{
                  animationDelay: item.delay
                }}>

                  🎟️
                </div>
                <div className="w-8 h-8 rounded-full bg-yellow-400 text-yellow-900 font-bold flex items-center justify-center mb-2">
                  {item.step}
                </div>
                <h3 className="font-bold text-xl">{item.text}</h3>
              </div>
            )}
          </div>

          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20">
            <label className="block text-sm font-medium text-purple-200 mb-2">
              Your Referral Link
            </label>
            <div className="flex gap-2">
              <div className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-mono text-sm truncate">
                https://49flashmoney.com/ref/USER123
              </div>
              <Button
                variant="gold"
                onClick={handleCopy}
                className="min-w-[100px]">

                {copied ? <Check size={18} /> : <Copy size={18} />}
                {copied ? 'Copied!' : 'Copy'}
              </Button>
            </div>
            <div className="mt-4 flex justify-between text-xs text-purple-300 font-medium">
              <span>2,450 referrals this month</span>
              <span>$45,000 in referral rewards</span>
            </div>
          </div>
        </div>
      </section>

      {/* WINNER STORIES SECTION */}
      <section className="py-16 bg-slate-50 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900 text-center">
            🎉 Recent Winners
          </h2>
        </div>

        {/* Marquee Container */}
        <div className="relative w-full overflow-hidden">
          <div className="flex gap-6 animate-marquee-scroll w-max px-4">
            {[...winners, ...winners].map((winner, i) =>
            <div
              key={i}
              className="w-72 bg-white rounded-2xl p-5 shadow-md border border-gray-100 flex-shrink-0 relative overflow-hidden">

                {/* Confetti dots inside card */}
                <div className="absolute top-2 right-2 text-xl animate-pulse">
                  🎊
                </div>
                <div className="absolute bottom-2 left-2 w-2 h-2 bg-red-400 rounded-full"></div>
                <div className="absolute top-1/2 right-4 w-2 h-2 bg-blue-400 rounded-full"></div>

                <div className="flex items-center gap-4 mb-3">
                  <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-lg ${winner.color}`}>

                    {winner.name.
                  split(' ').
                  map((n) => n[0]).
                  join('')}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{winner.name}</h4>
                    <p className="text-xs text-gray-500">{winner.game}</p>
                  </div>
                </div>
                <div className="bg-yellow-50 rounded-xl p-3 text-center border border-yellow-100">
                  <p className="text-xs text-yellow-700 font-semibold uppercase tracking-wider mb-1">
                    Won
                  </p>
                  <p className="text-2xl font-black text-yellow-600">
                    {winner.prize}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-20 bg-gradient-to-r from-purple-600 to-amber-500 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

        {/* Floating Emojis */}
        <div className="absolute top-10 left-10 text-4xl animate-bounce delay-700">
          🎱
        </div>
        <div className="absolute bottom-10 right-10 text-4xl animate-bounce delay-300">
          🍀
        </div>
        <div className="absolute top-20 right-20 text-3xl animate-bounce delay-500">
          💰
        </div>
        <div className="absolute bottom-20 left-20 text-3xl animate-bounce delay-100">
          🎲
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-4">
          <h2 className="text-3xl md:text-5xl font-black text-white mb-6 drop-shadow-md">
            Don't Miss Out — Start Winning Today!
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/lotteries">
              <Button
                variant="gold"
                size="lg"
                className="px-8 py-4 text-lg shadow-xl">

                Browse Lotteries
              </Button>
            </Link>
            <Link to="/login">
              <Button
                variant="outline"
                size="lg"
                className="px-8 py-4 text-lg !border-white !text-white hover:!bg-white/20 backdrop-blur-sm">

                Create Account
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <style>{`
        @keyframes particle-float {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(10px, -20px); }
        }
        @keyframes coin-fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 0; }
          20% { opacity: 1; }
          90% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes pulse-glow {
          0%, 100% { box-shadow: 0 0 20px rgba(234,179,8,0.5); transform: scale(1); }
          50% { box-shadow: 0 0 40px rgba(234,179,8,0.8); transform: scale(1.05); }
        }
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
        @keyframes bounce-ticket {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-particle-float {
          animation: particle-float 5s ease-in-out infinite;
        }
        .animate-coin-fall {
          animation: coin-fall linear infinite;
        }
        .animate-pulse-glow {
          animation: pulse-glow 2s infinite;
        }
        .animate-ball-tumble {
          animation: ball-tumble 3s ease-in-out infinite;
        }
        .animate-ball-reveal {
          animation: ball-reveal 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
        }
        .animate-bounce-ticket {
          animation: bounce-ticket 2s ease-in-out infinite;
        }
        .animate-marquee-scroll {
          animation: marquee-scroll 30s linear infinite;
        }
        .animate-marquee-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>);

}