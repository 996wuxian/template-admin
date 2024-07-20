import type { GlobalThemeOverrides } from 'naive-ui'
import useThemeStore from '@/stores/modules/theme'
import { computed } from 'vue'
import tinycolor from 'tinycolor2'

/**
 * @description naive ui 主题配置
 */
export function getThemeOverrides() {
  const useTheme = useThemeStore()
  return computed<GlobalThemeOverrides>(() => ({
    common: {
      primaryColor: useTheme.primaryColor, // 主题颜色
      primaryColorHover: tinycolor(useTheme.primaryColor).darken(10).toString(), // 鼠标经过颜色
      primaryColorPressed: tinycolor(useTheme.primaryColor).darken(20).toString(), // 按下颜色

      successColor: useTheme.successColor,
      successColorHover: tinycolor(useTheme.successColor).darken(10).toString(),
      successColorPressed: tinycolor(useTheme.successColor).darken(20).toString(),

      warningColor: useTheme.warningColor,
      warningColorHover: tinycolor(useTheme.warningColor).darken(10).toString(),
      warningColorPressed: tinycolor(useTheme.warningColor).darken(20).toString(),

      errorColor: useTheme.errorColor,
      errorColorHover: tinycolor(useTheme.errorColor).darken(10).toString(),
      errorColorPressed: tinycolor(useTheme.errorColor).darken(20).toString(),

      infoColor: useTheme.infoColor,
      infoColorHover: tinycolor(useTheme.infoColor).darken(10).toString(),
      infoColorPressed: tinycolor(useTheme.infoColor).darken(20).toString()
    },
    Button: {
      textColorPrimary: '#fff',
      textColorInfo: '#333',
      textColorHoverPrimary: '#fff'
    }
  }))
}
