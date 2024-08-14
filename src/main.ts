import { createApp } from 'vue'
import store from '@/stores'
import './plugins/asstets'
import '@/mock/index'

import App from './App.vue'
import { setupRouter } from '@/router'

import { setupNProgress } from './plugins'
import svgIcon from '@/plugins/svg-icon'

import { vPer } from '@/directive/v-per'

const app = createApp(App)
// 关闭警告
app.config.warnHandler = () => null

// 自定义指令
// 使用的时候v-per
app.directive('per', {
  mounted: (el, bindings) => {
    vPer(el, bindings)
  }
})

async function setupApp() {
  await app.use(store)
  setupNProgress()
  app.use(svgIcon)
  setupRouter(app)
  app.mount('#app')
}

setupApp()
