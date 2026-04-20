import { defineConfig } from 'vitest/config'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    react(),
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './app/frontend/test/setup.ts',
  },
})