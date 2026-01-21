import { apiClient, handleApiError } from '../utils/api'

export interface UserProfile {
  id: string
  username: string
  email: string
  first_name: string
  last_name: string
  phone_number: string | null
  date_of_birth: string | null
  address: string | null
  city: string | null
  country: string | null
  wallet_balance: string
  is_verified: boolean
  email_verified: boolean
  age_verified: boolean
  role: string
  profile: {
    total_spent: string
    total_won: string
    total_tickets_bought: number
    total_lotteries_participated: number
    total_wins: number
    avatar: string | null
    bio: string | null
    referral_code?: string
  } | null
  created_at: string
  updated_at: string
}

export interface UpdateProfileData {
  first_name?: string
  last_name?: string
  phone_number?: string
  date_of_birth?: string
  address?: string
  city?: string
  country?: string
}

export interface ChangePasswordData {
  old_password: string
  new_password: string
  confirm_new_password: string
}

export interface DepositLimits {
  daily_deposit_limit: string | null
  weekly_deposit_limit: string | null
  monthly_deposit_limit: string | null
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await apiClient.get('/users/profile/')
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async updateProfile(data: UpdateProfileData): Promise<UserProfile> {
    try {
      const response = await apiClient.put('/users/update_profile/', data)
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async changePassword(data: ChangePasswordData): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/users/change-password/', data)
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async verifyAge(dateOfBirth: string): Promise<{ message: string; age_verified: boolean }> {
    try {
      const response = await apiClient.post('/users/verify_age/', { date_of_birth: dateOfBirth })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async setDepositLimits(limits: DepositLimits): Promise<{ message: string } & DepositLimits> {
    try {
      const response = await apiClient.post('/users/set_deposit_limits/', limits)
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async getResponsibleGamingStatus(): Promise<{
    self_excluded: boolean
    exclusion_reason: string | null
    self_exclusion_until: string | null
    daily_deposit_limit: string | null
    weekly_deposit_limit: string | null
    monthly_deposit_limit: string | null
    daily_loss_limit: string | null
    session_time_limit: number | null
    session_time_remaining: number | null
    last_session_start: string | null
  }> {
    try {
      const response = await apiClient.get('/users/responsible_gaming_status/')
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async selfExclude(days: number | null): Promise<{
    message: string
    self_excluded: boolean
    self_exclusion_until: string | null
  }> {
    try {
      const response = await apiClient.post('/users/self_exclude/', { days })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async setup2FA(): Promise<{
    secret: string
    qr_code: string
    message: string
  }> {
    try {
      const response = await apiClient.post('/users/setup-2fa/')
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async verify2FASetup(token: string): Promise<{
    message: string
    backup_codes: string[]
    warning: string
  }> {
    try {
      const response = await apiClient.post('/users/verify-2fa-setup/', { token })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async disable2FA(): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/users/disable-2fa/')
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async exportData(format: 'json' | 'csv' = 'json'): Promise<any> {
    try {
      const response = await apiClient.get(`/users/data_export/?format=${format}`)
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async deleteAccount(confirmation: string): Promise<{ message: string }> {
    try {
      const response = await apiClient.post('/users/delete_account/', { confirmation })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },
}
