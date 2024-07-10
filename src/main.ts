import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './plugins/asstets'

import App from './App.vue'
import { setupRouter } from '@/router'

import { setupNProgress } from './plugins'
import svgIcon from '@/plugins/svg-icon'

const app = createApp(App)

setupNProgress()
app.use(createPinia())
app.use(svgIcon)
setupRouter(app)

app.mount('#app')
