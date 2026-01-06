import React, { forwardRef, useId } from 'react';
import { cn } from '../../utils/cn';
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}
export const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  label,
  error,
  helperText,
  id,
  ...props
}, ref) => {
  const inputId = id || useId();
  return <div className="w-full space-y-1.5">
        {label && <label htmlFor={inputId} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">
            {label}
          </label>}
        <input id={inputId} className={cn('flex h-10 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-gold-500 focus:border-transparent disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200', error && 'border-red-500 focus:ring-red-500 focus:border-red-500', className)} ref={ref} {...props} />
        {helperText && !error && <p className="text-xs text-slate-500">{helperText}</p>}
        {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      </div>;
});
Input.displayName = 'Input';

