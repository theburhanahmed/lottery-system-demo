import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { useWallet } from '../contexts/WalletContext'
import { useLottery } from '../contexts/LotteryContext'
import { lotteryService } from '../services/lottery.service'
import { walletService } from '../services/wallet.service'
import { notificationsService } from '../services/notifications.service'
import { userService } from '../services/user.service'
import type {
  AdapterUser,
  AdapterLottery,
  AdapterTicket,
  AdapterTransaction,
  AdapterNotification,
  ToastItem,
} from '../types/adapter'

function mapUser(user: { id: string; name: string; email: string; role: string; walletBalance: number } | null): AdapterUser | null {
  if (!user) return null
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role === 'org_admin' ? 'admin' : 'user',
    walletBalance: user.walletBalance,
  }
}

function mapLottery(l: {
  id: string
  name: string
  description: string
  ticketPrice: number
  totalTickets: number
  ticketsSold: number
  prizePool: number
  drawDate: string
  status: string
}): AdapterLottery {
  const statusMap: Record<string, AdapterLottery['status']> = {
    active: 'active',
    upcoming: 'upcoming',
    ended: 'completed',
    completed: 'completed',
  }
  return {
    id: l.id,
    title: l.name,
    description: l.description || '',
    ticketPrice: l.ticketPrice,
    totalTickets: l.totalTickets,
    ticketsSold: l.ticketsSold,
    prizeAmount: l.prizePool,
    drawDate: l.drawDate,
    status: (statusMap[l.status] as AdapterLottery['status']) || 'active',
  }
}

function mapTicket(
  t: { id: string; lotteryId: string; userId: string; purchaseDate: string; ticketNumber: string },
  lotteryName: string,
  drawDate: string
): AdapterTicket {
  return {
    id: t.id,
    lotteryId: t.lotteryId,
    lotteryTitle: lotteryName,
    ticketNumber: t.ticketNumber,
    purchaseDate: t.purchaseDate?.split('T')[0] || t.purchaseDate,
    status: 'pending',
    drawDate,
  }
}

function mapTransaction(
  t: { id: string; type: string; amount: number; date: string; description: string },
  balanceAfter: number
): AdapterTransaction {
  const typeMap: Record<string, AdapterTransaction['type']> = {
    deposit: 'deposit',
    purchase: 'purchase',
    winnings: 'winning',
    referral: 'deposit',
    withdrawal: 'withdrawal',
  }
  return {
    id: t.id,
    date: t.date?.split('T')[0] || t.date,
    type: (typeMap[t.type] as AdapterTransaction['type']) || 'deposit',
    description: t.description || '',
    amount: t.amount,
    balanceAfter,
  }
}

export function useAppStateAdapter() {
  const { user: authUser, login: authLogin, logout: authLogout } = useAuth()
  const { balance, transactions, refreshWallet } = useWallet()
  const {
    lotteries: contextLotteries,
    purchaseTickets,
    createLottery: contextCreateLottery,
    refreshLotteries,
    getLottery,
  } = useLottery()

  const [tickets, setTickets] = useState<AdapterTicket[]>([])
  const [notifications, setNotifications] = useState<AdapterNotification[]>([])
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const user = mapUser(authUser)

  const lotteries = contextLotteries.map(mapLottery)

  const adapterTransactions: AdapterTransaction[] = (() => {
    const sorted = [...transactions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    let runningBalance = balance
    return sorted
      .map((t) => {
        const isCredit = t.type === 'deposit' || t.type === 'winnings' || t.type === 'referral'
        if (isCredit) runningBalance -= t.amount
        else runningBalance += t.amount
        const bal = runningBalance
        if (isCredit) runningBalance += t.amount
        else runningBalance -= t.amount
        return mapTransaction(t, bal)
      })
      .reverse()
  })()

  useEffect(() => {
    if (!authUser) {
      setTickets([])
      setNotifications([])
      return
    }
    const loadTickets = async () => {
      try {
        const allTickets = await lotteryService.getAllTickets()
        const mapped: AdapterTicket[] = allTickets.map((t) => {
          const lottery = getLottery(t.lotteryId)
          return mapTicket(t, lottery?.name || 'Lottery', lottery?.drawDate || '')
        })
        setTickets(mapped)
      } catch {
        setTickets([])
      }
    }
    loadTickets()
  }, [authUser, contextLotteries, getLottery])

  useEffect(() => {
    if (!authUser) return
    notificationsService.list().then(setNotifications)
  }, [authUser])

  const addToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = Date.now().toString()
    setToasts((prev) => [...prev, { id, message, type }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 3500)
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const markNotificationRead = useCallback(
    async (id: string) => {
      try {
        await notificationsService.markAsRead(id)
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
      } catch {
        // optimistic update
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, read: true } : n))
        )
      }
    },
    []
  )

  const markAllNotificationsRead = useCallback(async () => {
    try {
      await notificationsService.markAllAsRead()
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    } catch {
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
    }
  }, [])

  const clearNotifications = useCallback(() => {
    setNotifications([])
  }, [])

  const login = useCallback(
    async (email: string, password: string, _role: 'user' | 'admin' = 'user') => {
      await authLogin(email, password)
      addToast('Welcome back! You are now logged in.', 'success')
    },
    [authLogin, addToast]
  )

  const logout = useCallback(async () => {
    await authLogout()
    addToast('You have been logged out.', 'info')
  }, [authLogout, addToast])

  const buyTicket = useCallback(
    async (lotteryId: string, quantity: number, _pickedNumbers?: number[][]) => {
      if (!authUser) return false
      try {
        const ok = await purchaseTickets(lotteryId, quantity)
        if (ok) {
          addToast(
            `Successfully purchased ${quantity} ticket${quantity > 1 ? 's' : ''}!`,
            'success'
          )
          const allTickets = await lotteryService.getAllTickets()
          const lottery = getLottery(lotteryId)
          const mapped = allTickets
            .filter((t) => t.lotteryId === lotteryId)
            .map((t) =>
              mapTicket(t, lottery?.name || 'Lottery', lottery?.drawDate || '')
            )
          setTickets((prev) => {
            const existingIds = new Set(prev.map((p) => p.id))
            const newOnes = mapped.filter((m) => !existingIds.has(m.id))
            return [...newOnes, ...prev]
          })
        }
        return ok
      } catch (err: any) {
        addToast(err?.message || 'Failed to purchase tickets.', 'error')
        return false
      }
    },
    [authUser, purchaseTickets, addToast, getLottery]
  )

  const addFunds = useCallback(
    async (amount: number, _method: string) => {
      if (!authUser) return
      try {
        const { clientSecret } = await walletService.requestDeposit({ amount })
        if (clientSecret) {
          addToast(
            `Payment initiated for $${amount.toLocaleString()}. Complete payment in the checkout flow.`,
            'info'
          )
          await refreshWallet()
        }
      } catch (err: any) {
        addToast(err?.message || 'Deposit failed.', 'error')
      }
    },
    [authUser, refreshWallet, addToast]
  )

  const withdrawFunds = useCallback(
    async (amount: number, method: string) => {
      if (!authUser) return
      if (amount > (user?.walletBalance ?? 0)) {
        addToast('Insufficient funds for withdrawal.', 'error')
        return
      }
      try {
        await walletService.requestWithdrawal({
          amount,
          withdrawalMethod: method as 'bank_transfer' | 'paypal' | 'crypto',
          accountDetails: {},
        })
        addToast(
          `$${amount.toLocaleString()} withdrawal requested successfully!`,
          'success'
        )
        await refreshWallet()
      } catch (err: any) {
        addToast(err?.message || 'Withdrawal failed.', 'error')
      }
    },
    [authUser, user?.walletBalance, refreshWallet, addToast]
  )

  const createLottery = useCallback(
    async (data: Omit<AdapterLottery, 'id' | 'ticketsSold'> & { coverImage?: File | null }) => {
      await contextCreateLottery({
        name: data.title,
        description: data.description,
        ticketPrice: data.ticketPrice,
        totalTickets: data.totalTickets,
        prizePool: data.prizeAmount,
        drawDate: data.drawDate,
        imageUrl: data.coverImage || undefined,
      })
      addToast(`Lottery "${data.title}" created successfully!`, 'success')
      await refreshLotteries()
    },
    [contextCreateLottery, addToast, refreshLotteries]
  )

  const runDraw = useCallback(
    async (lotteryId: string) => {
      try {
        await lotteryService.executeDraw(lotteryId)
        addToast('Draw completed successfully!', 'success')
        await refreshLotteries()
        await refreshWallet()
      } catch (err: any) {
        addToast(err?.message || 'Draw failed.', 'error')
      }
    },
    [refreshLotteries, refreshWallet, addToast]
  )

  const updateProfile = useCallback(
    async (data: { name?: string; email?: string }) => {
      try {
        const parts = (data.name || '').trim().split(/\s+/)
        const updateData: { first_name?: string; last_name?: string } = {}
        if (parts.length >= 1) updateData.first_name = parts[0]
        if (parts.length >= 2) updateData.last_name = parts.slice(1).join(' ')
        await userService.updateProfile(updateData)
        addToast('Profile updated successfully!', 'success')
      } catch (err: any) {
        addToast(err?.message || 'Profile update failed.', 'error')
      }
    },
    [addToast]
  )

  const setDepositLimit = useCallback(
    async (limits: { daily?: number; weekly?: number; monthly?: number }) => {
      try {
        await userService.setDepositLimits({
          daily_deposit_limit: limits.daily != null ? String(limits.daily) : null,
          weekly_deposit_limit: limits.weekly != null ? String(limits.weekly) : null,
          monthly_deposit_limit: limits.monthly != null ? String(limits.monthly) : null,
        })
        addToast('Deposit limits updated successfully!', 'success')
      } catch (err: any) {
        addToast(err?.message || 'Failed to update limits.', 'error')
      }
    },
    [addToast]
  )

  const selfExclude = useCallback(
    async (until: string) => {
      try {
        const untilDate = new Date(until)
        const now = new Date()
        const days = Math.ceil((untilDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        await userService.selfExclude(days > 0 ? days : null)
        addToast('Self-exclusion activated. You will be logged out.', 'info')
        setTimeout(() => authLogout(), 2000)
      } catch (err: any) {
        addToast(err?.message || 'Self-exclusion failed.', 'error')
      }
    },
    [authLogout, addToast]
  )

  const addNotification = useCallback(
    (notification: Omit<AdapterNotification, 'id' | 'date' | 'read'>) => {
      const newNotification: AdapterNotification = {
        ...notification,
        id: `n${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        read: false,
      }
      setNotifications((prev) => [newNotification, ...prev])
    },
    []
  )

  return {
    user,
    lotteries,
    tickets,
    transactions: adapterTransactions,
    toasts,
    notifications,
    login,
    logout,
    buyTicket,
    addFunds,
    withdrawFunds,
    createLottery,
    runDraw,
    updateProfile,
    setDepositLimit,
    selfExclude,
    addToast,
    removeToast,
    addNotification,
    markNotificationRead,
    markAllNotificationsRead,
    clearNotifications,
  }
}
