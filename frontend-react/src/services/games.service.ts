import { apiClient, handleApiError } from '../utils/api'

export type GameKind = 'SNAKES_LADDERS'

export interface GameRoomPlayer {
  id: string
  user_id: string
  username: string
  position: number
  result?: string
  payout?: string
  joined_at: string
}

export interface GameRoomListItem {
  id: string
  game_kind: GameKind
  status: string
  entry_fee: string
  min_players: number
  max_players: number
  created_by_username: string
  player_count: number
  created_at: string
}

export interface GameRoomDetail extends GameRoomListItem {
  created_by: string
  players: GameRoomPlayer[]
  state: SnakesLaddersState | null
  started_at: string | null
  ended_at: string | null
  config: Record<string, unknown>
}

export interface SnakesLaddersState {
  players: Array<{ user_id: string; position: number }>
  current_turn_index: number
  last_dice: number | null
  winner_id: string | null
  phase: 'rolling' | 'finished'
  extra_turn?: boolean
}

export const gamesService = {
  async listRooms(
    gameKind: GameKind = 'SNAKES_LADDERS',
    status = 'WAITING'
  ): Promise<GameRoomListItem[]> {
    try {
      return await apiClient.get<GameRoomListItem[]>(
        `/games/rooms/?game_kind=${gameKind}&status=${status}`
      )
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async getRoom(roomId: string): Promise<GameRoomDetail> {
    try {
      return await apiClient.get<GameRoomDetail>(`/games/rooms/${roomId}/`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async createRoom(data: {
    game_kind: GameKind
    entry_fee: string
    config?: Record<string, unknown>
  }): Promise<GameRoomDetail> {
    try {
      return await apiClient.post<GameRoomDetail>('/games/rooms/', data)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async joinRoom(roomId: string): Promise<GameRoomDetail> {
    try {
      return await apiClient.post<GameRoomDetail>(`/games/rooms/${roomId}/join/`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async leaveRoom(roomId: string): Promise<GameRoomDetail | { status: string }> {
    try {
      return await apiClient.post<GameRoomDetail | { status: string }>(
        `/games/rooms/${roomId}/leave/`
      )
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async startGame(roomId: string): Promise<GameRoomDetail> {
    try {
      return await apiClient.post<GameRoomDetail>(`/games/rooms/${roomId}/start/`)
    } catch (error) {
      throw handleApiError(error)
    }
  },
}
