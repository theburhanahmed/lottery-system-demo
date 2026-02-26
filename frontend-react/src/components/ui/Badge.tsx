import React from 'react';
interface BadgeProps {
  variant?:
  'active' |
  'upcoming' |
  'completed' |
  'won' |
  'pending' |
  'lost' |
  'deposit' |
  'purchase' |
  'winning' |
  'withdrawal' |
  'secondary' |
  'default' |
  'success' |
  'warning' |
  'destructive';
  children: React.ReactNode;
  className?: string;
}
const variants: Record<string, string> = {
  active: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  upcoming: 'bg-blue-100 text-blue-700 border-blue-200',
  completed: 'bg-gray-100 text-gray-600 border-gray-200',
  won: 'bg-amber-100 text-amber-700 border-amber-200',
  pending: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  lost: 'bg-gray-100 text-gray-500 border-gray-200',
  deposit: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  purchase: 'bg-orange-100 text-orange-700 border-orange-200',
  winning: 'bg-amber-100 text-amber-700 border-amber-200',
  withdrawal: 'bg-gray-100 text-gray-600 border-gray-200',
  secondary: 'bg-gray-100 text-gray-700 border-gray-200',
  default: 'bg-gray-100 text-gray-600 border-gray-200',
  success: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-100 text-amber-700 border-amber-200',
  destructive: 'bg-red-100 text-red-700 border-red-200',
};
export function Badge({
  variant = 'active',
  children,
  className = ''
}: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold border ${variants[variant] || variants.active} ${className}`}>

      {children}
    </span>);

}