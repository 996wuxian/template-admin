import path from 'path'
import { defineConfig, loadEnv } from 'vite'
import { wrapperEnv } from './build/utils'

import { setupVitePlugins } from './build/plugins'
import { setupViteBuild } from './build/build'

export default defineConfig(({ command, mode }) => {
  // 模式
  const isBuild = command === 'build'
  // 获取当前文件夹地址
  const __dirname = path.resolve()
  // 获取包含VITE_开头的环境变量
  const env = loadEnv(mode, __dirname)
  // 环境变量值转换
  const viteEnv = wrapperEnv(env)

  return {
    plugins: setupVitePlugins(isBuild, viteEnv),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src')
      }
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "./src/styles/scss/global.scss" as *;`
        },
        // 可以配置一些全局Css变量
        globalVars: {}
      }
    },
    server: {
      host: '0.0.0.0',
      port: 9527,
      open: true,
      proxy: {
        // '/api': {
        //   target: 'http://your-api-server.com',
        //   changeOrigin: true,
        //   rewrite: (path) => path.replace(/^\/api/, '')
        // }
      }
    },
    preview: {
      port: 9725
    },
    build: setupViteBuild(viteEnv)
  }
})
