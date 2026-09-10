import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { contactApiPlugin } from './vite-plugins/contactApi.js'

// Relative base fixes GitHub Pages 404s for favicon/main/assets
export default defineConfig({
  plugins: [react(), contactApiPlugin()],
  base: './',
  server: {
    host: true,
    port: 5173,
    strictPort: true,
  },
  preview: {
    host: true,
    port: 4173,
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        message: resolve(__dirname, 'message.html'),
      },
    },
  },
})
