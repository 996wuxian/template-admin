import { defineConfig } from 'unocss'

export default defineConfig({
  content: {
    pipeline: {
      exclude: ['node_modules', 'dist']
    }
  },
  safelist: [
    'i-solar-home-smile-bold',
    'i-solar-settings-minimalistic-bold-duotone',
    'i-solar-user-plus-bold-duotone',
    'i-solar-widget-4-bold-duotone'
  ],
  shortcuts: [['flex-center', 'flex items-center justify-center']]
})
