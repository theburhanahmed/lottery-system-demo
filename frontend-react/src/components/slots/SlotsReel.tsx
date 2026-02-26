import React from 'react';

const SYMBOL_LABELS: Record<string, string> = {
  cherry: '🍒',
  lemon: '🍋',
  orange: '🍊',
  plum: '🍇',
  bell: '🔔',
  bar: '📊',
  seven: '7️⃣',
};

interface SlotsReelProps {
  symbol: string;
  isSpinning?: boolean;
  win?: boolean;
}

export function SlotsReel({ symbol, isSpinning, win }: SlotsReelProps) {
  const display = SYMBOL_LABELS[symbol] || symbol;
  return (
    <div
      className={`
        w-20 h-24 sm:w-24 sm:h-28 flex items-center justify-center rounded-xl
        bg-gradient-to-b from-slate-800 to-slate-900
        border-2 border-brand-gold-500/50
        text-4xl sm:text-5xl
        transition-all duration-300
        ${isSpinning ? 'animate-spin-slow' : ''}
        ${win ? 'ring-4 ring-brand-gold-400 shadow-glow-gold scale-105' : ''}
      `}
    >
      <span className={isSpinning ? 'opacity-50' : ''}>{display}</span>
    </div>
  );
}
