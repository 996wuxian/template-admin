// svg
import path from 'path'
import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'

export const setupSvg = () =>
  createSvgIconsPlugin({
    // 指定需要缓存的图标文件夹
    iconDirs: [path.resolve(process.cwd(), 'src/assets/svg-icon')],
    // 指定symbolId格式
    symbolId: '[name]'
  })
