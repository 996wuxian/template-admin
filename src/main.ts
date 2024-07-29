import { createApp } from 'vue'
import store from '@/stores'
import './plugins/asstets'
import '@/mock/index'

import App from './App.vue'
import { setupRouter } from '@/router'

import { setupNProgress } from './plugins'
import svgIcon from '@/plugins/svg-icon'

const app = createApp(App)
// 关闭警告
app.config.warnHandler = () => null

async function setupApp() {
  app.use(store)
  setupNProgress()
  app.use(svgIcon)
  await setupRouter(app)
  app.mount('#app')
}

setupApp()
