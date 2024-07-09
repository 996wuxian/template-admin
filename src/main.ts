import { createApp } from 'vue'
import { createPinia } from 'pinia'
import './plugins/asstets'

import App from './App.vue'
import { setupRouter } from '@/router'

import { setupNProgress } from './plugins'

const app = createApp(App)

setupNProgress()
app.use(createPinia())
setupRouter(app)

app.mount('#app')
