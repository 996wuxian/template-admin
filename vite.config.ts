import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'

import { setupVitePlugins } from './build/plugins'

export default defineConfig({
  plugins: setupVitePlugins(),
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    host: '0.0.0.0',
    port: 9527,
    open: true
  },
  preview: {
    port: 9725
  }
})
