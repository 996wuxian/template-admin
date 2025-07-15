import '@/styles/reset.scss'
import 'virtual:uno.css'
import 'nprogress/nprogress.css'
import { createApp } from 'vue'
import App from './App.vue'
import { setupNProgress } from './plugins/nprogress'
import { setupRouter } from '@/router'
import store from '@/stores'
import { vPer } from '@/directive/v-per'

const app = createApp(App)

// 使用的时候v-per
app.directive('per', {
  mounted: (el, bindings) => {
    vPer(el, bindings)
  },
})

async function setupApp() {
  await app.use(store)
  setupNProgress()
  setupRouter(app)
  app.mount('#app')
}

setupApp()
