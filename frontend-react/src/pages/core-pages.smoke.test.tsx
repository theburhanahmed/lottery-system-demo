import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { DashboardPage } from './DashboardPage';
import { LotteriesPage } from './LotteriesPage';
import { WalletPage } from './WalletPage';

const mockUser = {
  id: '1',
  name: 'Smoke Test User',
  email: 'smoke@test.dev',
  role: 'user' as const,
  walletBalance: 100,
};

describe('Core pages smoke tests', () => {
  it('DashboardPage load state renders key heading and welcome text', () => {
    render(
      <MemoryRouter>
        <DashboardPage user={mockUser} tickets={[]} transactions={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByRole('heading', { name: /dashboard/i })).toBeInTheDocument();
    expect(screen.getByText(/welcome back/i)).toBeInTheDocument();
  });

  it('LotteriesPage empty state is displayed when no lotteries are available', () => {
    render(
      <MemoryRouter>
        <LotteriesPage lotteries={[]} />
      </MemoryRouter>,
    );

    expect(screen.getByText(/no lotteries found/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear filters/i })).toBeInTheDocument();
  });

  it('WalletPage error state shows warning when withdrawal exceeds balance', () => {
    render(
      <MemoryRouter>
        <WalletPage
          user={mockUser}
          transactions={[]}
          onAddFunds={vi.fn()}
          onWithdraw={vi.fn()}
        />
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole('button', { name: /withdraw funds/i }));
    fireEvent.change(screen.getByPlaceholderText(/enter amount/i), {
      target: { value: '150' },
    });

    expect(screen.getByText(/amount exceeds your available balance/i)).toBeInTheDocument();
  });
});
