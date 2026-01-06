import { apiClient, handleApiError } from '../utils/api'
import { ApiResponse } from '../types/api'
import { Transaction } from '../types'

export interface DepositRequest {
  amount: number
  paymentMethodId?: string
}

export interface WithdrawalRequest {
  amount: number
  withdrawalMethod: 'bank_transfer' | 'paypal' | 'crypto'
  accountDetails: {
    accountNumber?: string
    routingNumber?: string
    paypalEmail?: string
    cryptoAddress?: string
  }
}

export interface WithdrawalResponse {
  id: string
  amount: number
  status: 'pending' | 'processing' | 'approved' | 'rejected' | 'completed'
  withdrawalMethod: string
  requestedAt: string
  processedAt?: string
  notes?: string
}

export const walletService = {
  // Get Wallet Balance
  async getWallet(): Promise<{ balance: number; bonusBalance: number }> {
    try {
      const response = await apiClient.get<any>('/users/wallet/')
      return {
        balance: parseFloat(response.wallet_balance || 0),
        bonusBalance: 0, // Backend doesn't have bonus balance separate
      }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get Transactions
  async getTransactions(filters?: {
    type?: string
    startDate?: string
    endDate?: string
    limit?: number
  }): Promise<Transaction[]> {
    try {
      const response = await apiClient.get<any[]>(
        '/transactions/',
        {
          params: filters,
        },
      )
      // Transform Django format to frontend format
      return response.map((txn: any) => ({
        id: txn.id.toString(),
        userId: txn.user_id?.toString() || '',
        type: this.mapTransactionType(txn.type),
        amount: parseFloat(txn.amount || 0),
        date: txn.created_at || new Date().toISOString(),
        description: txn.description || '',
        status: this.mapTransactionStatus(txn.status),
      }))
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Map Django transaction type to frontend type
  mapTransactionType(type: string): 'deposit' | 'purchase' | 'referral' | 'winnings' {
    const typeMap: Record<string, 'deposit' | 'purchase' | 'referral' | 'winnings'> = {
      'DEPOSIT': 'deposit',
      'PURCHASE': 'purchase',
      'WITHDRAWAL': 'deposit', // Negative amount
      'PRIZE': 'winnings',
      'REFERRAL_BONUS': 'referral',
    }
    return typeMap[type.toUpperCase()] || 'deposit'
  },

  // Map Django transaction status to frontend status
  mapTransactionStatus(status: string): 'completed' | 'pending' | 'failed' {
    const statusMap: Record<string, 'completed' | 'pending' | 'failed'> = {
      'COMPLETED': 'completed',
      'PENDING': 'pending',
      'FAILED': 'failed',
    }
    return statusMap[status.toUpperCase()] || 'pending'
  },

  // Request Deposit (creates payment intent)
  async requestDeposit(
    data: DepositRequest,
  ): Promise<{ clientSecret: string }> {
    try {
      const response = await apiClient.post('/users/add_funds/', {
        amount: data.amount,
        payment_method_id: data.paymentMethodId,
      })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Request Withdrawal
  async requestWithdrawal(
    data: WithdrawalRequest,
  ): Promise<WithdrawalResponse> {
    try {
      const response = await apiClient.post<WithdrawalResponse>(
        '/withdrawals/',
        data,
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get User Withdrawals
  async getWithdrawals(): Promise<WithdrawalResponse[]> {
    try {
      const response =
        await apiClient.get<WithdrawalResponse[]>('/withdrawals/')
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get All Withdrawals (Admin)
  async getAllWithdrawals(status?: string): Promise<WithdrawalResponse[]> {
    try {
      const response = await apiClient.get<WithdrawalResponse[]>(
        '/withdrawals/',
        {
          params: { status },
        },
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Approve Withdrawal (Admin)
  async approveWithdrawal(
    withdrawalId: string,
    notes?: string,
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        `/withdrawals/${withdrawalId}/approve/`,
        { notes },
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Reject Withdrawal (Admin)
  async rejectWithdrawal(
    withdrawalId: string,
    reason: string,
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        `/withdrawals/${withdrawalId}/reject/`,
        { reason },
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

