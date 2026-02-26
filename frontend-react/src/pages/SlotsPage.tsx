import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Settings, Plus, Minus, RotateCw, Info, Star } from 'lucide-react';
import { Button } from '../components/ui/Button';
// Cartoon Slot Machine Symbols
const SYMBOLS = [
{
  id: 'cherry',
  char: '🍒',
  value: 2,
  animation: 'animate-bounce-subtle'
},
{
  id: 'jazz',
  char: '🎵',
  value: 5,
  animation: 'animate-wiggle'
},
{
  id: 'seven',
  char: '7️⃣',
  value: 10,
  animation: 'animate-pulse'
},
{
  id: 'diamond',
  char: '💎',
  value: 20,
  animation: 'animate-spin-slow'
},
{
  id: 'bar',
  char: 'BAR',
  value: 15,
  animation: 'animate-pulse'
},
{
  id: 'pot',
  char: '🏆',
  value: 50,
  animation: 'animate-bounce'
}];

const REEL_COUNT = 3;
const ROW_COUNT = 3;
// ─── CARTOON WIN OVERLAY ────────────────────────────────────────────
function CartoonWinOverlay({
  winAmount,
  bet,
  winningSymbol,
  onCollect,
  onSpinAgain






}: {winAmount: number;bet: number;winningSymbol: (typeof SYMBOLS)[0];onCollect: () => void;onSpinAgain: () => void;}) {
  const [displayedCoins, setDisplayedCoins] = useState(0);
  const [collectBurst, setCollectBurst] = useState(false);
  const [ladderStep, setLadderStep] = useState(0);
  const multiplier = Math.round(winAmount / bet);
  // Coin counter animation
  useEffect(() => {
    const steps = 40;
    const increment = winAmount / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= winAmount) {
        setDisplayedCoins(winAmount);
        clearInterval(interval);
      } else {
        setDisplayedCoins(current);
      }
    }, 50);
    return () => clearInterval(interval);
  }, [winAmount]);
  // Jackpot ladder climb
  useEffect(() => {
    const interval = setInterval(() => {
      setLadderStep((prev) => prev < 5 ? prev + 1 : prev);
    }, 400);
    return () => clearInterval(interval);
  }, []);
  const handleCollect = () => {
    setCollectBurst(true);
    setTimeout(() => onCollect(), 800);
  };
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden">
      {/* Pastel Explosion Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-300 via-yellow-200 to-purple-300 animate-bg-pulse" />
      <div className="absolute inset-0 bg-gradient-to-tr from-cyan-200/40 via-transparent to-orange-200/40" />

      {/* Animated Particles */}
      {Array.from({
        length: 60
      }).map((_, i) =>
      <div
        key={`particle-${i}`}
        className="absolute rounded-full animate-particle"
        style={{
          width: `${6 + Math.random() * 12}px`,
          height: `${6 + Math.random() * 12}px`,
          background: [
          '#FF69B4',
          '#FFD700',
          '#32CD32',
          '#9370DB',
          '#00CED1',
          '#FF6347',
          '#FFA500'][
          i % 7],
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 3}s`,
          animationDuration: `${2 + Math.random() * 4}s`,
          opacity: 0.7
        }} />

      )}

      {/* Sound Wave Bars */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-end gap-1 h-10">
        {Array.from({
          length: 15
        }).map((_, i) =>
        <div
          key={`wave-${i}`}
          className="w-2 rounded-full bg-white/60 animate-sound-wave"
          style={{
            animationDelay: `${i * 0.1}s`,
            height: `${10 + Math.random() * 30}px`
          }} />

        )}
      </div>

      {/* Coin Rain */}
      {Array.from({
        length: 30
      }).map((_, i) =>
      <div
        key={`coin-${i}`}
        className="absolute text-3xl animate-coin-rain pointer-events-none"
        style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 2}s`,
          animationDuration: `${2 + Math.random() * 2}s`
        }}>

          🪙
        </div>
      )}

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center max-w-sm mx-auto px-4 w-full">
        {/* Firework Symbols Popping Out */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Cherries juggling */}
          <div
            className="absolute top-8 left-4 text-5xl animate-firework-pop"
            style={{
              animationDelay: '0.2s'
            }}>

            🍒
          </div>
          <div
            className="absolute top-16 right-6 text-4xl animate-firework-pop"
            style={{
              animationDelay: '0.5s'
            }}>

            🎵
          </div>
          <div
            className="absolute top-32 left-8 text-4xl animate-firework-pop"
            style={{
              animationDelay: '0.8s'
            }}>

            7️⃣
          </div>
          <div
            className="absolute top-24 right-4 text-5xl animate-firework-pop"
            style={{
              animationDelay: '1.1s'
            }}>

            💎
          </div>
          {/* BAR moonwalking */}
          <div
            className="absolute bottom-48 left-2 text-2xl font-black text-yellow-600 animate-moonwalk"
            style={{
              animationDelay: '0.3s'
            }}>

            BAR
          </div>
          <div
            className="absolute bottom-56 right-2 text-2xl font-black text-yellow-600 animate-moonwalk-reverse"
            style={{
              animationDelay: '0.7s'
            }}>

            BAR
          </div>
          {/* More cherries juggling */}
          <div
            className="absolute bottom-40 left-1/4 text-4xl animate-juggle"
            style={{
              animationDelay: '0s'
            }}>

            🍒
          </div>
          <div
            className="absolute bottom-36 right-1/4 text-4xl animate-juggle"
            style={{
              animationDelay: '0.3s'
            }}>

            🍒
          </div>
        </div>

        {/* BIG WIN Title */}
        <div className="animate-win-title mb-2 mt-8">
          <div className="text-6xl md:text-7xl font-black text-center leading-none">
            <span
              className="bg-clip-text text-transparent bg-gradient-to-b from-yellow-300 via-yellow-500 to-orange-600 drop-shadow-lg"
              style={{
                WebkitTextStroke: '2px rgba(180,80,0,0.3)'
              }}>

              BIG WIN
            </span>
          </div>
          <div className="text-center -mt-1">
            <span className="inline-block bg-gradient-to-r from-pink-500 to-purple-600 text-white text-3xl md:text-4xl font-black px-6 py-1 rounded-full border-4 border-white shadow-xl animate-pulse-scale">
              {multiplier}x!
            </span>
          </div>
        </div>

        {/* Coin Counter */}
        <div className="my-4 relative">
          <div className="flex items-center justify-center gap-3">
            <span className="text-5xl animate-bounce">🪙</span>
            <div className="bg-black/20 backdrop-blur-sm rounded-2xl px-8 py-4 border-4 border-yellow-400 shadow-2xl">
              <div className="text-5xl md:text-6xl font-black text-white font-mono tracking-tight drop-shadow-lg">
                ${displayedCoins.toFixed(2)}
              </div>
            </div>
            <span
              className="text-5xl animate-bounce"
              style={{
                animationDelay: '0.2s'
              }}>

              🪙
            </span>
          </div>
          {/* Coin pile */}
          <div className="flex justify-center mt-2 gap-0">
            {Array.from({
              length: Math.min(
                Math.floor(displayedCoins / (winAmount / 8)) + 1,
                8
              )
            }).map((_, i) =>
            <span
              key={i}
              className="text-2xl -mx-1 animate-coin-stack"
              style={{
                animationDelay: `${i * 0.15}s`
              }}>

                🪙
              </span>
            )}
          </div>
        </div>

        {/* Jackpot Ladder */}
        <div className="flex items-center gap-4 my-3 bg-black/10 backdrop-blur-sm rounded-xl px-4 py-2 border-2 border-white/20">
          <div className="flex flex-col-reverse gap-1">
            {['🥉 Mini', '🥈 Minor', '🥇 Major', '👑 Grand', '💎 Ultra'].map(
              (label, i) =>
              <div
                key={i}
                className={`flex items-center gap-2 text-xs font-bold px-3 py-1 rounded-lg transition-all duration-300 ${i <= ladderStep ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-purple-900 scale-105 shadow-md' : 'bg-white/10 text-white/40'}`}>

                  {label}
                </div>

            )}
          </div>
          {/* Cheering Crowd */}
          <div className="flex flex-col items-center gap-1">
            <div className="flex gap-1 text-2xl">
              <span
                className={`transition-all ${ladderStep >= 1 ? 'animate-bounce' : 'opacity-30'}`}>

                👏
              </span>
              <span
                className={`transition-all ${ladderStep >= 2 ? 'animate-bounce' : 'opacity-30'}`}
                style={{
                  animationDelay: '0.1s'
                }}>

                🎉
              </span>
              <span
                className={`transition-all ${ladderStep >= 3 ? 'animate-bounce' : 'opacity-30'}`}
                style={{
                  animationDelay: '0.2s'
                }}>

                🥳
              </span>
            </div>
            <div className="flex gap-1 text-2xl">
              <span
                className={`transition-all ${ladderStep >= 4 ? 'animate-bounce' : 'opacity-30'}`}
                style={{
                  animationDelay: '0.3s'
                }}>

                🙌
              </span>
              <span
                className={`transition-all ${ladderStep >= 5 ? 'animate-bounce' : 'opacity-30'}`}
                style={{
                  animationDelay: '0.4s'
                }}>

                🎊
              </span>
            </div>
          </div>
        </div>

        {/* Fox Mascot */}
        <div className="flex items-end gap-2 my-3 animate-mascot-enter">
          <div className="text-6xl animate-wiggle-slow">🦊</div>
          <div className="bg-white rounded-2xl rounded-bl-sm px-4 py-2 shadow-lg border-2 border-purple-200 max-w-[180px]">
            <p className="text-purple-800 font-black text-sm">Lucky you! 🍀</p>
            <p className="text-purple-500 text-xs font-bold">Keep spinning!</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 w-full mt-2">
          {/* Collect Button */}
          <button
            onClick={handleCollect}
            className={`
              flex-1 relative py-5 rounded-2xl font-black text-xl text-white
              bg-gradient-to-r from-yellow-400 via-amber-500 to-orange-500
              border-4 border-yellow-200 shadow-xl
              transition-all overflow-hidden
              ${collectBurst ? 'animate-collect-burst scale-110' : 'animate-collect-bloat hover:scale-105'}
            `}>

            <span className="relative z-10 flex items-center justify-center gap-2">
              COLLECT! 💰
            </span>
            {collectBurst &&
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {Array.from({
                length: 20
              }).map((_, i) =>
              <div
                key={i}
                className="absolute w-3 h-3 rounded-full animate-burst-particle"
                style={{
                  background: [
                  '#FF69B4',
                  '#FFD700',
                  '#32CD32',
                  '#9370DB',
                  '#00CED1'][
                  i % 5],
                  animationDelay: `${i * 0.03}s`,
                  transform: `rotate(${i * 18}deg)`
                }} />

              )}
              </div>
            }
          </button>

          {/* Spin Again Button */}
          <button
            onClick={onSpinAgain}
            className="w-20 py-5 rounded-2xl font-black text-sm text-white bg-gradient-to-b from-purple-500 to-indigo-600 border-4 border-purple-300 shadow-xl animate-impatient-bounce hover:scale-105 transition-transform">

            <RotateCw size={24} className="mx-auto mb-1" />
            SPIN!
          </button>
        </div>
      </div>
    </div>);

}
// ─── MAIN SLOTS PAGE ────────────────────────────────────────────────
export function SlotsPage() {
  const [balance, setBalance] = useState(1000);
  const [bet, setBet] = useState(0.5);
  const [spinning, setSpinning] = useState(false);
  const [reels, setReels] = useState<number[][]>(
    Array(REEL_COUNT).
    fill(0).
    map(() =>
    Array(ROW_COUNT).
    fill(0).
    map(() => Math.floor(Math.random() * SYMBOLS.length))
    )
  );
  const [winAmount, setWinAmount] = useState(0);
  const [winningSymbolIndex, setWinningSymbolIndex] = useState(0);
  const [freeGames, setFreeGames] = useState(0);
  const [autoSpin, setAutoSpin] = useState(false);
  const [showWinOverlay, setShowWinOverlay] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [jackpots, setJackpots] = useState({
    grand: 198,
    major: 20,
    minor: 4
  });
  useEffect(() => {
    const interval = setInterval(() => {
      setJackpots((prev) => ({
        grand: prev.grand + Math.random() * 0.1,
        major: prev.major + Math.random() * 0.05,
        minor: prev.minor + Math.random() * 0.01
      }));
    }, 1000);
    return () => clearInterval(interval);
  }, []);
  const spin = useCallback(() => {
    if (spinning || balance < bet) return;
    setSpinning(true);
    setWinAmount(0);
    setShowConfetti(false);
    setShowWinOverlay(false);
    setBalance((prev) => prev - bet);
    setTimeout(() => {
      const newReels = Array(REEL_COUNT).
      fill(0).
      map(() =>
      Array(ROW_COUNT).
      fill(0).
      map(() => Math.floor(Math.random() * SYMBOLS.length))
      );
      setReels(newReels);
      setSpinning(false);
      checkWin(newReels);
    }, 2000);
  }, [balance, bet, spinning]);
  const checkWin = (currentReels: number[][]) => {
    const middleRow = currentReels.map((col) => col[1]);
    const firstSymbol = middleRow[0];
    const allMatch = middleRow.every((symbol) => symbol === firstSymbol);
    if (allMatch) {
      const symbolValue = SYMBOLS[firstSymbol].value;
      const win = symbolValue * 3 * bet;
      setWinAmount(win);
      setWinningSymbolIndex(firstSymbol);
      setBalance((prev) => prev + win);
      setShowConfetti(true);
      if (win > bet * 5) {
        setTimeout(() => setShowWinOverlay(true), 600);
      }
    }
    if (Math.random() < 0.05) {
      setFreeGames((prev) => Math.min(prev + 3, 10));
    } else if (freeGames > 0) {
      setFreeGames((prev) => prev - 1);
    }
  };
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    if (autoSpin && !spinning && balance >= bet && !showWinOverlay) {
      timeout = setTimeout(() => spin(), 1500);
    } else if (autoSpin && balance < bet) {
      setAutoSpin(false);
    }
    return () => clearTimeout(timeout);
  }, [autoSpin, spinning, balance, bet, spin, showWinOverlay]);
  const handleCollect = () => {
    setShowWinOverlay(false);
    setShowConfetti(false);
  };
  const handleSpinAgain = () => {
    setShowWinOverlay(false);
    setShowConfetti(false);
    setTimeout(() => spin(), 200);
  };
  const SmallConfetti = () =>
  <div className="absolute inset-0 pointer-events-none overflow-hidden z-50">
      {Array.from({
      length: 40
    }).map((_, i) =>
    <div
      key={i}
      className="absolute text-2xl animate-fall"
      style={{
        left: `${Math.random() * 100}%`,
        top: `-10%`,
        animationDelay: `${Math.random() * 2}s`,
        animationDuration: `${2 + Math.random() * 3}s`
      }}>

          {['🪙', '✨', '🎉', '💎', '⭐'][Math.floor(Math.random() * 5)]}
        </div>
    )}
    </div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-950 via-purple-900 to-indigo-950 text-white overflow-hidden relative font-sans">
      {/* Starry Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {Array.from({
          length: 50
        }).map((_, i) =>
        <div
          key={i}
          className="absolute bg-white rounded-full animate-twinkle"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 3 + 1}px`,
            height: `${Math.random() * 3 + 1}px`,
            opacity: Math.random() * 0.7 + 0.3,
            animationDelay: `${Math.random() * 5}s`
          }} />

        )}
        <div className="absolute top-10 left-[-20%] text-6xl opacity-20 animate-float-cloud-slow">
          ☁️
        </div>
        <div className="absolute top-40 right-[-20%] text-8xl opacity-10 animate-float-cloud-fast">
          ☁️
        </div>
        <div className="absolute bottom-20 left-1/3 text-5xl opacity-15 animate-float-cloud-medium">
          ☁️
        </div>
      </div>

      {showConfetti && !showWinOverlay && <SmallConfetti />}

      <div className="relative z-10 max-w-md mx-auto h-full flex flex-col p-4 pb-20 md:pb-4">
        {/* Top Bar */}
        <div className="flex justify-between items-center mb-4 bg-black/30 p-2 rounded-full backdrop-blur-md border-2 border-white/10 shadow-lg">
          <div className="flex gap-2 pl-1">
            {[0.15, 0.5, 1.25].map((chipVal) =>
            <button
              key={chipVal}
              onClick={() => setBet(chipVal)}
              className={`w-10 h-10 rounded-full flex items-center justify-center text-[10px] font-bold border-2 shadow-md transition-all ${bet === chipVal ? 'bg-gradient-to-br from-yellow-400 to-orange-500 border-white text-black scale-110 shadow-yellow-500/50 animate-bounce-subtle' : 'bg-slate-700 border-slate-500 text-slate-300 hover:bg-slate-600'}`}>

                {chipVal}
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 pr-2">
            <div className="text-right">
              <div className="text-[10px] text-yellow-300 font-bold uppercase tracking-wider">
                Coins
              </div>
              <div className="text-sm font-black text-white leading-none">
                {balance.toFixed(2)}
              </div>
            </div>
            <button className="w-8 h-8 bg-green-500 hover:bg-green-400 rounded-full flex items-center justify-center text-white font-bold shadow-lg border-2 border-green-300 active:scale-95 transition-transform">
              <Plus size={16} />
            </button>
            <button className="w-8 h-8 bg-slate-700 hover:bg-slate-600 rounded-full flex items-center justify-center text-slate-300 border-2 border-slate-500">
              <Settings size={14} />
            </button>
          </div>
        </div>

        {/* Jackpot Arches */}
        <div className="flex justify-center items-end gap-2 mb-6 h-28">
          <div className="flex flex-col items-center w-1/4">
            <div className="relative w-full bg-gradient-to-b from-amber-300 to-amber-600 rounded-t-full p-1 border-2 border-yellow-200 shadow-lg transform translate-y-2">
              <div className="bg-amber-800/80 rounded-t-full p-2 text-center h-16 flex flex-col justify-center">
                <div className="text-[8px] font-bold text-yellow-200 uppercase">
                  Minor
                </div>
                <div className="text-xs font-black text-white animate-pulse">
                  ${jackpots.minor.toFixed(0)}
                </div>
              </div>
              <Star
                size={12}
                className="absolute -top-1 -left-1 text-yellow-100 animate-spin-slow" />

            </div>
          </div>
          <div className="flex flex-col items-center w-2/4 z-10">
            <div className="relative w-full bg-gradient-to-b from-yellow-300 via-yellow-500 to-amber-600 rounded-t-full p-1.5 border-4 border-yellow-100 shadow-xl shadow-yellow-500/20">
              <div className="bg-red-900/90 rounded-t-full p-2 text-center h-24 flex flex-col justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-40"></div>
                <div className="relative z-10">
                  <div className="text-[10px] font-black text-yellow-300 uppercase tracking-widest mb-1">
                    GRAND
                  </div>
                  <div className="text-2xl font-black text-white drop-shadow-md">
                    ${jackpots.grand.toFixed(0)}
                  </div>
                </div>
              </div>
              <div className="absolute -top-3 -left-2 text-2xl animate-bounce">
                ⭐
              </div>
              <div
                className="absolute -top-3 -right-2 text-2xl animate-bounce"
                style={{
                  animationDelay: '0.7s'
                }}>

                ⭐
              </div>
              <div
                className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl animate-bounce"
                style={{
                  animationDelay: '0.3s'
                }}>

                👑
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-1/4">
            <div className="relative w-full bg-gradient-to-b from-amber-300 to-amber-600 rounded-t-full p-1 border-2 border-yellow-200 shadow-lg transform translate-y-2">
              <div className="bg-amber-800/80 rounded-t-full p-2 text-center h-16 flex flex-col justify-center">
                <div className="text-[8px] font-bold text-yellow-200 uppercase">
                  Major
                </div>
                <div className="text-xs font-black text-white animate-pulse">
                  ${jackpots.major.toFixed(0)}
                </div>
              </div>
              <Star
                size={12}
                className="absolute -top-1 -right-1 text-yellow-100 animate-spin-slow" />

            </div>
          </div>
        </div>

        {/* Slot Machine Frame */}
        <div className="relative bg-gradient-to-b from-purple-800 to-indigo-900 p-3 rounded-[2rem] border-4 border-yellow-500 shadow-2xl mb-4">
          <div className="absolute -top-2 left-4 right-4 flex justify-between">
            {[...Array(7)].map((_, i) =>
            <div
              key={i}
              className={`w-3 h-3 rounded-full border border-black/20 ${i % 2 === 0 ? 'bg-red-500 animate-pulse' : 'bg-yellow-400 animate-pulse'}`}
              style={{
                animationDelay: `${i * 0.1}s`
              }} />

            )}
          </div>

          <div className="bg-indigo-950 p-2 rounded-xl border-2 border-indigo-900 overflow-hidden relative shadow-inner">
            <div
              className={`absolute top-1/2 left-0 w-full h-1/3 -translate-y-1/2 pointer-events-none z-10 border-4 rounded-lg transition-all duration-500 ${winAmount > 0 ? 'border-yellow-400 opacity-100 shadow-[0_0_20px_rgba(250,204,21,0.6)] animate-rainbow-border' : 'border-white/5 opacity-50'}`} />


            <div className="grid grid-cols-3 gap-2">
              {reels.map((col, colIndex) =>
              <div key={colIndex} className="flex flex-col gap-2">
                  {col.map((symbolIndex, rowIndex) => {
                  const symbol = SYMBOLS[symbolIndex];
                  const isMiddleRow = rowIndex === 1;
                  const isWinner = winAmount > 0 && isMiddleRow;
                  return (
                    <div
                      key={rowIndex}
                      className={`h-24 md:h-28 rounded-2xl flex items-center justify-center relative overflow-hidden transition-all duration-200 ${isWinner ? 'bg-yellow-100 scale-105 z-20 shadow-lg' : 'bg-white'} ${spinning ? 'blur-[2px] scale-y-110' : ''}`}>

                        <div
                        className={`text-5xl md:text-6xl transform transition-transform duration-500 ${spinning ? 'translate-y-[-10px] opacity-50' : 'translate-y-0 opacity-100'} ${isWinner ? symbol.animation : ''}`}>

                          {symbol.char}
                        </div>
                        {!spinning &&
                      <div className="absolute bottom-1 right-1 text-[10px] font-black text-slate-400 bg-slate-100 px-1 rounded">
                            {symbol.value}x
                          </div>
                      }
                      </div>);

                })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Free Games Meter */}
        <div className="mb-4 relative">
          <div className="h-8 bg-slate-800 rounded-full border-2 border-slate-600 overflow-hidden relative">
            <div
              className="h-full bg-gradient-to-r from-pink-500 via-yellow-400 to-lime-500 transition-all duration-500 flex items-center justify-center"
              style={{
                width: `${freeGames / 10 * 100}%`
              }}>

              {freeGames > 0 &&
              <span className="text-xs font-black text-purple-900 animate-pulse whitespace-nowrap px-2">
                  FREE GAMES!
                </span>
              }
            </div>
            <div className="absolute inset-0 flex items-center justify-between px-3 pointer-events-none">
              <span className="text-lg">🍬</span>
              <span className="text-xs font-bold text-white drop-shadow-md">
                {freeGames > 0 ? `${freeGames} LEFT` : 'FILL METER'}
              </span>
              <span className="text-lg">🍬</span>
            </div>
          </div>
        </div>

        {/* Controls Area */}
        <div className="flex items-end justify-between gap-2 mt-auto">
          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              Total Bet
            </div>
            <div className="flex items-center bg-purple-900 rounded-xl p-1 border-2 border-purple-700 shadow-lg">
              <button
                onClick={() =>
                setBet((prev) => Math.max(0.15, +(prev - 0.25).toFixed(2)))
                }
                className="w-8 h-8 rounded-full bg-lime-500 hover:bg-lime-400 flex items-center justify-center text-purple-900 font-bold shadow-md active:scale-95"
                disabled={spinning}>

                <Minus size={14} strokeWidth={4} />
              </button>
              <div className="w-14 text-center font-mono font-black text-xl text-white">
                {bet.toFixed(2)}
              </div>
              <button
                onClick={() =>
                setBet((prev) => Math.min(10, +(prev + 0.25).toFixed(2)))
                }
                className="w-8 h-8 rounded-full bg-lime-500 hover:bg-lime-400 flex items-center justify-center text-purple-900 font-bold shadow-md active:scale-95"
                disabled={spinning}>

                <Plus size={14} strokeWidth={4} />
              </button>
            </div>
          </div>

          <div className="relative -top-2">
            <button
              onClick={spin}
              disabled={spinning || balance < bet}
              className={`w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center bg-gradient-to-b from-pink-500 to-purple-600 border-4 border-white shadow-[0_10px_20px_rgba(0,0,0,0.5)] transform transition-all duration-100 ${spinning ? 'scale-y-90 translate-y-2 shadow-none' : 'hover:scale-105 active:scale-95'} ${!spinning && balance >= bet ? 'animate-heartbeat' : 'opacity-80 grayscale'}`}>

              <div className="absolute inset-2 rounded-full border-2 border-white/20" />
              <RotateCw
                size={32}
                className={`text-white mb-1 ${spinning ? 'animate-spin' : ''}`}
                strokeWidth={3} />

              <span className="text-xl font-black text-white tracking-widest drop-shadow-md">
                SPIN!
              </span>
            </button>
          </div>

          <div className="flex flex-col items-center gap-1">
            <div className="text-[10px] font-bold text-slate-300 uppercase tracking-wider">
              Auto
            </div>
            <button
              onClick={() => setAutoSpin(!autoSpin)}
              className={`w-16 h-12 rounded-2xl flex items-center justify-center border-b-4 transition-all ${autoSpin ? 'bg-lime-500 border-lime-700 text-white translate-y-1 border-b-0' : 'bg-slate-700 border-slate-900 text-slate-400 hover:bg-slate-600'}`}>

              <span className={`text-2xl ${autoSpin ? 'animate-bounce' : ''}`}>
                🐰
              </span>
            </button>
          </div>
        </div>

        {/* Small Win Display */}
        {winAmount > 0 && !showWinOverlay &&
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 animate-pop-in pointer-events-none">
            <div className="bg-yellow-400 text-purple-900 px-6 py-3 rounded-full border-4 border-white shadow-[0_0_30px_rgba(250,204,21,0.8)] transform rotate-[-5deg]">
              <div className="text-xs font-black uppercase tracking-widest text-center">
                WINNER!
              </div>
              <div className="text-4xl font-black">${winAmount.toFixed(2)}</div>
            </div>
          </div>
        }
      </div>

      {/* Cartoon Win Overlay */}
      {showWinOverlay &&
      <CartoonWinOverlay
        winAmount={winAmount}
        bet={bet}
        winningSymbol={SYMBOLS[winningSymbolIndex]}
        onCollect={handleCollect}
        onSpinAgain={handleSpinAgain} />

      }

      <style>{`
        @keyframes twinkle {
          0%, 100% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.5); }
        }
        @keyframes float-cloud-slow {
          0% { transform: translateX(0); }
          50% { transform: translateX(20px); }
          100% { transform: translateX(0); }
        }
        @keyframes float-cloud-medium {
          0% { transform: translateX(0); }
          50% { transform: translateX(-30px); }
          100% { transform: translateX(0); }
        }
        @keyframes float-cloud-fast {
          0% { transform: translateX(0); }
          50% { transform: translateX(40px); }
          100% { transform: translateX(0); }
        }
        @keyframes heartbeat {
          0% { transform: scale(1); }
          15% { transform: scale(1.08); }
          30% { transform: scale(1); }
          45% { transform: scale(1.08); }
          60% { transform: scale(1); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(-5deg); }
          50% { transform: rotate(5deg); }
        }
        @keyframes fall {
          0% { transform: translateY(-100px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(360deg); opacity: 0; }
        }
        @keyframes pop-in {
          0% { transform: translate(-50%, -50%) scale(0); }
          80% { transform: translate(-50%, -50%) scale(1.2); }
          100% { transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes bounce-subtle {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        @keyframes rainbow-border {
          0% { border-color: #FF0000; box-shadow: 0 0 15px #FF000066; }
          16% { border-color: #FF8800; box-shadow: 0 0 15px #FF880066; }
          33% { border-color: #FFFF00; box-shadow: 0 0 15px #FFFF0066; }
          50% { border-color: #00FF00; box-shadow: 0 0 15px #00FF0066; }
          66% { border-color: #0088FF; box-shadow: 0 0 15px #0088FF66; }
          83% { border-color: #8800FF; box-shadow: 0 0 15px #8800FF66; }
          100% { border-color: #FF0000; box-shadow: 0 0 15px #FF000066; }
        }
        
        /* Win Overlay Animations */
        @keyframes bg-pulse {
          0%, 100% { filter: hue-rotate(0deg) brightness(1); }
          50% { filter: hue-rotate(30deg) brightness(1.1); }
        }
        @keyframes particle {
          0% { transform: translate(0, 0) scale(1); opacity: 0.7; }
          50% { transform: translate(var(--tx, 20px), var(--ty, -30px)) scale(1.5); opacity: 1; }
          100% { transform: translate(var(--tx2, -10px), var(--ty2, 40px)) scale(0.5); opacity: 0; }
        }
        @keyframes sound-wave {
          0%, 100% { height: 8px; }
          50% { height: 32px; }
        }
        @keyframes coin-rain {
          0% { transform: translateY(-60px) rotate(0deg); opacity: 0; }
          10% { opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
        @keyframes firework-pop {
          0% { transform: scale(0) rotate(-30deg); opacity: 0; }
          50% { transform: scale(1.4) rotate(10deg); opacity: 1; }
          70% { transform: scale(0.9) rotate(-5deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes moonwalk {
          0% { transform: translateX(0) scaleX(1); }
          25% { transform: translateX(15px) scaleX(-1); }
          50% { transform: translateX(30px) scaleX(1); }
          75% { transform: translateX(15px) scaleX(-1); }
          100% { transform: translateX(0) scaleX(1); }
        }
        @keyframes moonwalk-reverse {
          0% { transform: translateX(0) scaleX(-1); }
          25% { transform: translateX(-15px) scaleX(1); }
          50% { transform: translateX(-30px) scaleX(-1); }
          75% { transform: translateX(-15px) scaleX(1); }
          100% { transform: translateX(0) scaleX(-1); }
        }
        @keyframes juggle {
          0%, 100% { transform: translateY(0) rotate(0deg); }
          25% { transform: translateY(-20px) rotate(90deg); }
          50% { transform: translateY(0) rotate(180deg); }
          75% { transform: translateY(-15px) rotate(270deg); }
        }
        @keyframes win-title {
          0% { transform: scale(0) rotate(-10deg); opacity: 0; }
          60% { transform: scale(1.15) rotate(3deg); }
          80% { transform: scale(0.95) rotate(-1deg); }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }
        @keyframes pulse-scale {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes coin-stack {
          0% { transform: translateY(20px) scale(0); opacity: 0; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        @keyframes collect-bloat {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
        @keyframes collect-burst {
          0% { transform: scale(1.1); }
          50% { transform: scale(1.2); }
          100% { transform: scale(1); }
        }
        @keyframes burst-particle {
          0% { transform: rotate(var(--r, 0deg)) translateX(0) scale(1); opacity: 1; }
          100% { transform: rotate(var(--r, 0deg)) translateX(80px) scale(0); opacity: 0; }
        }
        @keyframes impatient-bounce {
          0%, 60%, 100% { transform: translateY(0); }
          30% { transform: translateY(-6px); }
          45% { transform: translateY(-3px); }
        }
        @keyframes mascot-enter {
          0% { transform: translateX(-40px) scale(0.8); opacity: 0; }
          100% { transform: translateX(0) scale(1); opacity: 1; }
        }
        @keyframes wiggle-slow {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        
        .animate-twinkle { animation: twinkle 3s ease-in-out infinite; }
        .animate-float-cloud-slow { animation: float-cloud-slow 20s ease-in-out infinite; }
        .animate-float-cloud-medium { animation: float-cloud-medium 15s ease-in-out infinite; }
        .animate-float-cloud-fast { animation: float-cloud-fast 10s ease-in-out infinite; }
        .animate-heartbeat { animation: heartbeat 2s ease-in-out infinite; }
        .animate-wiggle { animation: wiggle 0.5s ease-in-out infinite; }
        .animate-fall { animation: fall linear infinite; }
        .animate-pop-in { animation: pop-in 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-bounce-subtle { animation: bounce-subtle 2s ease-in-out infinite; }
        .animate-spin-slow { animation: spin 4s linear infinite; }
        .animate-rainbow-border { animation: rainbow-border 2s linear infinite; }
        .animate-bg-pulse { animation: bg-pulse 4s ease-in-out infinite; }
        .animate-particle { animation: particle 3s ease-in-out infinite; }
        .animate-sound-wave { animation: sound-wave 0.8s ease-in-out infinite; }
        .animate-coin-rain { animation: coin-rain 3s linear infinite; }
        .animate-firework-pop { animation: firework-pop 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-moonwalk { animation: moonwalk 3s ease-in-out infinite; }
        .animate-moonwalk-reverse { animation: moonwalk-reverse 3s ease-in-out infinite; }
        .animate-juggle { animation: juggle 1.5s ease-in-out infinite; }
        .animate-win-title { animation: win-title 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
        .animate-pulse-scale { animation: pulse-scale 1.5s ease-in-out infinite; }
        .animate-coin-stack { animation: coin-stack 0.4s ease-out forwards; }
        .animate-collect-bloat { animation: collect-bloat 2s ease-in-out infinite; }
        .animate-collect-burst { animation: collect-burst 0.5s ease-out forwards; }
        .animate-burst-particle { animation: burst-particle 0.6s ease-out forwards; }
        .animate-impatient-bounce { animation: impatient-bounce 2s ease-in-out infinite; }
        .animate-mascot-enter { animation: mascot-enter 0.6s ease-out forwards; }
        .animate-wiggle-slow { animation: wiggle-slow 2s ease-in-out infinite; }
      `}</style>
    </div>);

}