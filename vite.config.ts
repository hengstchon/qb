import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react-swc'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv('', process.cwd(), '')

  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, 'src'),
      },
    },
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: env.QBIT_URL,
          changeOrigin: true,
        },
      },
    },
  }
})
