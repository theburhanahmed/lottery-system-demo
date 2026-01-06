import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js'
import { apiClient, handleApiError } from '../utils/api'
import { STRIPE_CONFIG } from '../config/api.config'
import { ApiResponse } from '../types/api'

let stripePromise: Promise<Stripe | null> | null = null

export const getStripe = (): Promise<Stripe | null> => {
  if (!stripePromise) {
    stripePromise = loadStripe(STRIPE_CONFIG.publicKey)
  }
  return stripePromise
}

export interface PaymentMethod {
  id: string
  type: 'card' | 'bank_account'
  card?: {
    brand: string
    last4: string
    expMonth: number
    expYear: number
  }
  bankAccount?: {
    bankName: string
    last4: string
  }
  isPrimary: boolean
  createdAt: string
}

export interface CreatePaymentIntentRequest {
  amount: number
  currency?: string
  paymentMethodId?: string
}

export interface CreatePaymentIntentResponse {
  clientSecret: string
  paymentIntentId: string
}

export const stripeService = {
  // Create Payment Intent for deposit
  async createPaymentIntent(
    data: CreatePaymentIntentRequest,
  ): Promise<CreatePaymentIntentResponse> {
    try {
      const response = await apiClient.post<CreatePaymentIntentResponse>(
        '/payments/create-intent/',
        {
          amount: Math.round(data.amount * 100), // Convert to cents
          currency: data.currency || 'usd',
          payment_method_id: data.paymentMethodId,
        },
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Confirm Payment
  async confirmPayment(paymentIntentId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post('/payments/confirm/', {
        payment_intent_id: paymentIntentId,
      })
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get Payment Methods
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await apiClient.get<PaymentMethod[]>('/payment-methods/')
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Add Payment Method
  async addPaymentMethod(paymentMethodId: string): Promise<PaymentMethod> {
    try {
      const response = await apiClient.post<PaymentMethod>(
        '/payment-methods/',
        {
          payment_method_id: paymentMethodId,
        },
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Set Primary Payment Method
  async setPrimaryPaymentMethod(paymentMethodId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.post(
        `/payment-methods/${paymentMethodId}/set_primary/`,
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Delete Payment Method
  async deletePaymentMethod(paymentMethodId: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete(
        `/payment-methods/${paymentMethodId}/`,
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

