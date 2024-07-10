import path from 'path'
import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import VueDevtools from 'vite-plugin-vue-devtools'
import { setupUnocss } from './unocss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'

import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
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
    createSvgIconsPlugin({
      // 指定需要缓存的图标文件夹
      iconDirs: [path.resolve(process.cwd(), 'src/assets/svg-icon')],
      // 指定symbolId格式
      symbolId: '[name]'
    }),
    Components({
      resolvers: [NaiveUiResolver()]
    })
  ]
  return plugins
}
