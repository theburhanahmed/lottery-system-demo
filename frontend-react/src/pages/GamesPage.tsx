import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Gamepad2,
  Ticket,
  Star,
  Zap,
  Flame,
  Wand2,
  Trophy,
  Sparkles,
  Play,
  Dices,
  ThumbsUp,
  Heart } from
'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
// Static marketing list; playable slots are loaded from API on /slots
interface GameItem {
  id: number;
  name: string;
  emoji: string;
  plays: string;
  volatility: string;
  rtp: string;
  tag: string | null;
  colors: string;
  featured: boolean;
  freeSpins?: boolean;
  premium?: boolean;
}
const GAMES: GameItem[] = [
{
  id: 1,
  name: 'Cherry Blast',
  emoji: '🍒',
  plays: '2.4k',
  volatility: 'Medium',
  rtp: '96.5%',
  tag: 'HOT',
  colors: 'from-red-400 to-pink-500',
  featured: true,
  freeSpins: true
},
{
  id: 2,
  name: 'Lucky Jazz',
  emoji: '🎵',
  plays: '1.8k',
  volatility: 'High',
  rtp: '95.2%',
  tag: 'NEW',
  colors: 'from-purple-400 to-indigo-500',
  featured: true
},
{
  id: 3,
  name: 'Diamond Rush',
  emoji: '💎',
  plays: '3.1k',
  volatility: 'Low',
  rtp: '97.1%',
  tag: null,
  colors: 'from-cyan-400 to-blue-500',
  featured: false,
  premium: true
},
{
  id: 4,
  name: 'Gold Fever',
  emoji: '🥇',
  plays: '4.2k',
  volatility: 'High',
  rtp: '94.8%',
  tag: 'HOT',
  colors: 'from-yellow-400 to-amber-500',
  featured: true
},
{
  id: 5,
  name: 'Star Burst',
  emoji: '⭐',
  plays: '1.5k',
  volatility: 'Medium',
  rtp: '96.0%',
  tag: null,
  colors: 'from-yellow-300 to-orange-400',
  featured: false,
  freeSpins: true
},
{
  id: 6,
  name: 'Mega 7s',
  emoji: '7️⃣',
  plays: '5.6k',
  volatility: 'High',
  rtp: '95.5%',
  tag: 'POPULAR',
  colors: 'from-blue-400 to-indigo-600',
  featured: true
},
{
  id: 7,
  name: 'Trophy Hunt',
  emoji: '🏆',
  plays: '900',
  volatility: 'Low',
  rtp: '97.8%',
  tag: 'NEW',
  colors: 'from-amber-400 to-yellow-600',
  featured: false,
  premium: true
},
{
  id: 8,
  name: 'Candy Spin',
  emoji: '🍬',
  plays: '2.1k',
  volatility: 'Medium',
  rtp: '96.3%',
  tag: null,
  colors: 'from-pink-400 to-rose-500',
  featured: true,
  freeSpins: true
},
{
  id: 9,
  name: 'Jungle King',
  emoji: '🦁',
  plays: '3.3k',
  volatility: 'High',
  rtp: '95.0%',
  tag: 'WILD',
  colors: 'from-green-400 to-emerald-600',
  featured: false
},
{
  id: 10,
  name: 'Rocket Win',
  emoji: '🚀',
  plays: '1.2k',
  volatility: 'High',
  rtp: '96.8%',
  tag: null,
  colors: 'from-indigo-400 to-purple-600',
  featured: false
}];

const FILTERS = [
{
  id: 'all',
  label: 'All Games',
  icon: '🔥'
},
{
  id: 'high',
  label: 'High Volatility',
  icon: '🌶️'
},
{
  id: 'free',
  label: 'Free Spins',
  icon: '🪄'
},
{
  id: 'popular',
  label: 'Popular',
  icon: '⭐'
},
{
  id: 'new',
  label: 'New',
  icon: '🆕'
},
{
  id: 'premium',
  label: 'Premium',
  icon: '💎'
}];

export function GamesPage() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [jackpots, setJackpots] = useState({
    grand: 198432,
    major: 4210,
    minor: 205
  });
  // Ticking jackpots
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpots((prev) => ({
        grand: prev.grand + Math.floor(Math.random() * 5),
        major: prev.major + Math.floor(Math.random() * 2),
        minor: prev.minor + Math.floor(Math.random() * 1)
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, []);
  const filteredGames =
  activeFilter === 'all' ?
  GAMES :
  GAMES.filter((g) => {
    if (activeFilter === 'high') return g.volatility === 'High';
    if (activeFilter === 'popular') {
      const num = g.plays.includes('k') ? parseFloat(g.plays) * 1000 : parseInt(g.plays, 10);
      return num >= 3000;
    }
    if (activeFilter === 'new') return g.tag === 'NEW';
    if (activeFilter === 'free') return g.freeSpins === true;
    if (activeFilter === 'premium') return g.premium === true;
    return true;
  });
  const featuredGames = GAMES.filter((g) => g.featured);
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 via-purple-50 to-indigo-50 pb-20 overflow-x-hidden font-sans">
      {/* 1. NAV TABS */}
      <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-purple-100 py-3 px-4 shadow-sm">
        <div className="flex justify-center gap-4 max-w-md mx-auto">
          <Link
            to="/slots"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-bold shadow-lg transform scale-105 transition-transform hover:opacity-95"
          >
            <Gamepad2 size={18} />
            Slots
          </Link>
          <Link
            to="/games/snakes-ladders"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-gray-500 font-bold border border-gray-200 hover:bg-gray-50 transition-colors">
            <Dices size={18} />
            Snakes & Ladders
          </Link>
          <Link
            to="/lotteries"
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-white text-gray-500 font-bold border border-gray-200 hover:bg-gray-50 transition-colors">

            <Ticket size={18} />
            Lottery
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-8">
        {/* 2. HERO BANNER */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-500 p-6 md:p-10 text-white shadow-xl border-4 border-white/20">
          {/* Background decorations */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <div className="absolute top-10 left-10 text-4xl animate-float-slow opacity-50">
              ✨
            </div>
            <div className="absolute bottom-10 right-20 text-3xl animate-float-medium opacity-50">
              ⭐
            </div>
            <div className="absolute top-20 right-10 text-5xl animate-float-fast opacity-30">
              🎈
            </div>
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-yellow-400/30 rounded-full blur-3xl"></div>
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-pink-400/30 rounded-full blur-3xl"></div>
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <h1 className="text-4xl md:text-6xl font-black mb-2 animate-bounce-title drop-shadow-lg">
                SPIN & WIN!
              </h1>
              <p className="text-lg md:text-xl text-purple-100 font-medium mb-6 max-w-md">
                Try your luck on our wacky slot machines! Big prizes await! 🎰
              </p>

              <div className="flex flex-wrap justify-center md:justify-start gap-3">
                <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5 border border-yellow-400/50 flex items-center gap-2 animate-pulse-slow">
                  <span className="text-xs font-bold text-yellow-300 uppercase">
                    Grand
                  </span>
                  <span className="font-mono font-bold text-white">
                    ${jackpots.grand.toLocaleString()}
                  </span>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5 border border-green-400/50 flex items-center gap-2">
                  <span className="text-xs font-bold text-green-300 uppercase">
                    Major
                  </span>
                  <span className="font-mono font-bold text-white">
                    ${jackpots.major.toLocaleString()}
                  </span>
                </div>
                <div className="bg-black/30 backdrop-blur-sm rounded-full px-4 py-1.5 border border-blue-400/50 flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-300 uppercase">
                    Minor
                  </span>
                  <span className="font-mono font-bold text-white">
                    ${jackpots.minor.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>

            {/* Mini Slot Preview */}
            <div className="relative w-48 h-32 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-2xl p-2 shadow-2xl border-b-8 border-orange-700 transform rotate-3 hover:rotate-0 transition-transform duration-300">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 h-4 bg-red-600 rounded-t-lg"></div>
              <div className="h-full bg-white rounded-xl overflow-hidden flex items-center justify-center gap-1 p-1 border-4 border-yellow-200">
                {[0, 1, 2].map((i) =>
                <div
                  key={i}
                  className="flex-1 h-full bg-gray-100 rounded-lg overflow-hidden relative">

                    <div
                    className="absolute inset-0 flex flex-col items-center animate-slot-cycle"
                    style={{
                      animationDelay: `${i * 0.2}s`
                    }}>

                      <span className="text-3xl py-2">🍒</span>
                      <span className="text-3xl py-2">7️⃣</span>
                      <span className="text-3xl py-2">💎</span>
                      <span className="text-3xl py-2">🍒</span>
                    </div>
                  </div>
                )}
              </div>
              <div className="absolute -right-3 top-10 w-4 h-12 bg-red-600 rounded-r-lg border-l border-red-800 shadow-md"></div>
              <div className="absolute -right-3 top-8 w-6 h-6 bg-yellow-400 rounded-full shadow-sm"></div>
            </div>
          </div>
        </div>

        {/* 3. FILTER CHIPS */}
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
          {FILTERS.map((filter) =>
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={`
                flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-bold text-sm transition-all
                ${activeFilter === filter.id ? 'bg-gradient-to-r from-lime-400 to-yellow-400 text-slate-900 shadow-md scale-105 animate-bounce-subtle' : 'bg-white text-slate-600 hover:bg-gray-50 border border-gray-100 shadow-sm'}
              `}>

              <span>{filter.icon}</span>
              {filter.label}
            </button>
          )}
        </div>

        {/* 4. FEATURED CAROUSEL */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Star
              className="text-yellow-500 fill-yellow-500 animate-spin-slow"
              size={24} />

            <h2 className="text-2xl font-black text-slate-800">
              Featured Machines
            </h2>
          </div>

          <div className="flex gap-4 overflow-x-auto pb-6 pt-2 scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 snap-x">
            {featuredGames.map((game) =>
            <Link
              key={game.id}
              to="/slots"
              className="group relative flex-shrink-0 w-40 snap-center">

                <div
                className={`
                  h-48 rounded-2xl bg-gradient-to-br ${game.colors} p-4 flex flex-col items-center justify-center text-center
                  shadow-lg transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-2 group-hover:shadow-xl
                  border-4 border-white/20 relative overflow-hidden
                `}>

                  {/* Floating hearts on hover */}
                  <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="absolute bottom-4 left-1/4 text-xl animate-float-heart">
                      💕
                    </div>
                    <div
                    className="absolute bottom-8 right-1/4 text-lg animate-float-heart"
                    style={{
                      animationDelay: '0.2s'
                    }}>

                      💖
                    </div>
                  </div>

                  <div className="text-6xl mb-3 transform group-hover:scale-110 transition-transform duration-300 filter drop-shadow-md">
                    {game.emoji}
                  </div>
                  <h3 className="font-black text-white text-lg leading-tight drop-shadow-sm">
                    {game.name}
                  </h3>

                  {game.tag &&
                <div className="absolute top-2 right-2">
                      <Badge
                    variant={game.tag === 'HOT' ? 'active' : 'won'}
                    className="text-[10px] px-1.5 py-0 shadow-sm">

                        {game.tag}
                      </Badge>
                    </div>
                }
                </div>
              </Link>
            )}
          </div>
        </div>

        {/* 5. TOP GAMES GRID */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 px-1">
            <Trophy className="text-amber-500 fill-amber-500" size={24} />
            <h2 className="text-2xl font-black text-slate-800">Top Games</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGames.map((game, i) =>
            <Card
              key={game.id}
              className="group overflow-hidden border-2 border-transparent hover:border-purple-200 transition-all duration-300 animate-slide-up"
              padding={false}
              hover>

                <Link to="/slots" className="block h-full flex flex-col">
                  {/* Card Header */}
                  <div
                  className={`h-32 bg-gradient-to-br ${game.colors} relative flex items-center justify-center overflow-hidden`}>

                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                    <div className="text-6xl transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-300 filter drop-shadow-lg">
                      {game.emoji}
                    </div>

                    {/* Floating hearts on hover */}
                    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="absolute bottom-2 left-10 text-2xl animate-float-heart">
                        💕
                      </div>
                      <div
                      className="absolute bottom-6 right-10 text-xl animate-float-heart"
                      style={{
                        animationDelay: '0.3s'
                      }}>

                        💗
                      </div>
                    </div>
                  </div>

                  {/* Card Body */}
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-xl text-slate-800 group-hover:text-purple-600 transition-colors">
                        {game.name}
                      </h3>
                      {game.tag &&
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${game.tag === 'HOT' ? 'bg-red-100 text-red-600' : game.tag === 'NEW' ? 'bg-blue-100 text-blue-600' : 'bg-purple-100 text-purple-600'}`}>

                          {game.tag}
                        </span>
                    }
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-500 mb-4">
                      <span className="flex items-center gap-1">
                        <ThumbsUp size={14} className="text-blue-400" />{' '}
                        {game.plays}
                      </span>
                      <span className="flex items-center gap-1">
                        <Zap size={14} className="text-yellow-400" />{' '}
                        {game.volatility}
                      </span>
                    </div>

                    <div className="mt-auto">
                      <button className="w-full py-3 rounded-xl bg-gradient-to-r from-pink-500 to-purple-600 text-white font-black shadow-md transform transition-all duration-300 group-hover:scale-105 group-hover:shadow-lg flex items-center justify-center gap-2 hover:animate-balloon-inflate">
                        PLAY <span className="text-xl">🎈</span>
                      </button>
                    </div>
                  </div>
                </Link>
              </Card>
            )}
          </div>
        </div>

        {/* 6. BOTTOM CTA */}
        <div className="mt-8 rounded-3xl bg-gradient-to-r from-yellow-300 via-orange-300 to-red-300 p-8 text-center shadow-lg relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="relative z-10">
            <h3 className="text-2xl font-black text-white mb-2 drop-shadow-md">
              Can't decide? Try our Lucky Pick! 🎲
            </h3>
            <p className="text-white/90 font-medium mb-6">
              Let fate decide your next big win!
            </p>
            <Link to="/slots">
              <Button
                variant="gold"
                size="lg"
                className="shadow-xl hover:scale-105 transition-transform">

                Random Game 🎲
              </Button>
            </Link>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }
        @keyframes bounce-title {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
        @keyframes slot-cycle {
          0% { transform: translateY(0); }
          33% { transform: translateY(-33.33%); }
          66% { transform: translateY(-66.66%); }
          100% { transform: translateY(0); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-3px); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes float-heart {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          20% { opacity: 1; transform: translateY(-10px) scale(1); }
          100% { transform: translateY(-40px) scale(1.2); opacity: 0; }
        }
        @keyframes balloon-inflate {
          0% { transform: scale(1); }
          50% { transform: scale(1.05) rotate(-2deg); }
          75% { transform: scale(1.05) rotate(2deg); }
          100% { transform: scale(1); }
        }
        @keyframes slide-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .animate-float-slow { animation: float-slow 4s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 3s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 2s ease-in-out infinite; }
        .animate-bounce-title { animation: bounce-title 2s ease-in-out infinite; }
        .animate-pulse-slow { animation: pulse-slow 3s ease-in-out infinite; }
        .animate-slot-cycle { animation: slot-cycle 3s steps(1) infinite; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin-slow 8s linear infinite; }
        .animate-float-heart { animation: float-heart 1.5s ease-out infinite; }
        .hover\\:animate-balloon-inflate:hover { animation: balloon-inflate 0.4s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.5s ease-out forwards; }
        
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
            display: none;
        }
        /* Hide scrollbar for IE, Edge and Firefox */
        .scrollbar-hide {
            -ms-overflow-style: none;  /* IE and Edge */
            scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>);

}