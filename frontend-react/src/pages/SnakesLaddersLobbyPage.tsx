import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Plus, Users, Coins, Loader2, Gamepad2 } from 'lucide-react'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { gamesService } from '../services/games.service'
import type { GameRoomListItem, GameRoomDetail } from '../services/games.service'

const ENTRY_OPTIONS = ['1', '2', '5', '10', '25']

interface SnakesLaddersLobbyPageProps {
  addToast?: (msg: string, type: 'success' | 'error' | 'info') => void;
}

export function SnakesLaddersLobbyPage({ addToast }: SnakesLaddersLobbyPageProps) {
  const [rooms, setRooms] = useState<GameRoomListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [creating, setCreating] = useState(false)
  const [createEntry, setCreateEntry] = useState('1')
  const [showCreate, setShowCreate] = useState(false)
  const navigate = useNavigate()

  const fetchRooms = (showLoading = false) => {
    if (showLoading) setLoading(true)
    gamesService
      .listRooms('SNAKES_LADDERS', 'WAITING')
      .then((data) => setRooms(Array.isArray(data) ? data : []))
      .catch(() => setRooms([]))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchRooms(true)
    const t = setInterval(() => fetchRooms(false), 5000)
    return () => clearInterval(t)
  }, [])

  const handleCreate = () => {
    setCreating(true)
    gamesService
      .createRoom({ game_kind: 'SNAKES_LADDERS', entry_fee: createEntry })
      .then((room: GameRoomDetail) => {
        setShowCreate(false)
        addToast?.('Room created!', 'success')
        navigate(`/games/snakes-ladders/${room.id}`)
      })
      .catch((err: { message?: string }) => {
        addToast?.(err?.message || 'Failed to create room', 'error')
      })
      .finally(() => setCreating(false))
  }

  const handleJoin = (roomId: string) => {
    gamesService
      .joinRoom(roomId)
      .then((room: GameRoomDetail) => {
        addToast?.('Joined room!', 'success')
        navigate(`/games/snakes-ladders/${room.id}`)
      })
      .catch((err: { message?: string }) => {
        addToast?.(err?.message || 'Failed to join room', 'error')
      })
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-slate-50 dark:from-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Snakes & Ladders</h1>
            <p className="text-slate-600 dark:text-slate-400 text-sm mt-1">Create or join a room to play</p>
          </div>
          <Button
            variant="primary"
            onClick={() => setShowCreate(true)}
            className="flex items-center gap-2"
          >
            <Plus size={18} />
            Create room
          </Button>
        </div>

        {showCreate && (
          <Card className="mb-6 p-6">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Entry fee</h3>
            <div className="flex flex-wrap gap-2 mb-4">
              {ENTRY_OPTIONS.map((opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => setCreateEntry(opt)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    createEntry === opt
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  }`}
                >
                  ${opt}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <Button variant="primary" onClick={handleCreate} disabled={creating}>
                {creating ? <Loader2 size={18} className="animate-spin" /> : 'Create'}
              </Button>
              <Button variant="secondary" onClick={() => setShowCreate(false)} disabled={creating}>
                Cancel
              </Button>
            </div>
          </Card>
        )}

        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Waiting rooms</h2>
        {loading && rooms.length === 0 ? (
          <ul className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <li key={i}>
                <Card className="p-4 flex items-center justify-between">
                  <div className="flex items-center gap-4 animate-pulse">
                    <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded" />
                    <div className="h-4 w-24 bg-slate-200 dark:bg-slate-700 rounded" />
                  </div>
                  <div className="h-9 w-16 bg-slate-200 dark:bg-slate-700 rounded-lg animate-pulse" />
                </Card>
              </li>
            ))}
          </ul>
        ) : !loading && rooms.length === 0 ? (
          <Card className="p-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
              <Gamepad2 size={32} className="text-emerald-600 dark:text-emerald-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2">No rooms yet</h3>
            <p className="text-slate-600 dark:text-slate-400 text-sm mb-6 max-w-sm mx-auto">
              Be the first to create a room and invite friends to play Snakes & Ladders.
            </p>
            <Button variant="primary" onClick={() => setShowCreate(true)} className="flex items-center gap-2 mx-auto">
              <Plus size={18} />
              Create a room
            </Button>
          </Card>
        ) : (
          <ul className="space-y-3">
            {rooms.map((room) => (
              <li key={room.id}>
                <Card className="p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                      <Coins size={18} />
                      <span className="font-medium">${room.entry_fee}</span>
                    </span>
                    <span className="flex items-center gap-1.5 text-slate-600 dark:text-slate-400">
                      <Users size={18} />
                      {room.player_count}/{room.max_players}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-500">
                      by {room.created_by_username}
                    </span>
                  </div>
                  <Button variant="primary" size="sm" onClick={() => handleJoin(room.id)}>
                    Join
                  </Button>
                </Card>
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6">
          <Link to="/games" className="text-emerald-600 dark:text-emerald-400 hover:underline text-sm">
            Back to Games
          </Link>
        </div>
      </div>
    </div>
  )
}
