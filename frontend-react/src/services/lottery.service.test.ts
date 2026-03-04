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

import { lotteryService } from './lottery.service';

describe('lotteryService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('maps paginated lotteries response to frontend model', async () => {
    mockApiClient.get.mockResolvedValue({
      results: [{
        id: 7,
        created_by: { id: 2 },
        name: 'Mega Draw',
        description: 'Friday draw',
        ticket_price: '10.5',
        total_tickets: 100,
        available_tickets: 60,
        draw_date: '2026-01-01T00:00:00Z',
        prize_amount: '1000',
        status: 'DRAWN',
        image_url: 'https://img.test',
      }],
    });

    const lotteries = await lotteryService.getLotteries({ status: 'active' });

    expect(mockApiClient.get).toHaveBeenCalledWith('/lotteries/', { params: { status: 'active' } });
    expect(lotteries[0]).toEqual(expect.objectContaining({
      id: '7',
      organizationId: '2',
      name: 'Mega Draw',
      ticketPrice: 10.5,
      ticketsSold: 40,
      prizePool: 1000,
      status: 'completed',
    }));
  });

  it('maps purchased tickets response', async () => {
    mockApiClient.post.mockResolvedValue([
      {
        id: 9,
        lottery_id: 7,
        user_id: 11,
        purchased_at: '2026-01-01T00:00:00Z',
        ticket_number: 'A-001',
      },
    ]);

    const tickets = await lotteryService.purchaseTickets({ lotteryId: '7', quantity: 1 });

    expect(mockApiClient.post).toHaveBeenCalledWith('/lotteries/7/buy_ticket/', { quantity: 1 });
    expect(tickets[0]).toEqual(expect.objectContaining({
      id: '9',
      lotteryId: '7',
      userId: '11',
      ticketNumber: 'A-001',
    }));
  });
});
