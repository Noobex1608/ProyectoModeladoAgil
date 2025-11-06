import { defineConfig } from 'vitest/config'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss(), vue()],
  test: {
    globals: true,
    environment: 'jsdom',
    env: {
      VITE_SUPABASE_URL: 'https://iiqxgttmoxnxhjefnggw.supabase.co',
      VITE_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlpcXhndHRtb3hueGhqZWZuZ2d3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE2MTU2MDYsImV4cCI6MjA3NzE5MTYwNn0.xwquuyR5Qp18_tq8nk4zeo3RAhV_hrCQNiYMwclXtcM'
    }
  },
})
