import { apiClient, handleApiError } from '../utils/api'
import { RAZORPAY_CONFIG } from '../config/api.config'

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js'

export interface RazorpayConfig {
  key_id: string
  currency: string
  available: boolean
}

export interface RazorpayOrderResponse {
  order_id: string
  amount: string
  currency: string
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayCheckoutOptions) => IRazorpay
  }
}

export interface RazorpayCheckoutOptions {
  key: string
  amount: number
  currency: string
  order_id: string
  name: string
  description: string
  handler: (response: { razorpay_payment_id: string; razorpay_order_id: string; razorpay_signature: string }) => void
  prefill?: { email?: string; name?: string }
  theme?: { color?: string }
  modal?: { ondismiss?: () => void }
}

export interface IRazorpay {
  open: () => void
  on: (event: string, handler: () => void) => void
}

function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') return Promise.reject(new Error('Not in browser'))
  if (window.Razorpay) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = RAZORPAY_SCRIPT_URL
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => reject(new Error('Failed to load Razorpay'))
    document.body.appendChild(script)
  })
}

export const razorpayService = {
  async getConfig(): Promise<RazorpayConfig> {
    const response = await apiClient.get<RazorpayConfig>('/payments/razorpay/config/')
    return response
  },

  async createOrder(amount: number, currency: string = 'INR'): Promise<RazorpayOrderResponse> {
    const response = await apiClient.post<RazorpayOrderResponse>('/payments/razorpay/create-order/', {
      amount,
      currency,
    })
    return response
  },

  async verifyPayment(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ): Promise<{ message: string; order_id: string }> {
    const response = await apiClient.post<{ message: string; order_id: string }>(
      '/payments/razorpay/verify/',
      {
        razorpay_order_id: razorpayOrderId,
        razorpay_payment_id: razorpayPaymentId,
        razorpay_signature: razorpaySignature,
      }
    )
    return response
  },

  async openCheckout(
    order: RazorpayOrderResponse,
    options: {
      userEmail?: string
      userName?: string
      onSuccess: () => void
      onDismiss?: () => void
      onError?: (message: string) => void
    }
  ): Promise<void> {
    await loadRazorpayScript()
    const keyId = RAZORPAY_CONFIG.keyId || (await this.getConfig()).key_id
    if (!keyId) {
      options.onError?.('Razorpay is not configured')
      return
    }
    const amountPaise = Math.round(parseFloat(order.amount) * 100)
    const razorpay = new window.Razorpay({
      key: keyId,
      amount: amountPaise,
      currency: order.currency,
      order_id: order.order_id,
      name: 'Lottery Platform',
      description: `Deposit ₹${order.amount}`,
      handler: async (response) => {
        try {
          await this.verifyPayment(
            response.razorpay_order_id,
            response.razorpay_payment_id,
            response.razorpay_signature
          )
          options.onSuccess()
        } catch (err: any) {
          const apiError = handleApiError(err)
          options.onError?.(apiError?.message || 'Verification failed')
        }
      },
      prefill: {
        email: options.userEmail,
        name: options.userName,
      },
      theme: { color: '#c9a227' },
      modal: {
        ondismiss: options.onDismiss,
      },
    })
    razorpay.open()
  },
}
