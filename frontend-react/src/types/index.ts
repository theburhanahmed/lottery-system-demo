export type UserRole = 'org_admin' | 'user'

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  organizationId?: string // If org_admin
  walletBalance: number
  referralCode: string
}

export type LotteryStatus = 'upcoming' | 'active' | 'ended' | 'completed'

export interface Lottery {
  id: string
  organizationId: string
  name: string
  description: string
  ticketPrice: number
  totalTickets: number
  ticketsSold: number
  drawDate: string // ISO string
  prizePool: number
  status: LotteryStatus
  imageUrl?: string
}

export interface Ticket {
  id: string
  lotteryId: string
  userId: string
  purchaseDate: string
  ticketNumber: string
}

export type TransactionType = 'deposit' | 'purchase' | 'referral' | 'winnings'

export interface Transaction {
  id: string
  userId: string
  type: TransactionType
  amount: number
  date: string
  description: string
  status: 'completed' | 'pending' | 'failed'
}

export interface DrawResult {
  id: string
  lotteryId: string
  drawDate: string
  winningTicketId: string
  winnerUserId: string
  prizeAmount: number
}

