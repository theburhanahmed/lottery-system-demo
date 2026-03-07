import { defineConfig, loadEnv, type PluginOption } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginRadar from 'vite-plugin-radar'
import adsense from 'vite-plugin-adsense'

const GA4_PLACEHOLDER = 'G-XXXXXXXXXX'
const ADSENSE_PLACEHOLDER = 'ca-pub-XXXXXXXXXXXXXXXX'

const isMissing = (value?: string) => !value || value.trim().length === 0
const isPlaceholder = (value: string, placeholder: string) => value.trim() === placeholder

const isPlaceholderOrMissing = (value: string | undefined, placeholder: string) =>
  isMissing(value) || (value !== undefined && isPlaceholder(value, placeholder))

const hasRealValue = (value: string | undefined, placeholder: string) =>
  !isPlaceholderOrMissing(value, placeholder)

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const isProductionMode = mode === 'production'

  // GA4 and AdSense are optional: if missing or placeholder, we skip the plugins and allow the build.
  if (isProductionMode) {
    if (isPlaceholderOrMissing(env.VITE_GA4_ID, GA4_PLACEHOLDER)) {
      console.warn(
        '[env] VITE_GA4_ID is missing or placeholder. Google Analytics will be disabled in production.'
      )
    }
    if (isPlaceholderOrMissing(env.VITE_ADSENSE_CLIENT, ADSENSE_PLACEHOLDER)) {
      console.warn(
        '[env] VITE_ADSENSE_CLIENT is missing or placeholder. AdSense will be disabled in production.'
      )
    }
  } else {
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

  if (hasRealValue(env.VITE_GA4_ID, GA4_PLACEHOLDER)) {
    plugins.push(
      VitePluginRadar({
        analytics: {
          id: env.VITE_GA4_ID!,
        },
      })
    )
  }

  if (hasRealValue(env.VITE_ADSENSE_CLIENT, ADSENSE_PLACEHOLDER)) {
    plugins.push(
      adsense({
        client: env.VITE_ADSENSE_CLIENT!,
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
      coverage: {
        provider: 'v8',
        reporter: ['text', 'lcov'],
        thresholds: {
          lines: 60,
          functions: 60,
          branches: 50,
          statements: 60,
        },
      },
    },
  }
})
