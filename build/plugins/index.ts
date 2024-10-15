import type { PluginOption } from 'vite'
import vue from '@vitejs/plugin-vue'
import { setupUnocss } from './unocss'
import { autoImport } from './autoImport'
import { SetupGzip } from './viteCompression'
import { setupViteRestart } from './viteRestart'
import { setupSvg } from './svgIcon'
import { setupVisualizer } from './visualizer'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'
export function setupVitePlugins(isBuild: boolean, viteEnv: ImportMetaEnv) {
  const { VITE_GZIP, VITE_VISUALIZER } = viteEnv

  // 开发环境&生产环境加载的插件
  console.log(viteEnv, 'viteEnv')

  const plugins: PluginOption = [
    vue({
      script: {
        defineModel: true
      }
    })
  ]

  // 开发&生产环境需要的插件
  // 自动导入
  plugins.push(...autoImport())
  // unocss
  plugins.push(setupUnocss())
  // svg
  plugins.push(setupSvg())

  // 开发需要，生产不要
  if (!isBuild) {
    // 自动重启，监听哪些文件改变会自动重启
    plugins.push(setupViteRestart())
  }

  if (isBuild) {
    // 图片压缩
    plugins.push(ViteImageOptimizer())
    // gzip
    VITE_GZIP && plugins.push(SetupGzip())
    // 打包分析
    VITE_VISUALIZER && plugins.push(setupVisualizer())
  }
  console.log('🚀 ~ setupVitePlugins ~ VITE_VISUALIZER:', VITE_VISUALIZER)
  console.log('🚀 ~ setupVitePlugins ~ VITE_GZIP:', VITE_GZIP)

  return plugins
}
