// Safely access environment variables with fallbacks
const getEnvVar = (key: string, defaultValue: string): string => {
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    return import.meta.env[key] || defaultValue
  }
  return defaultValue
}

export const API_CONFIG = {
  baseURL: getEnvVar('VITE_API_BASE_URL', 'http://localhost:8000/api'),
  wsURL: getEnvVar('VITE_WS_URL', 'ws://localhost:8000/ws'),
  timeout: 30000,
  withCredentials: true, // For httpOnly cookies
}

export const STRIPE_CONFIG = {
  publicKey: getEnvVar('VITE_STRIPE_PUBLIC_KEY', ''),
}

export const APP_CONFIG = {
  env: getEnvVar('VITE_APP_ENV', 'development'),
  isDevelopment: getEnvVar('VITE_APP_ENV', 'development') === 'development',
  isProduction: getEnvVar('VITE_APP_ENV', 'development') === 'production',
}

