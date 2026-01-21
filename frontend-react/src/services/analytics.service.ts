import { apiClient, handleApiError } from '../utils/api'

export interface FinancialMetrics {
  revenue: string
  deposits: string
  withdrawals: string
  prizes_awarded: string
  net_revenue: string
  period: {
    start_date: string
    end_date: string
  }
}

export interface UserMetrics {
  total_users: number
  active_users: number
  new_registrations: number
  users_with_tickets: number
  period: {
    start_date: string
    end_date: string
  }
}

export interface LotteryMetrics {
  active_lotteries: number
  completed_lotteries: number
  tickets_sold: number
  revenue: string
  period: {
    start_date: string
    end_date: string
  }
}

export interface DashboardAnalytics {
  financial: FinancialMetrics
  users: UserMetrics
  lotteries: LotteryMetrics
}

export interface UserDashboardSummary {
  wallet_balance: string
  stats: {
    tickets_bought: number
    total_spent: string
    total_won: string
    total_wins: number
    total_lotteries_participated: number
  }
  recent_transactions: Array<{
    id: string
    type: string
    amount: string
    status: string
    description: string
    created_at: string
    lottery_name: string | null
  }>
  recent_tickets: Array<{
    id: string
    lottery_name: string
    ticket_number: string
    is_winner: boolean
    lottery_status: string
    purchased_at: string
  }>
  referral_bonus_balance: string
  pending_withdrawals: number
}

export interface ChartDataPoint {
  label: string
  value: string | number
}

export interface ChartData {
  type: string
  data: ChartDataPoint[]
}

export const analyticsService = {
  // Admin: Get dashboard analytics
  async getDashboard(days: number = 30): Promise<DashboardAnalytics> {
    try {
      return await apiClient.get<DashboardAnalytics>(
        `/admin/analytics/dashboard/?days=${days}`
      )
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Admin: Get financial metrics
  async getFinancialMetrics(
    startDate?: string,
    endDate?: string
  ): Promise<FinancialMetrics> {
    try {
      let url = '/admin/analytics/financial/?'
      if (startDate) url += `start_date=${startDate}&`
      if (endDate) url += `end_date=${endDate}&`
      return await apiClient.get<FinancialMetrics>(url)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Admin: Get user metrics
  async getUserMetrics(
    startDate?: string,
    endDate?: string
  ): Promise<UserMetrics> {
    try {
      let url = '/admin/analytics/users/?'
      if (startDate) url += `start_date=${startDate}&`
      if (endDate) url += `end_date=${endDate}&`
      return await apiClient.get<UserMetrics>(url)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Admin: Get lottery metrics
  async getLotteryMetrics(
    startDate?: string,
    endDate?: string
  ): Promise<LotteryMetrics> {
    try {
      let url = '/admin/analytics/lotteries/?'
      if (startDate) url += `start_date=${startDate}&`
      if (endDate) url += `end_date=${endDate}&`
      return await apiClient.get<LotteryMetrics>(url)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Admin: Get chart data
  async getChartData(
    type: 'revenue' | 'users' | 'tickets' = 'revenue',
    days: number = 30
  ): Promise<ChartData> {
    try {
      return await apiClient.get<ChartData>(
        `/admin/analytics/charts/?type=${type}&days=${days}`
      )
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // User: Get dashboard summary
  async getUserDashboardSummary(): Promise<UserDashboardSummary> {
    try {
      return await apiClient.get<UserDashboardSummary>(
        '/users/dashboard_summary/'
      )
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

