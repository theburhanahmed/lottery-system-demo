import { apiClient, handleApiError } from '../utils/api'
import { ApiResponse } from '../types/api'

export interface ReferralProgram {
  id: string
  isEnabled: boolean
  referrerBonusAmount: number
  referredUserBonusAmount: number
  minimumDepositRequired: number
  bonusExpiryDays: number
  minimumWithdrawalAmount: number
  maxWithdrawalsPerMonth: number
}

export interface ReferralLink {
  code: string
  url: string
  totalReferred: number
  totalEarned: number
  activeReferrals: number
}

export interface ReferralStats {
  totalReferred: number
  totalEarned: number
  availableBalance: number
  pendingBonuses: number
  expiredBonuses: number
  totalWithdrawals: number
}

export interface Referral {
  id: string
  referrerId: string
  referrerName: string
  referredUserId: string
  referredUserName: string
  referredUserEmail: string
  status: 'pending' | 'active' | 'completed' | 'expired'
  bonusAmount: number
  expiryDate: string
  createdAt: string
  depositedAt?: string
  approvedAt?: string
}

export interface ReferralBonus {
  id: string
  referralId: string
  userId: string
  amount: number
  type: 'referrer' | 'referred'
  status: 'pending' | 'active' | 'claimed' | 'expired'
  expiryDate: string
  createdAt: string
}

export interface ReferralWithdrawal {
  id: string
  userId: string
  amount: number
  withdrawalMethod: string
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  requestedAt: string
  processedAt?: string
  notes?: string
}

export const referralService = {
  // Get current referral program settings
  async getProgramSettings(): Promise<ReferralProgram> {
    try {
      const response = await apiClient.get<ReferralProgram>(
        '/referrals/programs/current/',
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Update referral program settings (admin)
  async updateProgramSettings(
    data: Partial<ReferralProgram>,
  ): Promise<ReferralProgram> {
    try {
      const response = await apiClient.put<ReferralProgram>(
        '/referrals/programs/current/',
        data,
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get user's referral link
  async getMyReferralLink(): Promise<ReferralLink> {
    try {
      const response = await apiClient.get<ReferralLink>(
        '/referrals/links/my_link/',
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get referral statistics
  async getStats(): Promise<ReferralStats> {
    try {
      const response = await apiClient.get<ReferralStats>('/referrals/stats/')
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get user's referrals
  async getMyReferrals(): Promise<Referral[]> {
    try {
      const response = await apiClient.get<Referral[]>(
        '/referrals/my_referrals/',
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get all referrals (admin)
  async getAllReferrals(status?: string): Promise<Referral[]> {
    try {
      const response = await apiClient.get<Referral[]>('/referrals/', {
        params: { status },
      })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Approve referral (admin)
  async approveReferral(referralId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(`/referrals/${referralId}/approve/`)
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Reject referral (admin)
  async rejectReferral(
    referralId: string,
    reason: string,
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        `/referrals/${referralId}/reject/`,
        { reason },
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get available referral bonus balance
  async getAvailableBalance(): Promise<{ balance: number }> {
    try {
      const response = await apiClient.get('/referrals/bonuses/available/')
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Request referral bonus withdrawal
  async requestWithdrawal(data: {
    amount: number
    withdrawalMethod: string
  }): Promise<ReferralWithdrawal> {
    try {
      const response = await apiClient.post<ReferralWithdrawal>(
        '/referrals/withdrawals/',
        data,
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get user's referral withdrawals
  async getMyWithdrawals(): Promise<ReferralWithdrawal[]> {
    try {
      const response = await apiClient.get<ReferralWithdrawal[]>(
        '/referrals/withdrawals/my_withdrawals/',
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get all referral withdrawals (admin)
  async getAllWithdrawals(status?: string): Promise<ReferralWithdrawal[]> {
    try {
      const response = await apiClient.get<ReferralWithdrawal[]>(
        '/referrals/withdrawals/',
        {
          params: { status },
        },
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Approve referral withdrawal (admin)
  async approveWithdrawal(
    withdrawalId: string,
    notes?: string,
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        `/referrals/withdrawals/${withdrawalId}/approve/`,
        { notes },
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Reject referral withdrawal (admin)
  async rejectWithdrawal(
    withdrawalId: string,
    reason: string,
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        `/referrals/withdrawals/${withdrawalId}/reject/`,
        { reason },
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

