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
      const response = await apiClient.get<any>(
        '/referrals/links/my_link/',
      )
      // Transform backend format to frontend format
      return {
        code: response.referral_code || response.code || '',
        url: response.referral_url || response.url || '',
        totalReferred: response.total_referred || 0,
        totalEarned: parseFloat(response.total_bonus_earned || 0),
        activeReferrals: response.qualified_referrals || 0,
      }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get referral statistics
  async getStats(): Promise<ReferralStats> {
    try {
      const response = await apiClient.get<any>('/referrals/stats/')
      // Transform backend format to frontend format
      return {
        totalReferred: response.total_referred || 0,
        totalEarned: parseFloat(response.total_bonus_earned || 0),
        availableBalance: parseFloat(response.available_balance || 0),
        pendingBonuses: response.pending_referrals || 0,
        expiredBonuses: 0, // Backend doesn't track this separately
        totalWithdrawals: parseFloat(response.total_withdrawn || 0),
      }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get user's referrals
  async getMyReferrals(): Promise<Referral[]> {
    try {
      const response = await apiClient.get<any>(
        '/referrals/my_referrals/',
      )
      // Handle paginated response or direct array
      const referrals = Array.isArray(response) 
        ? response 
        : (response.results || response.data || [])
      
      // Transform backend format to frontend format
      return referrals.map((item: any) => ({
        id: item.id.toString(),
        referrerId: item.referrer?.id?.toString() || item.referrer_id?.toString() || '',
        referrerName: item.referrer?.username || item.referrer_name || '',
        referredUserId: item.referred_user?.id?.toString() || item.referred_user_id?.toString() || '',
        referredUserName: item.referred_user?.username || item.referred_user_name || '',
        referredUserEmail: item.referred_user?.email || item.referred_user_email || '',
        status: this.mapReferralStatus(item.status),
        bonusAmount: parseFloat(item.referrer_bonus || item.bonus_amount || 0),
        expiryDate: item.bonus_expiry_date || item.expiry_date || '',
        createdAt: item.created_at || new Date().toISOString(),
        depositedAt: item.deposit_date || item.deposited_at,
        approvedAt: item.bonus_awarded_at || item.approved_at,
      }))
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Map backend referral status to frontend status
  mapReferralStatus(status: string): 'pending' | 'active' | 'completed' | 'expired' {
    const statusMap: Record<string, 'pending' | 'active' | 'completed' | 'expired'> = {
      'PENDING': 'pending',
      'QUALIFIED': 'active',
      'BONUS_AWARDED': 'completed',
      'REJECTED': 'pending',
      'EXPIRED': 'expired',
    }
    return statusMap[status.toUpperCase()] || 'pending'
  },

  // Get all referrals (admin)
  async getAllReferrals(status?: string): Promise<Referral[]> {
    try {
      const response = await apiClient.get<any>('/referrals/referrals/', {
        params: { status },
      })
      // Handle paginated response or direct array
      const referrals = Array.isArray(response) 
        ? response 
        : (response.results || response.data || [])
      
      // Transform backend format to frontend format
      return referrals.map((item: any) => ({
        id: item.id.toString(),
        referrerId: item.referrer?.id?.toString() || item.referrer_id?.toString() || '',
        referrerName: item.referrer?.username || item.referrer_name || '',
        referredUserId: item.referred_user?.id?.toString() || item.referred_user_id?.toString() || '',
        referredUserName: item.referred_user?.username || item.referred_user_name || '',
        referredUserEmail: item.referred_user?.email || item.referred_user_email || '',
        status: this.mapReferralStatus(item.status),
        bonusAmount: parseFloat(item.referrer_bonus || item.bonus_amount || 0),
        expiryDate: item.bonus_expiry_date || item.expiry_date || '',
        createdAt: item.created_at || new Date().toISOString(),
        depositedAt: item.deposit_date || item.deposited_at,
        approvedAt: item.bonus_awarded_at || item.approved_at,
      }))
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
      const response = await apiClient.post<any>(
        '/referrals/withdrawals/',
        {
          amount: data.amount,
          withdrawal_method: data.withdrawalMethod,
        },
      )
      // Transform backend format to frontend format
      return {
        id: response.id.toString(),
        userId: response.user?.id?.toString() || response.user_id?.toString() || '',
        amount: parseFloat(response.amount || 0),
        withdrawalMethod: response.withdrawal_method || data.withdrawalMethod,
        status: this.mapWithdrawalStatus(response.status),
        requestedAt: response.requested_at || new Date().toISOString(),
        processedAt: response.processed_at,
        notes: response.admin_notes || response.notes || response.remarks,
      }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get user's referral withdrawals
  async getMyWithdrawals(): Promise<ReferralWithdrawal[]> {
    try {
      const response = await apiClient.get<any>(
        '/referrals/withdrawals/my_withdrawals/',
      )
      // Handle paginated response or direct array
      const withdrawals = Array.isArray(response) 
        ? response 
        : (response.results || response.data || [])
      
      // Transform backend format to frontend format
      return withdrawals.map((item: any) => ({
        id: item.id.toString(),
        userId: item.user?.id?.toString() || item.user_id?.toString() || '',
        amount: parseFloat(item.amount || 0),
        withdrawalMethod: item.withdrawal_method || 'bank_transfer',
        status: this.mapWithdrawalStatus(item.status),
        requestedAt: item.requested_at || new Date().toISOString(),
        processedAt: item.processed_at,
        notes: item.admin_notes || item.notes || item.remarks,
      }))
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Map backend withdrawal status to frontend status
  mapWithdrawalStatus(status: string): 'pending' | 'approved' | 'rejected' | 'completed' {
    const statusMap: Record<string, 'pending' | 'approved' | 'rejected' | 'completed'> = {
      'PENDING': 'pending',
      'APPROVED': 'approved',
      'REJECTED': 'rejected',
      'PROCESSING': 'approved',
      'COMPLETED': 'completed',
    }
    return statusMap[status.toUpperCase()] || 'pending'
  },

  // Get all referral withdrawals (admin)
  async getAllWithdrawals(status?: string): Promise<ReferralWithdrawal[]> {
    try {
      const response = await apiClient.get<any>(
        '/referrals/withdrawals/',
        {
          params: { status },
        },
      )
      // Handle paginated response or direct array
      const withdrawals = Array.isArray(response) 
        ? response 
        : (response.results || response.data || [])
      
      // Transform backend format to frontend format
      return withdrawals.map((item: any) => ({
        id: item.id.toString(),
        userId: item.user?.id?.toString() || item.user_id?.toString() || '',
        amount: parseFloat(item.amount || 0),
        withdrawalMethod: item.withdrawal_method || 'bank_transfer',
        status: this.mapWithdrawalStatus(item.status),
        requestedAt: item.requested_at || new Date().toISOString(),
        processedAt: item.processed_at,
        notes: item.admin_notes || item.notes || item.remarks,
      }))
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

