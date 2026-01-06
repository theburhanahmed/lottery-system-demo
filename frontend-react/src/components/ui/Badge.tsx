import React from 'react';
import { cn } from '../../utils/cn';
interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'success' | 'warning' | 'destructive';
}
export function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variants = {
    default: 'border-transparent bg-brand-gold-500 text-white shadow-sm',
    secondary: 'border-transparent bg-slate-100 text-slate-900',
    outline: 'text-slate-950 border-slate-200',
    success: 'border-transparent bg-emerald-500 text-white',
    warning: 'border-transparent bg-amber-500 text-white',
    destructive: 'border-transparent bg-red-500 text-white'
  };
  return <span className={cn('inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-slate-950 focus:ring-offset-2', variants[variant], className)} {...props} />;
}

