import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockApiClient, mockHandleApiError } = vi.hoisted(() => ({
  mockApiClient: {
    get: vi.fn(),
    post: vi.fn(),
  },
  mockHandleApiError: vi.fn((error) => new Error(`handled:${String(error)}`)),
}));

vi.mock('../utils/api', () => ({
  apiClient: mockApiClient,
  handleApiError: mockHandleApiError,
}));

import { walletService } from './wallet.service';

describe('walletService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps paginated transaction responses', async () => {
    mockApiClient.get.mockResolvedValue({
      results: [{
        id: 12,
        user_id: 7,
        type: 'PRIZE',
        amount: '250.75',
        created_at: '2026-01-01T00:00:00Z',
        description: 'Win payout',
        status: 'COMPLETED',
      }],
    });

    const txs = await walletService.getTransactions({ type: 'PRIZE' });

    expect(mockApiClient.get).toHaveBeenCalledWith('/transactions/', { params: { type: 'PRIZE' } });
    expect(txs).toEqual([
      expect.objectContaining({
        id: '12',
        userId: '7',
        type: 'winnings',
        amount: 250.75,
        status: 'completed',
      }),
    ]);
  });

  it('maps withdrawals from array responses', async () => {
    mockApiClient.get.mockResolvedValue([
      {
        id: 3,
        amount: '99.99',
        status: 'PROCESSING',
        withdrawal_method: 'paypal',
        requested_at: '2026-02-01T00:00:00Z',
      },
    ]);

    const withdrawals = await walletService.getWithdrawals();

    expect(withdrawals[0]).toEqual(expect.objectContaining({
      id: '3',
      amount: 99.99,
      status: 'processing',
      withdrawalMethod: 'paypal',
    }));
  });
});
