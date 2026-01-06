import { apiClient, handleApiError } from '../utils/api'
import { Lottery, Ticket } from '../types'
import { ApiResponse } from '../types/api'

export interface CreateLotteryRequest {
  name: string
  description: string
  ticketPrice: number
  totalTickets: number
  prizePool: number
  drawDate: string
  imageUrl?: string
  maxTicketsPerUser?: number
}

export interface PurchaseTicketsRequest {
  lotteryId: string
  quantity: number
}

export interface DrawResult {
  id: string
  lotteryId: string
  winnerId: string
  winnerName: string
  winnerTicketNumber: string
  prizeAmount: number
  drawnAt: string
  randomSeed: string
  totalParticipants: number
  totalTickets: number
  auditLog: {
    seedGenerated: string
    seedHash: string
    selectionMethod: string
    ticketIndex: number
    timestamp: string
    executedBy: string
  }
}

export interface LotteryParticipant {
  userId: string
  userName: string
  email: string
  ticketCount: number
  totalSpent: number
  tickets: string[]
}

export const lotteryService = {
  // Get all lotteries
  async getLotteries(filters?: {
    status?: string
    limit?: number
  }): Promise<Lottery[]> {
    try {
      const response = await apiClient.get<any>('/lotteries/', {
        params: filters,
      })
      // Handle paginated response from Django REST Framework
      // Response can be either {count, next, previous, results: [...]} or [...]
      const lotteries = Array.isArray(response) ? response : (response.results || [])
      // Transform Django format to frontend format
      return lotteries.map((lottery: any) => ({
        id: lottery.id.toString(),
        organizationId: (lottery.created_by?.id || lottery.created_by)?.toString() || '',
        name: lottery.name,
        description: lottery.description || '',
        ticketPrice: parseFloat(lottery.ticket_price || 0),
        totalTickets: lottery.total_tickets || 0,
        ticketsSold: lottery.available_tickets ? lottery.total_tickets - lottery.available_tickets : 0,
        drawDate: lottery.draw_date,
        prizePool: parseFloat(lottery.prize_amount || 0),
        status: this.mapStatus(lottery.status),
        imageUrl: lottery.image_url,
      }))
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Map Django status to frontend status
  mapStatus(status: string): 'upcoming' | 'active' | 'ended' | 'completed' {
    const statusMap: Record<string, 'upcoming' | 'active' | 'ended' | 'completed'> = {
      'ACTIVE': 'active',
      'DRAWN': 'completed',
      'COMPLETED': 'completed',
      'CANCELLED': 'ended',
      'UPCOMING': 'upcoming',
    }
    return statusMap[status.toUpperCase()] || 'active'
  },

  // Get lottery by ID
  async getLottery(id: string): Promise<Lottery> {
    try {
      const response = await apiClient.get<any>(`/lotteries/${id}/`)
      return {
        id: response.id.toString(),
        organizationId: (response.created_by?.id || response.created_by)?.toString() || '',
        name: response.name,
        description: response.description || '',
        ticketPrice: parseFloat(response.ticket_price || 0),
        totalTickets: response.total_tickets || 0,
        ticketsSold: response.available_tickets ? response.total_tickets - response.available_tickets : 0,
        drawDate: response.draw_date,
        prizePool: parseFloat(response.prize_amount || 0),
        status: this.mapStatus(response.status),
        imageUrl: response.image_url,
      }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Create lottery (admin)
  async createLottery(data: CreateLotteryRequest): Promise<Lottery> {
    try {
      const response = await apiClient.post<any>('/lotteries/', {
        name: data.name,
        description: data.description,
        ticket_price: data.ticketPrice,
        total_tickets: data.totalTickets,
        prize_amount: data.prizePool,
        draw_date: data.drawDate,
        status: 'ACTIVE',
      })
      return this.getLottery(response.id.toString())
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Update lottery (admin)
  async updateLottery(
    id: string,
    data: Partial<CreateLotteryRequest>,
  ): Promise<Lottery> {
    try {
      await apiClient.put(`/lotteries/${id}/`, data)
      return this.getLottery(id)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Delete lottery (admin)
  async deleteLottery(id: string): Promise<ApiResponse> {
    try {
      const response = await apiClient.delete(`/lotteries/${id}/`)
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Purchase tickets
  async purchaseTickets(data: PurchaseTicketsRequest): Promise<Ticket[]> {
    try {
      const response = await apiClient.post<any[]>(
        `/lotteries/${data.lotteryId}/buy_ticket/`,
        { quantity: data.quantity },
      )
      return response.map((ticket: any) => ({
        id: ticket.id.toString(),
        lotteryId: ticket.lottery_id?.toString() || data.lotteryId,
        userId: ticket.user_id?.toString() || '',
        purchaseDate: ticket.purchased_at || new Date().toISOString(),
        ticketNumber: ticket.ticket_number || '',
      }))
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get user's tickets for a lottery
  async getMyTickets(lotteryId: string): Promise<Ticket[]> {
    try {
      const response = await apiClient.get<any[]>(
        `/lotteries/${lotteryId}/my_tickets/`,
      )
      return response.map((ticket: any) => ({
        id: ticket.id.toString(),
        lotteryId: ticket.lottery_id?.toString() || lotteryId,
        userId: ticket.user_id?.toString() || '',
        purchaseDate: ticket.purchased_at || new Date().toISOString(),
        ticketNumber: ticket.ticket_number || '',
      }))
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Execute draw (admin)
  async executeDraw(lotteryId: string): Promise<DrawResult> {
    try {
      const response = await apiClient.post<any>(
        `/lotteries/${lotteryId}/draw/`,
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get draw results
  async getDrawResults(lotteryId: string): Promise<DrawResult> {
    try {
      const response = await apiClient.get<any>(
        `/lotteries/${lotteryId}/results/`,
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get winner details
  async getWinner(lotteryId: string): Promise<{
    userId: string
    userName: string
    ticketNumber: string
    prizeAmount: number
    paidAt: string
  }> {
    try {
      const response = await apiClient.get(`/lotteries/${lotteryId}/winner/`)
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get participants (admin)
  async getParticipants(lotteryId: string): Promise<LotteryParticipant[]> {
    try {
      const response = await apiClient.get<any[]>(
        `/lotteries/${lotteryId}/participants/`,
      )
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },

  // Get lottery statistics (admin)
  async getLotteryStats(lotteryId: string): Promise<{
    totalRevenue: number
    totalParticipants: number
    totalTicketsSold: number
    averageTicketsPerUser: number
    conversionRate: number
  }> {
    try {
      const response = await apiClient.get(`/lotteries/${lotteryId}/stats/`)
      return response
    } catch (error) {
      throw handleApiError(error)
    }
  },
}

