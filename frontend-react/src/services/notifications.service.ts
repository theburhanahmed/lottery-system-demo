import { apiClient, handleApiError } from '../utils/api'
import type { AdapterNotification } from '../types/adapter'

function mapNotification(notif: any): AdapterNotification {
  const typeMap: Record<string, AdapterNotification['type']> = {
    TICKET_PURCHASED: 'promo',
    DRAW_RESULT: 'draw',
    WINNER: 'win',
    WITHDRAWAL_STATUS: 'system',
    REFERRAL_BONUS: 'promo',
    SYSTEM: 'system',
  }
  return {
    id: notif.id,
    date: notif.created_at?.split('T')[0] || new Date().toISOString().split('T')[0],
    title: notif.title || '',
    message: notif.message || '',
    read: notif.is_read ?? false,
    type: typeMap[notif.type?.toUpperCase()] || 'system',
  }
}

export const notificationsService = {
  async list(): Promise<AdapterNotification[]> {
    try {
      const response = await apiClient.get<any>('/notifications/')
      const items = Array.isArray(response) ? response : response.results || []
      return items.map(mapNotification)
    } catch (error) {
      console.error('Failed to fetch notifications:', error)
      return []
    }
  },

  async markAsRead(id: string): Promise<void> {
    try {
      await apiClient.post(`/notifications/${id}/mark_as_read/`)
    } catch (error) {
      throw handleApiError(error)
    }
  },

  async markAllAsRead(): Promise<void> {
    try {
      await apiClient.post('/notifications/mark_all_as_read/')
    } catch (error) {
      throw handleApiError(error)
    }
  },
}
