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
  }
})

