import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv('', process.cwd(), '')
  const target = env.QBIT_URL || 'http://localhost:8090'
  const targetOrigin = new URL(target).origin

  return {
    resolve: {
      alias: {
        '@': path.resolve(import.meta.dirname, './src'),
      },
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target,
          changeOrigin: true,
          configure(proxy) {
            proxy.on('proxyReq', (proxyRequest) => {
              proxyRequest.setHeader('Origin', targetOrigin)
              proxyRequest.setHeader('Referer', `${targetOrigin}/`)
            })
          },
        },
      },
    },
    build: {
      outDir: 'dist/public',
    },
  }
})
