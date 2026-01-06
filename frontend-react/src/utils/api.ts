import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios'
import { API_CONFIG } from '../config/api.config'
import { storage } from './storage'
import { ApiError, ApiResponse } from '../types/api'

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  withCredentials: API_CONFIG.withCredentials,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = storage.getAccessToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Response interceptor - Handle token refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (value?: any) => void
  reject: (reason?: any) => void
}> = []

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token)
    }
  })
  failedQueue = []
}

api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & {
      _retry?: boolean
    }

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`
            }
            return api(originalRequest)
          })
          .catch((err) => {
            return Promise.reject(err)
          })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = storage.getRefreshToken()

      if (!refreshToken) {
        // No refresh token, logout user
        storage.clearTokens()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        // Attempt to refresh token - adapt to Django backend
        const response = await axios.post(
          `${API_CONFIG.baseURL}/users/refresh-token/`,
          { refresh: refreshToken },
        )

        const { access } = response.data
        storage.setAccessToken(access)

        // Update authorization header
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`
        }

        processQueue(null, access)
        isRefreshing = false

        // Retry original request
        return api(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        storage.clearTokens()
        window.location.href = '/login'
        isRefreshing = false
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

// API Error Handler
export const handleApiError = (error: unknown): ApiError => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>

    if (axiosError.response) {
      // Server responded with error
      const errorData = axiosError.response.data
      
      // Handle Django REST Framework validation errors
      let errorMessage = 'An error occurred'
      if (errorData) {
        if (typeof errorData === 'string') {
          errorMessage = errorData
        } else if (errorData.detail) {
          errorMessage = errorData.detail
        } else if (errorData.message) {
          errorMessage = errorData.message
        } else if (errorData.non_field_errors && Array.isArray(errorData.non_field_errors)) {
          errorMessage = errorData.non_field_errors[0]
        } else if (typeof errorData === 'object') {
          // Extract first error message from validation errors
          const firstKey = Object.keys(errorData)[0]
          if (firstKey) {
            const firstError = errorData[firstKey]
            if (Array.isArray(firstError)) {
              errorMessage = firstError[0]
            } else if (typeof firstError === 'string') {
              errorMessage = firstError
            }
          }
        }
      }
      
      return {
        message: errorMessage || axiosError.message || 'An error occurred',
        errors: errorData?.errors || errorData,
        statusCode: axiosError.response.status,
      }
    } else if (axiosError.request) {
      // Request made but no response
      return {
        message: 'No response from server. Please check your connection.',
        statusCode: 0,
      }
    }
  }

  // Unknown error - log it for debugging
  console.error('Unexpected error:', error)
  return {
    message: error instanceof Error ? error.message : 'An unexpected error occurred',
    statusCode: 500,
  }
}

// Generic API methods - adapt to Django response format
export const apiClient = {
  get: <T = any,>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return api.get(url, config).then((res) => res.data)
  },

  post: <T = any,>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return api.post(url, data, config).then((res) => res.data)
  },

  put: <T = any,>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return api.put(url, data, config).then((res) => res.data)
  },

  patch: <T = any,>(
    url: string,
    data?: any,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return api.patch(url, data, config).then((res) => res.data)
  },

  delete: <T = any,>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<T> => {
    return api.delete(url, config).then((res) => res.data)
  },
}

export default api

