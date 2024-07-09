import { defineConfig } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist']
    }
  },
  shortcuts: [['flex-center', 'flex items-center justify-center']]
})
