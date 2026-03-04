import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginRadar from 'vite-plugin-radar'
import adsense from 'vite-plugin-adsense'

const GA4_PLACEHOLDER = 'G-XXXXXXXXXX'
const ADSENSE_PLACEHOLDER = 'ca-pub-XXXXXXXXXXXXXXXX'

const isMissing = (value?: string) => !value || value.trim().length === 0
const isPlaceholder = (value: string, placeholder: string) => value.trim() === placeholder

const validateProductionEnv = (key: string, value: string | undefined, placeholder: string) => {
  if (isMissing(value)) {
    throw new Error(
      `[env] Missing ${key}. Set a real value before running a production build (placeholder ${placeholder} is not allowed).`
    )
  }

  if (isPlaceholder(value, placeholder)) {
    throw new Error(
      `[env] Invalid ${key}. Placeholder value "${placeholder}" is not allowed in production builds.`
    )
  }
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProductionMode = mode === 'production'

  if (isProductionMode) {
    validateProductionEnv('VITE_GA4_ID', env.VITE_GA4_ID, GA4_PLACEHOLDER)
    validateProductionEnv('VITE_ADSENSE_CLIENT', env.VITE_ADSENSE_CLIENT, ADSENSE_PLACEHOLDER)
  }

  if (!isProductionMode) {
    if (isMissing(env.VITE_GA4_ID)) {
      console.warn(
        `[env] VITE_GA4_ID is not set in ${mode} mode. Google Analytics tracking will be skipped.`
      )
    }

    if (isMissing(env.VITE_ADSENSE_CLIENT)) {
      console.warn(
        `[env] VITE_ADSENSE_CLIENT is not set in ${mode} mode. AdSense script injection will be skipped.`
      )
    }
  }

  const plugins: PluginOption[] = [react()]

  if (!isMissing(env.VITE_GA4_ID)) {
    plugins.push(
      VitePluginRadar({
        analytics: {
          id: env.VITE_GA4_ID,
        },
      })
    )
  }

  if (!isMissing(env.VITE_ADSENSE_CLIENT)) {
    plugins.push(
      adsense({
        client: env.VITE_ADSENSE_CLIENT,
      })
    )
  }

  return {
    plugins,
    server: {
      port: 5173,
      proxy: {
        '/api': {
          target: 'http://localhost:8000',
          changeOrigin: true,
        },
      },
    },
    test: {
      globals: true,
      environment: 'happy-dom',
      setupFiles: ['src/test/setup.ts'],
    },
  }
})
