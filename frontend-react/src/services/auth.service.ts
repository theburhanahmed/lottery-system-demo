import { apiClient, handleApiError } from '../utils/api'
import { storage } from '../utils/storage'
import {
  LoginRequest,
  RegisterRequest,
  ApiResponse,
} from '../types/api'

// Note: Backend uses 'username' instead of 'email' for login
// Backend returns 'token' instead of 'access'/'refresh'
export const authService = {
  // Login - adapted for Django backend (uses username, returns token)
  async login(data: { username: string; password: string }): Promise<{ token: string; user: any }> {
    try {
      const response = await apiClient.post<{ token: string; user: any }>(
        '/users/login/',
        {
          username: data.username, // Backend expects username
          password: data.password,
        },
      )

      // Store token (access token)
      if (response.token) {
        storage.setAccessToken(response.token)
      }

      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Register
  async register(data: RegisterRequest): Promise<ApiResponse> {
    try {
      // Adapt to Django backend format
      const response = await apiClient.post('/users/register/', {
        username: data.email, // Backend uses username, can use email as username
        email: data.email,
        password: data.password,
        password_confirm: data.confirmPassword,
        first_name: data.name.split(' ')[0] || data.name,
        last_name: data.name.split(' ').slice(1).join(' ') || '',
        date_of_birth: data.dateOfBirth,
      })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/users/logout/')
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      storage.clearTokens()
    }
  },

  // Refresh Token - Note: Backend refresh endpoint expects 'refresh' token
  // But login doesn't return refresh token, so this may need backend update
  async refreshToken(): Promise<string> {
    try {
      const refreshToken = storage.getRefreshToken()
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const response = await apiClient.post<{ access: string }>(
        '/users/refresh-token/',
        {
          refresh: refreshToken,
        },
      )

      const { access } = response
      storage.setAccessToken(access)
      return access
    } catch (error) {
      storage.clearTokens()
      throw handleApiError(error)
    }
  },

  // Get User Profile
  async getProfile(): Promise<any> {
    try {
      const response = await apiClient.get('/users/profile/')
      // Transform Django user format to frontend format
      return {
        id: response.id,
        email: response.email,
        name: `${response.first_name || ''} ${response.last_name || ''}`.trim() || response.username,
        role: response.role === 'admin' ? 'org_admin' : 'user',
        walletBalance: parseFloat(response.wallet_balance || 0),
        referralCode: response.profile?.referral_code || '',
      }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Update Profile
  async updateProfile(data: any): Promise<any> {
    try {
      const response = await apiClient.put('/users/update_profile/', data)
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Verify Email
  async verifyEmail(token: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/users/verify-email/', { token })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Request Password Reset
  async requestPasswordReset(email: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/users/password-reset-request/', { email })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Confirm Password Reset
  async confirmPasswordReset(
    token: string,
    newPassword: string,
  ): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/users/password-reset/', {
        token,
        new_password: newPassword,
      })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

