/**
 * naive ui 主题配置
 */
import type { GlobalThemeOverrides } from 'naive-ui'
const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#A6E3E9', // 主题颜色
    primaryColorHover: '#71C9CE', // 鼠标经过颜色
    primaryColorPressed: '#A6E3E9', // 按下颜色

    infoColor: '#F4F4F5', // 主题颜色
    infoColorHover: '#1588F5', // 鼠标经过颜色
    infoColorPressed: '#1588F5' // 按下颜色
  },
  Button: {
    textColorPrimary: '#fff',
    textColorInfo: '#333',
    textColorHoverPrimary: '#fff'
  }
}

export default themeOverrides
