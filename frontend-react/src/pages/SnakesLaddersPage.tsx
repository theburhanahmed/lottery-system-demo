import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Dices, Loader2, Trophy, LogOut, ArrowDown, ArrowUp } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { useAuth } from '../contexts/AuthContext'
import { gamesService } from '../services/games.service'
import type { GameRoomDetail, SnakesLaddersState } from '../services/games.service'
import { API_CONFIG } from '../config/api.config'
import { storage } from '../utils/storage'

// Classic snakes and ladders for display (cell -> destination)
const SNAKES: Record<number, number> = {
  16: 6, 31: 19, 47: 26, 56: 53, 62: 18, 64: 60, 87: 24, 93: 73, 95: 75, 98: 78,
}
const LADDERS: Record<number, number> = {
  1: 38, 4: 14, 9: 31, 21: 42, 28: 84, 36: 44, 51: 67, 71: 91, 80: 100,
}

const PLAYER_COLORS = ['#22c55e', '#3b82f6', '#f59e0b', '#ef4444']

interface SnakesLaddersPageProps {
  roomId: string;
  addToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function SnakesLaddersPage({ roomId, addToast }: SnakesLaddersPageProps) {
  const navigate = useNavigate()
  const { user: authUser } = useAuth()
  const [room, setRoom] = useState<GameRoomDetail | null>(null)
  const [state, setState] = useState<SnakesLaddersState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [rolling, setRolling] = useState(false)
  const wsRef = useRef<WebSocket | null>(null)

  const currentUserId = authUser?.id ?? null
  const myPlayerIndex = state?.players?.findIndex((p) => p.user_id === currentUserId) ?? -1
  const isMyTurn =
    state?.phase === 'rolling' &&
    state?.current_turn_index !== undefined &&
    state?.players?.[state.current_turn_index]?.user_id === currentUserId
  const isFinished = state?.phase === 'finished'
  const currentTurnPlayer = state?.players?.[state?.current_turn_index ?? -1]
  const currentTurnUsername = currentTurnPlayer ? room?.players.find((rp) => rp.user_id === currentTurnPlayer.user_id)?.username : null

  const connectWs = useCallback(() => {
    if (!roomId) return () => {}
    const token = storage.getAccessToken()
    if (!token) return () => {}
    const base = API_CONFIG.wsURL.replace(/\/$/, '')
    const url = `${base}/games/${roomId}/?token=${encodeURIComponent(token)}`
    const ws = new WebSocket(url)
    ws.onopen = () => {}
    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (data.type === 'game_state' && data.payload) {
          setState(data.payload)
        }
        if (data.type === 'error' && data.payload?.message) {
          setError(data.payload.message)
          addToast?.(data.payload.message, 'error')
        }
      } catch (_) {}
    }
    ws.onerror = () => {
      setError('WebSocket error')
      addToast?.('Connection error. Please refresh.', 'error')
    }
    ws.onclose = () => {}
    wsRef.current = ws
    return () => {
      ws.close()
      wsRef.current = null
    }
  }, [roomId, addToast])

  useEffect(() => {
    if (!roomId) {
      setError('Missing room ID')
      setLoading(false)
      return
    }
    setLoading(true)
    setError(null)
    gamesService
      .getRoom(roomId)
      .then((r) => {
        setRoom(r)
        if (r.state) setState(r.state)
        if (r.status === 'IN_PROGRESS' || r.status === 'COMPLETED') {
          connectWs()
        }
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load room')
        addToast?.(err?.message || 'Failed to load room', 'error')
      })
      .finally(() => setLoading(false))
    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [roomId, connectWs, addToast])

  const handleStart = () => {
    if (!roomId) return
    setLoading(true)
    gamesService
      .startGame(roomId)
      .then((r) => {
        setRoom(r)
        setState(r.state)
        connectWs()
        addToast?.('Game started!', 'success')
      })
      .catch((err) => {
        addToast?.(err?.message || 'Failed to start', 'error')
      })
      .finally(() => setLoading(false))
  }

  const handleRollDice = () => {
    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN || !isMyTurn || rolling) return
    setRolling(true)
    wsRef.current.send(JSON.stringify({ type: 'action', payload: { action: 'roll_dice' } }))
    setTimeout(() => setRolling(false), 800)
  }

  if (loading && !room) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <Loader2 size={40} className="animate-spin text-emerald-600" />
      </div>
    )
  }

  if (error && !room) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
        <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
        <Link to="/games/snakes-ladders">
          <Button variant="primary">Back to Lobby</Button>
        </Link>
      </div>
    )
  }

  if (!room) return null

  const canStart =
    room.status === 'WAITING' &&
    room.players.length >= room.min_players

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 py-6 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <Link to="/games/snakes-ladders" className="text-emerald-600 dark:text-emerald-400 text-sm hover:underline">
              Back to Lobby
            </Link>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/games/snakes-ladders')}
              className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400"
            >
              <LogOut size={14} /> Leave room
            </Button>
          </div>
          <span className="text-slate-600 dark:text-slate-400 text-sm">
            Entry: ${room.entry_fee} · {room.players.length}/{room.max_players} players
          </span>
        </div>

        {room.status === 'WAITING' && (
          <Card className="p-4 mb-4">
            <p className="text-slate-700 dark:text-slate-300 mb-2">
              Waiting for players. Need {room.min_players} to start.
            </p>
            {canStart && (
              <Button variant="primary" onClick={handleStart} disabled={loading}>
                Start game
              </Button>
            )}
          </Card>
        )}

        {room.status === 'IN_PROGRESS' && state && state.players && state.players.length > 0 && (
          <Card className="p-3 mb-4">
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Players</p>
            <div className="flex flex-wrap gap-3">
              {state.players.map((p, idx) => {
                const username = room.players.find((rp) => rp.user_id === p.user_id)?.username ?? 'Player'
                const pos = p.position ?? 0
                const isCurrentTurn = state.current_turn_index === idx
                return (
                  <div
                    key={p.user_id}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border ${
                      isCurrentTurn ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20' : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-4 h-4 rounded-full border-2 border-white shadow flex-shrink-0"
                      style={{ backgroundColor: PLAYER_COLORS[idx % PLAYER_COLORS.length] }}
                    />
                    <span className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-[100px]">{username}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">#{pos}</span>
                    {isCurrentTurn && <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">Turn</span>}
                  </div>
                )
              })}
            </div>
          </Card>
        )}

        {room.status === 'IN_PROGRESS' && state && (
          <>
            <div className="flex flex-wrap justify-between items-center gap-3 mb-4">
              <div className="flex items-center gap-3 flex-wrap">
                {state.last_dice != null && (
                  <span className="text-2xl font-bold text-slate-800 dark:text-white">
                    Dice: {state.last_dice}
                  </span>
                )}
                <span className="text-sm font-semibold text-slate-600 dark:text-slate-400">
                  {isMyTurn ? (
                    <span className="text-emerald-600 dark:text-emerald-400">Your turn — roll the dice!</span>
                  ) : currentTurnUsername ? (
                    <span>{currentTurnUsername}&apos;s turn</span>
                  ) : null}
                </span>
                {state.winner_id && (
                  <span className="flex items-center gap-1 text-amber-600 dark:text-amber-400 font-semibold">
                    <Trophy size={20} /> Winner!
                  </span>
                )}
              </div>
              <Button
                variant="primary"
                disabled={!isMyTurn || rolling}
                onClick={handleRollDice}
                className="flex items-center gap-2"
              >
                {rolling ? <Loader2 size={18} className="animate-spin" /> : <Dices size={18} />}
                Roll dice
              </Button>
            </div>

            <Board state={state} room={room} />
          </>
        )}

        {room.status === 'COMPLETED' && state && (
          <Card className="p-6 text-center mb-4">
            <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">Game over</h3>
            {state.winner_id && (
              <p className="text-emerald-600 dark:text-emerald-400 font-medium">
                Winner: {room.players.find((p) => p.user_id === state.winner_id)?.username || state.winner_id}
              </p>
            )}
            <Link to="/games/snakes-ladders" className="inline-block mt-4">
              <Button variant="primary">Back to Lobby</Button>
            </Link>
          </Card>
        )}
      </div>
    </div>
  )
}

function Board({ state, room }: { state: SnakesLaddersState; room: GameRoomDetail }) {
  const rows: number[][] = []
  for (let r = 9; r >= 0; r--) {
    const row = []
    const start = r * 10 + 1
    const inc = r % 2 === 0 ? 1 : -1
    for (let i = 0; i < 10; i++) {
      row.push(start + i * inc)
    }
    rows.push(row)
  }

  const positionToCell: Record<string, number> = {}
  state.players?.forEach((p) => {
    positionToCell[p.user_id] = p.position
  })

  return (
    <Card padding={false} className="overflow-hidden">
      <div className="p-2 bg-amber-100 dark:bg-amber-900/30">
        <div className="grid grid-cols-10 gap-0.5">
          {rows.map((row, ri) =>
            row.map((cell) => {
              const isSnake = cell in SNAKES
              const isLadder = cell in LADDERS
              const playersHere = state.players?.filter((p) => (positionToCell[p.user_id] || 0) === cell) ?? []
              return (
                <div
                  key={cell}
                  className={`
                    aspect-square rounded flex items-center justify-center text-xs font-bold relative
                    ${isSnake ? 'bg-red-200 dark:bg-red-900/50' : isLadder ? 'bg-green-200 dark:bg-green-900/50' : 'bg-white dark:bg-slate-700'}
                    text-slate-800 dark:text-slate-200
                  `}
                >
                  <span className="relative z-10">{cell}</span>
                  {isSnake && (
                    <span className="absolute bottom-0.5 right-0.5 text-red-600 dark:text-red-400 opacity-80" title="Snake"><ArrowDown size={10} /></span>
                  )}
                  {isLadder && (
                    <span className="absolute top-0.5 right-0.5 text-green-700 dark:text-green-500 opacity-80" title="Ladder"><ArrowUp size={10} /></span>
                  )}
                  {playersHere.length > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center gap-0.5 pointer-events-none flex-wrap">
                      {playersHere.map((p, i) => (
                        <div
                          key={p.user_id}
                          className="w-4 h-4 rounded-full border-2 border-white shadow flex-shrink-0"
                          style={{
                            backgroundColor: PLAYER_COLORS[state.players!.indexOf(p) % PLAYER_COLORS.length],
                            marginLeft: i > 0 ? '-2px' : 0,
                            marginTop: i > 0 ? '-1px' : 0,
                          }}
                          title={room.players.find((rp) => rp.user_id === p.user_id)?.username}
                        />
                      ))}
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </div>
    </Card>
  )
}
