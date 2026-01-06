// API Request/Response Types

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
}

export interface ApiError {
  message: string
  errors?: Record<string, string[]>
  statusCode: number
}

export interface PaginatedResponse<T> {
  results: T[]
  count: number
  next: string | null
  previous: string | null
}

// Auth Types
export interface LoginRequest {
  email: string
  password: string
  role?: 'user' | 'org_admin'
}

export interface LoginResponse {
  access: string
  refresh: string
  user: {
    id: string
    email: string
    name: string
    role: 'user' | 'org_admin'
    organizationId?: string
    walletBalance: number
    referralCode: string
  }
}

export interface RegisterRequest {
  email: string
  password: string
  confirmPassword: string
  name: string
  dateOfBirth: string
  role?: 'user' | 'org_admin'
  referralCode?: string
}

export interface RefreshTokenResponse {
  access: string
}

export interface TwoFactorRequest {
  code: string
  token: string
}

// Lottery Types
export interface CreateLotteryRequest {
  name: string
  description: string
  ticketPrice: number
  totalTickets: number
  prizePool: number
  drawDate: string
  imageUrl?: string
}

export interface PurchaseTicketsRequest {
  lotteryId: string
  quantity: number
}

export interface ExecuteDrawRequest {
  lotteryId: string
}

// Wallet Types
export interface DepositRequest {
  amount: number
  paymentMethodId: string
}

export interface WithdrawalRequest {
  amount: number
  withdrawalMethod: string
  accountDetails: Record<string, any>
}

export interface ApproveWithdrawalRequest {
  withdrawalId: string
  notes?: string
}

export interface RejectWithdrawalRequest {
  withdrawalId: string
  reason: string
}

// Referral Types
export interface ApplyReferralCodeRequest {
  code: string
}

export interface ReferralWithdrawalRequest {
  amount: number
  withdrawalMethod: string
}

