import path from 'path'
import react from '@vitejs/plugin-react-swc'
import { defineConfig, loadEnv } from 'vite'

// https://vitejs.dev/config/
export default defineConfig(() => {
  const env = loadEnv('', process.cwd(), '')

  return {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
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
    build: {
      outDir: 'dist/public',
    },
  }
})
