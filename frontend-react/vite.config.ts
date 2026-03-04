import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import VitePluginRadar from 'vite-plugin-radar'
import adsense from 'vite-plugin-adsense'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [
      react(),
      VitePluginRadar({
        analytics: {
          id: env.VITE_GA4_ID || 'G-XXXXXXXXXX',
        },
      }),
      adsense({
        client: env.VITE_ADSENSE_CLIENT || 'ca-pub-XXXXXXXXXXXXXXXX',
      }),
    ],
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

