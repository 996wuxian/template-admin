// 打包分析
import { visualizer } from 'rollup-plugin-visualizer'

export const setupVisualizer = () =>
  visualizer({
    open: true, //在默认用户代理中打开生成的文件
    gzipSize: true, // 收集 gzip 大小并将其显示
    brotliSize: true // 收集 brotli 大小并将其显示
    // filename: 'analysis.html' // 分析图生成的文件名
  })
