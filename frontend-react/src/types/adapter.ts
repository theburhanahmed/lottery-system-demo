/**
 * Adapter types - shapes expected by the new UI pages (from useAppState).
 * These map to/from backend types in types/index.ts
 */

export interface AdapterUser {
  id: string
  name: string
  email: string
  role: 'user' | 'admin'
  walletBalance: number
  depositLimit?: { daily?: number; weekly?: number; monthly?: number }
  selfExcluded?: boolean
  selfExcludedUntil?: string
}

export interface AdapterLottery {
  id: string
  title: string
  description: string
  ticketPrice: number
  totalTickets: number
  ticketsSold: number
  prizeAmount: number
  drawDate: string
  status: 'active' | 'upcoming' | 'completed'
  winningNumbers?: number[]
  category?: 'daily' | 'weekly' | 'jackpot' | 'flash' | 'special'
}

export interface AdapterTicket {
  id: string
  lotteryId: string
  lotteryTitle: string
  ticketNumber: string
  purchaseDate: string
  status: 'pending' | 'won' | 'lost'
  drawDate: string
  pickedNumbers?: number[]
}

export interface AdapterTransaction {
  id: string
  date: string
  type: 'deposit' | 'purchase' | 'winning' | 'withdrawal'
  description: string
  amount: number
  balanceAfter: number
}

export interface ToastItem {
  id: string
  message: string
  type: 'success' | 'error' | 'info'
}

export interface AdapterNotification {
  id: string
  date: string
  title: string
  message: string
  read: boolean
  type: 'draw' | 'win' | 'promo' | 'system'
}
