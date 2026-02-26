import React from 'react';
interface InputProps {
  label?: string;
  type?: string;
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  error?: string;
  icon?: React.ReactNode;
  className?: string;
  disabled?: boolean;
  min?: number;
  max?: number;
  step?: string;
  helperText?: string;
  required?: boolean;
  autoFocus?: boolean;
  maxLength?: number;
}
export function Input({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  icon,
  className = '',
  disabled = false,
  min,
  max,
  step,
  helperText,
  required,
  autoFocus,
  maxLength,
}: InputProps) {
  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          min={min}
          max={max}
          step={step}
          required={required}
          autoFocus={autoFocus}
          maxLength={maxLength}
          className={`w-full rounded-xl border bg-white px-4 py-2.5 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 disabled:opacity-50 disabled:bg-gray-50 ${icon ? 'pl-10' : ''} ${error ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200'}`}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
      {helperText && <p className="text-xs text-gray-500">{helperText}</p>}
    </div>
  );

}