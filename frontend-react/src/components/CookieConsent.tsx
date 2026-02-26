import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/Button';

const STORAGE_KEY = 'lottery_cookie_consent';

type ConsentStatus = 'accepted' | 'declined' | null;

export function CookieConsent() {
  const [status, setStatus] = useState<ConsentStatus>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY) as ConsentStatus | null;
      if (stored === 'accepted' || stored === 'declined') setStatus(stored);
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  const save = (value: 'accepted' | 'declined') => {
    try {
      localStorage.setItem(STORAGE_KEY, value);
      setStatus(value);
    } catch {
      setStatus(value);
    }
  };

  if (!mounted || status !== null) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-gray-900/95 text-white shadow-lg border-t border-gray-700"
      role="dialog"
      aria-label="Cookie consent"
    >
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-start sm:items-center gap-4">
        <p className="text-sm text-gray-200 flex-1">
          We use cookies and similar technologies to improve your experience, analyze traffic, and for marketing.
          By continuing you agree to our use of cookies. See our{' '}
          <Link to="/privacy" className="underline hover:text-emerald-400">
            Privacy Policy
          </Link>{' '}
          for details.
        </p>
        <div className="flex gap-2 shrink-0">
          <Button
            variant="outline"
            size="sm"
            className="border-gray-500 text-gray-200 hover:bg-gray-700"
            onClick={() => save('declined')}
          >
            Decline
          </Button>
          <Button
            variant="primary"
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
            onClick={() => save('accepted')}
          >
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}

export function getCookieConsent(): ConsentStatus {
  if (typeof window === 'undefined') return null;
  try {
    const v = localStorage.getItem(STORAGE_KEY);
    return v === 'accepted' || v === 'declined' ? v : null;
  } catch {
    return null;
  }
}
