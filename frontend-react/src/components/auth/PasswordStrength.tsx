import React from 'react';
import { Check, X } from 'lucide-react';
import { cn } from '../../utils/cn';

interface PasswordStrengthProps {
  password: string;
}

interface Requirement {
  label: string;
  test: (password: string) => boolean;
}

const requirements: Requirement[] = [
  { label: 'At least 8 characters', test: p => p.length >= 8 },
  { label: 'Contains uppercase letter', test: p => /[A-Z]/.test(p) },
  { label: 'Contains lowercase letter', test: p => /[a-z]/.test(p) },
  { label: 'Contains number', test: p => /[0-9]/.test(p) },
  { label: 'Contains special character', test: p => /[^A-Za-z0-9]/.test(p) }
];

export function PasswordStrength({ password }: PasswordStrengthProps) {
  if (!password) return null;

  const passedRequirements = requirements.filter(req => req.test(password)).length;
  const strength = passedRequirements / requirements.length * 100;

  const getStrengthColor = () => {
    if (strength < 40) return 'bg-red-500';
    if (strength < 80) return 'bg-amber-500';
    return 'bg-emerald-500';
  };

  const getStrengthLabel = () => {
    if (strength < 40) return 'Weak';
    if (strength < 80) return 'Medium';
    return 'Strong';
  };

  return <div className="space-y-3 mt-2">
      {/* Strength Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-slate-500">Password Strength</span>
          <span className={cn('font-semibold', strength < 40 && 'text-red-600', strength >= 40 && strength < 80 && 'text-amber-600', strength >= 80 && 'text-emerald-600')}>
            {getStrengthLabel()}
          </span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <div className={cn('h-full transition-all duration-300', getStrengthColor())} style={{ width: `${strength}%` }} />
        </div>
      </div>

      {/* Requirements List */}
      <div className="space-y-1.5">
        {requirements.map((req, index) => {
        const passed = req.test(password);
        return <div key={index} className="flex items-center gap-2 text-xs">
              {passed ? <Check className="h-3.5 w-3.5 text-emerald-500 flex-shrink-0" /> : <X className="h-3.5 w-3.5 text-slate-300 flex-shrink-0" />}
              <span className={cn('transition-colors', passed ? 'text-emerald-600 font-medium' : 'text-slate-500')}>
                {req.label}
              </span>
            </div>;
      })}
      </div>
    </div>;
}

export function validatePassword(password: string): boolean {
  return requirements.every(req => req.test(password));
}

