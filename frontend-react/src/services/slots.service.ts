import { apiClient, handleApiError } from '../utils/api'

export interface SlotsGame {
  id: string
  name: string
  description: string
  is_active: boolean
  paytable: Record<string, number>
  reels?: string[][]
  rtp_percent: number
  min_bet: number
  max_bet: number
  created_at: string
}

export interface SpinResult {
  id: string
  symbols: string[]
  bet_amount: number
  payout: number
  random_seed: string
  created_at: string
}

export interface SlotsSpin {
  id: string
  game: string
  game_name: string
  bet_amount: number
  symbols: string[]
  payout: number
  random_seed: string
  created_at: string
}

export const slotsService = {
  async getGames(): Promise<SlotsGame[]> {
    try {
      const response = await apiClient.get<any>('/slots/games/')
      const games = Array.isArray(response) ? response : response.results || []
      return games.map((g: any) => ({
        id: g.id,
        name: g.name,
        description: g.description || '',
        is_active: g.is_active ?? true,
        paytable: g.paytable || {},
        reels: g.reels,
        rtp_percent: parseFloat(g.rtp_percent || 96),
        min_bet: parseFloat(g.min_bet || 0.1),
        max_bet: parseFloat(g.max_bet || 100),
        created_at: g.created_at,
      }))
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async getGame(id: string): Promise<SlotsGame> {
    try {
      const g = await apiClient.get<any>(`/slots/games/${id}/`)
      return {
        id: g.id,
        name: g.name,
        description: g.description || '',
        is_active: g.is_active ?? true,
        paytable: g.paytable || {},
        reels: g.reels,
        rtp_percent: parseFloat(g.rtp_percent || 96),
        min_bet: parseFloat(g.min_bet || 0.1),
        max_bet: parseFloat(g.max_bet || 100),
        created_at: g.created_at,
      }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async spin(gameId: string, betAmount: number): Promise<SpinResult> {
    try {
      const result = await apiClient.post<any>(`/slots/games/${gameId}/spin/`, {
        bet_amount: betAmount.toString(),
      })
      return {
        id: result.id,
        symbols: result.symbols || [],
        bet_amount: result.bet_amount ?? betAmount,
        payout: result.payout ?? 0,
        random_seed: result.random_seed || '',
        created_at: result.created_at || new Date().toISOString(),
      }
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async getMySpins(limit = 20): Promise<SlotsSpin[]> {
    try {
      const response = await apiClient.get<any>('/slots/spins/', {
        params: { page_size: limit },
      })
      const spins = Array.isArray(response) ? response : response.results || []
      return spins.map((s: any) => ({
        id: s.id,
        game: s.game,
        game_name: s.game_name || '',
        bet_amount: parseFloat(s.bet_amount || 0),
        symbols: s.symbols || [],
        payout: parseFloat(s.payout || 0),
        random_seed: s.random_seed || '',
        created_at: s.created_at,
      }))
    } catch (error) {
      throw handleApiError(error)
    }
  },
}
