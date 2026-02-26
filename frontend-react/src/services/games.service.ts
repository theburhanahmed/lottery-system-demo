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
  listRooms(gameKind: GameKind = 'SNAKES_LADDERS', status = 'WAITING'): Promise<GameRoomListItem[]> {
    return apiClient
      .get<GameRoomListItem[]>(`/games/rooms/?game_kind=${gameKind}&status=${status}`)
      .catch(handleApiError)
  },

  getRoom(roomId: string): Promise<GameRoomDetail> {
    return apiClient.get<GameRoomDetail>(`/games/rooms/${roomId}/`).catch(handleApiError)
  },

  createRoom(data: { game_kind: GameKind; entry_fee: string; config?: Record<string, unknown> }): Promise<GameRoomDetail> {
    return apiClient.post<GameRoomDetail>('/games/rooms/', data).catch(handleApiError)
  },

  joinRoom(roomId: string): Promise<GameRoomDetail> {
    return apiClient.post<GameRoomDetail>(`/games/rooms/${roomId}/join/`).catch(handleApiError)
  },

  leaveRoom(roomId: string): Promise<GameRoomDetail | { status: string }> {
    return apiClient.post(`/games/rooms/${roomId}/leave/`).catch(handleApiError)
  },

  startGame(roomId: string): Promise<GameRoomDetail> {
    return apiClient.post<GameRoomDetail>(`/games/rooms/${roomId}/start/`).catch(handleApiError)
  },
}
