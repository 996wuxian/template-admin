import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevtools from 'vite-plugin-vue-devtools'
import { setupUnocss } from './unocss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
export function setupVitePlugins() {
  const plugins: PluginOption = [
    vue({
      script: {
        defineModel: true
      }
    }),
    VueDevtools(),
    setupUnocss(),
    AutoImport({
      imports: [
        'vue',
        {
          'naive-ui': ['useDialog', 'useMessage', 'useNotification', 'useLoadingBar']
        }
      ]
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ]
  return plugins
}
