// build 配置
import type { BuildOptions } from 'vite'
export const setupViteBuild = (viteEnv: ImportMeta) => {
  const { VITE_CHECK } = viteEnv
  return {
    assetsInlineLimit: 1024 * 20, // 20kb 以下转为base64
    terserOptions: {
      compress: {
        //生产环境时移除console
        drop_console: true,
        drop_debugger: true
      }
    },
    // 关闭文件计算
    reportCompressedSize: false,
    write: true, // 启用将构建后的文件写入磁盘
    emptyOutDir: true, // 构建时清空该目录
    chunkSizeWarningLimit: 500, // chunk 大小警告的限制
    // 关闭生成map文件 可以达到缩小打包体积
    sourcemap: false, // 这个生产环境一定要关闭，不然打包的产物会很大
    // esbuild | terser 指定使用哪种混淆器, false: 表示打包后的文件内容不进行压缩，方便阅读
    minify: 'esbuild',
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/js/[name]-[hash].js', // 打包后的文件名称
        entryFileNames: 'assets/js/[name]-[hash].js', // 打包后的入口文件名称
        // 对打包出来的资源文件进行分类，分别放到不同的文件夹内
        assetFileNames(assetsInfo) {
          //  css样式文件
          if (assetsInfo.name?.endsWith('.css')) {
            return 'assets/css/[name]-[hash].css'
          }
          //  字体文件
          const fontExts = ['.ttf', '.otf', '.woff', '.woff2', '.eot']
          if (fontExts.some((ext) => assetsInfo.name?.endsWith(ext))) {
            return 'assets/font/[name]-[hash].[ext]'
          }

          //  图片文件
          const imgExts = ['.png', '.jpg', '.jpeg', '.webp', '.gif', '.icon']
          if (imgExts.some((ext) => assetsInfo.name?.endsWith(ext))) {
            return 'assets/img/[name]-[hash].[ext]'
          }

          //  SVG类型的图片文件
          const imgSvg = ['.svg']
          if (imgSvg.some((ext) => assetsInfo.name?.endsWith(ext))) {
            return 'assest/icons/[name].[ext]'
          }

          //  视频文件
          const videoExts = ['.mp4', '.avi', '.wmv', '.ram', '.mpg', 'mpeg']
          if (videoExts.some((ext) => assetsInfo.name?.endsWith(ext))) {
            return 'assets/video/[name]-[hash].[ext]'
          }
          //  其它文件: 保存在 assets/图片名-哈希值.扩展名
          return 'assets/[name]-[hash].[ext]'
        },
        // 大文件拆分
        manualChunks: (id) => {
          // if (id.includes('echarts')) return 'echarts'
          // 如果是check，将所有node_modules拆解开，利于代码分析，不是则打包到一起形成vendor
          if (id.includes('node_modules')) {
            return VITE_CHECK
              ? id.toString().split('node_modules/.pnpm/')[1].split('/')[0].toString()
              : 'vendor'
          }

          return undefined
        }
      }
    }
  } as BuildOptions
}
