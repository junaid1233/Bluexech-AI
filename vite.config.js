import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Relative base fixes GitHub Pages 404s for favicon/main/assets
export default defineConfig({
  plugins: [react()],
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
})
