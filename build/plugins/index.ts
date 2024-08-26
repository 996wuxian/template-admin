import path from 'path'
import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import { setupUnocss } from './unocss'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { NaiveUiResolver } from 'unplugin-vue-components/resolvers'
import { visualizer } from 'rollup-plugin-visualizer'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
// import { manualChunksPlugin } from 'vite-plugin-webpackchunkname' //
export function setupVitePlugins() {
  const plugins: PluginOption = [
    vue({
      script: {
        defineModel: true
      }
    }),
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
    }),
    // 打包分析
    visualizer({
      open: true, //在默认用户代理中打开生成的文件
      gzipSize: true, // 收集 gzip 大小并将其显示
      brotliSize: true // 收集 brotli 大小并将其显示
      // filename: 'analysis.html' // 分析图生成的文件名
    })
  ]
  return plugins
}
