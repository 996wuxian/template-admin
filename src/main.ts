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

app.use(store)
setupNProgress()
app.use(svgIcon)
setupRouter(app)

app.mount('#app')
