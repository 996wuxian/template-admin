import { type App } from 'vue'
import SvgIcon from '@/components/common/svg-icon.vue'
import 'virtual:svg-icons-register'
/**
 * Svg图标插件
 */
export default {
  install: (app: App): void => {
    app.component('SvgIcon', SvgIcon)
  }
}
