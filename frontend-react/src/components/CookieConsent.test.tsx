import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { CookieConsent, getCookieConsent } from './CookieConsent';

const STORAGE_KEY = 'lottery_cookie_consent';

function renderWithRouter(ui: React.ReactElement) {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
}

const mockStorage: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => mockStorage[key] ?? null,
  setItem: (key: string, value: string) => { mockStorage[key] = value; },
  removeItem: (key: string) => { delete mockStorage[key]; },
  clear: () => { for (const k of Object.keys(mockStorage)) delete mockStorage[k]; },
  length: 0,
  key: () => null,
};

describe('CookieConsent', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    delete mockStorage[STORAGE_KEY];
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows banner when consent not set', () => {
    renderWithRouter(<CookieConsent />);
    expect(screen.getByRole('dialog', { name: /cookie consent/i })).toBeInTheDocument();
    expect(screen.getByText(/we use cookies/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /accept/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /decline/i })).toBeInTheDocument();
  });

  it('hides banner after accept', () => {
    renderWithRouter(<CookieConsent />);
    const accept = screen.getByRole('button', { name: /accept/i });
    fireEvent.click(accept);
    expect(screen.queryByRole('dialog', { name: /cookie consent/i })).not.toBeInTheDocument();
    expect(getCookieConsent()).toBe('accepted');
  });
});

describe('getCookieConsent', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', localStorageMock);
    delete mockStorage[STORAGE_KEY];
  });
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('returns null when not set', () => {
    expect(getCookieConsent()).toBeNull();
  });
  it('returns accepted when set', () => {
    mockStorage[STORAGE_KEY] = 'accepted';
    expect(getCookieConsent()).toBe('accepted');
  });
});
