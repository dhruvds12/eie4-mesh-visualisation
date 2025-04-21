import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/nodeAPI': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      '/userAPI': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      },
      // '/ws': {
      //   target: 'ws://localhost:8080',
      //   ws: true,
      //   changeOrigin: true,
      //   secure: false,
      // },
    }

  },
})
