import { API_CONFIG } from '../config/api.config'
import { storage } from './storage'

type MessageHandler = (data: any) => void
type ErrorHandler = (error: Event) => void
type CloseHandler = (event: CloseEvent) => void

export class WebSocketClient {
  private ws: WebSocket | null = null
  private reconnectAttempts = 0
  private maxReconnectAttempts = 5
  private reconnectDelay = 1000
  private messageHandlers: Map<string, MessageHandler[]> = new Map()
  private errorHandlers: ErrorHandler[] = []
  private closeHandlers: CloseHandler[] = []
  private isIntentionallyClosed = false

  constructor(private endpoint: string = '') {}

  connect(): void {
    const token = storage.getAccessToken()
    if (!token) {
      console.error('No access token available for WebSocket connection')
      return
    }

    const wsUrl = `${API_CONFIG.wsURL}${this.endpoint}?token=${token}`
    this.ws = new WebSocket(wsUrl)
    this.isIntentionallyClosed = false

    this.ws.onopen = () => {
      console.log('WebSocket connected')
      this.reconnectAttempts = 0
    }

    this.ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        const { type, payload } = data

        // Call all handlers registered for this message type
        const handlers = this.messageHandlers.get(type) || []
        handlers.forEach((handler) => handler(payload))

        // Also call handlers registered for 'all' events
        const allHandlers = this.messageHandlers.get('*') || []
        allHandlers.forEach((handler) => handler(data))
      } catch (error) {
        console.error('Error parsing WebSocket message:', error)
      }
    }

    this.ws.onerror = (error) => {
      console.error('WebSocket error:', error)
      this.errorHandlers.forEach((handler) => handler(error))
    }

    this.ws.onclose = (event) => {
      console.log('WebSocket closed:', event.code, event.reason)
      this.closeHandlers.forEach((handler) => handler(event))

      // Attempt to reconnect if not intentionally closed
      if (
        !this.isIntentionallyClosed &&
        this.reconnectAttempts < this.maxReconnectAttempts
      ) {
        this.reconnectAttempts++
        const delay =
          this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1)
        console.log(
          `Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`,
        )
        setTimeout(() => this.connect(), delay)
      }
    }
  }

  disconnect(): void {
    this.isIntentionallyClosed = true
    if (this.ws) {
      this.ws.close()
      this.ws = null
    }
  }

  send(type: string, payload: any): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({ type, payload }))
    } else {
      console.error('WebSocket is not connected')
    }
  }

  on(type: string, handler: MessageHandler): () => void {
    if (!this.messageHandlers.has(type)) {
      this.messageHandlers.set(type, [])
    }
    this.messageHandlers.get(type)!.push(handler)

    // Return unsubscribe function
    return () => {
      const handlers = this.messageHandlers.get(type)
      if (handlers) {
        const index = handlers.indexOf(handler)
        if (index > -1) {
          handlers.splice(index, 1)
        }
      }
    }
  }

  onError(handler: ErrorHandler): () => void {
    this.errorHandlers.push(handler)
    return () => {
      const index = this.errorHandlers.indexOf(handler)
      if (index > -1) {
        this.errorHandlers.splice(index, 1)
      }
    }
  }

  onClose(handler: CloseHandler): () => void {
    this.closeHandlers.push(handler)
    return () => {
      const index = this.closeHandlers.indexOf(handler)
      if (index > -1) {
        this.closeHandlers.splice(index, 1)
      }
    }
  }

  isConnected(): boolean {
    return this.ws !== null && this.ws.readyState === WebSocket.OPEN
  }
}

// Singleton instance for notifications
export const notificationWS = new WebSocketClient('/notifications')

// Helper to initialize WebSocket connections
export const initializeWebSockets = (): void => {
  notificationWS.connect()
}

// Helper to cleanup WebSocket connections
export const cleanupWebSockets = (): void => {
  notificationWS.disconnect()
}

