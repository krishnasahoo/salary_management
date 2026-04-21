import { defineConfig } from 'vitest/config'
import RubyPlugin from 'vite-plugin-ruby'
import react from '@vitejs/plugin-react'
import path from 'path/win32'

export default defineConfig({
  plugins: [
    RubyPlugin(),
    react({
      jsxRuntime: 'automatic',
    }),
  ],  
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: [path.resolve(__dirname, './app/frontend/test/setup.ts')],
  },
})