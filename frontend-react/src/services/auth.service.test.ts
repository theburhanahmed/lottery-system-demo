import { describe, it, expect, vi, beforeEach } from 'vitest';

const { mockApiClient, mockStorage, mockHandleApiError } = vi.hoisted(() => ({
  mockApiClient: {
    post: vi.fn(),
    get: vi.fn(),
    put: vi.fn(),
  },
  mockStorage: {
    setAccessToken: vi.fn(),
    getRefreshToken: vi.fn(),
    clearTokens: vi.fn(),
  },
  mockHandleApiError: vi.fn((error) => new Error(`handled:${String(error)}`)),
}));

vi.mock('../utils/api', () => ({
  apiClient: mockApiClient,
  handleApiError: mockHandleApiError,
}));

vi.mock('../utils/storage', () => ({
  storage: mockStorage,
}));

import { authService } from './auth.service';

describe('authService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('logs in and stores access token', async () => {
    mockApiClient.post.mockResolvedValue({ token: 'token-123', user: { id: 1 } });

    const result = await authService.login({ username: 'user@example.com', password: 'secret123' });

    expect(mockApiClient.post).toHaveBeenCalledWith('/users/login/', {
      username: 'user@example.com',
      email: 'user@example.com',
      password: 'secret123',
    });
    expect(mockStorage.setAccessToken).toHaveBeenCalledWith('token-123');
    expect(result.user.id).toBe(1);
  });

  it('transforms profile response to frontend shape', async () => {
    mockApiClient.get.mockResolvedValue({
      id: '42',
      email: 'user@example.com',
      username: 'user42',
      first_name: 'Test',
      last_name: 'User',
      role: 'admin',
      wallet_balance: '450.5',
      profile: { referral_code: 'REF42' },
    });

    const profile = await authService.getProfile();

    expect(profile).toEqual({
      id: '42',
      email: 'user@example.com',
      name: 'Test User',
      role: 'org_admin',
      walletBalance: 450.5,
      referralCode: 'REF42',
    });
  });

  it('clears tokens when refresh token is missing', async () => {
    mockStorage.getRefreshToken.mockReturnValue(null);

    await expect(authService.refreshToken()).rejects.toThrow('handled:Error: No refresh token available');
    expect(mockStorage.clearTokens).toHaveBeenCalled();
  });
});
