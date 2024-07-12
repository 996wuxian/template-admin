declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const vueComponent: DefineComponent<{}, {}, any>
  export default vueComponent
}

declare module 'nprogress'

declare interface Window {
  NProgress: any
}

declare module 'mockjs'

declare module 'qs'
