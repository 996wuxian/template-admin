/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import { Session } from '@/utils/storage'
import type { Router } from 'vue-router'
import useRoutesStore from '@/stores/modules/route'
import getPageTitle from '@/utils/page-title'
import { setting } from '@/config/setting.config'
import NProgress from 'nprogress'
import useLoading from '@/plugins/loading'
const { show, hide } = useLoading()
export function setupPermissions(router: Router) {
  router.beforeEach(async (to: any, from: any, next: any) => {
    const useRouter = useRoutesStore()
    NProgress.start()
    show()
    //设置页面title
    document.title = getPageTitle(to.meta.title)

    // 设置当前路由的key用于权限判断
    useRouter.setCurrentRoute({ route: { key: to.path } })

    const token = Session.get('token')
    if (token) {
      if (to.path === '/login') {
        next({ path: '/' })
      } else {
        if (useRouter.routes.length === 0) {
          // 需加，否则死循环
          await useRouter.setRoutes()
          next({ ...to, replace: true }) // 避免重复加载路由
        } else {
          next()
        }
      }
    } else {
      if (setting.routesWhiteList.indexOf(to.path) !== -1) {
        next()
      } else {
        next(`/login`)
      }
    }
  })

  router.afterEach(() => {
    NProgress.done()
    hide()
  })
}
