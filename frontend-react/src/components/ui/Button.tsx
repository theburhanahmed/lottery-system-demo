import React from 'react';
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'gold' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  loading?: boolean;
  type?: 'button' | 'submit';
}
export function Button({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = '',
  loading = false,
  type = 'button'
}: ButtonProps) {
  const base =
  'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants: Record<string, string> = {
    primary:
    'bg-gradient-to-r from-emerald-600 to-green-700 text-white hover:from-emerald-700 hover:to-green-800 hover:scale-[1.02] hover:shadow-lg focus:ring-emerald-500 active:scale-[0.98]',
    secondary:
    'bg-gray-100 text-gray-800 hover:bg-gray-200 hover:scale-[1.02] focus:ring-gray-400',
    outline:
    'border-2 border-emerald-600 text-emerald-700 hover:bg-emerald-50 hover:scale-[1.02] focus:ring-emerald-500',
    ghost:
    'text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-400',
    gold: 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 hover:from-yellow-500 hover:to-amber-600 hover:scale-[1.02] hover:shadow-lg focus:ring-yellow-500',
    danger:
    'bg-red-500 text-white hover:bg-red-600 hover:scale-[1.02] focus:ring-red-500'
  };
  const sizes: Record<string, string> = {
    sm: 'px-3 py-1.5 text-sm gap-1.5',
    md: 'px-5 py-2.5 text-sm gap-2',
    lg: 'px-7 py-3.5 text-base gap-2.5'
  };
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}>

      {loading &&
      <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
          <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4" />

          <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />

        </svg>
      }
      {children}
    </button>);

}