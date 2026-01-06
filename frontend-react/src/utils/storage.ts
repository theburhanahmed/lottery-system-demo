// Token Storage Utilities

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'

export const storage = {
  // Access Token (stored in memory for security)
  getAccessToken: (): string | null => {
    return sessionStorage.getItem(ACCESS_TOKEN_KEY)
  },

  setAccessToken: (token: string): void => {
    sessionStorage.setItem(ACCESS_TOKEN_KEY, token)
  },

  removeAccessToken: (): void => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
  },

  // Refresh Token (stored in localStorage, but ideally should be httpOnly cookie)
  getRefreshToken: (): string | null => {
    return localStorage.getItem(REFRESH_TOKEN_KEY)
  },

  setRefreshToken: (token: string): void => {
    localStorage.setItem(REFRESH_TOKEN_KEY, token)
  },

  removeRefreshToken: (): void => {
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },

  // Clear all tokens
  clearTokens: (): void => {
    sessionStorage.removeItem(ACCESS_TOKEN_KEY)
    localStorage.removeItem(REFRESH_TOKEN_KEY)
  },
}

