// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: true,    // コンテナ外部からアクセス可能に
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://goapi:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  }
})

