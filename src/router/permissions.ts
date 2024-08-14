/**
 * @description 路由守卫，目前两种模式：all模式与intelligence模式
 */
import { Session } from '@/utils/storage'
import { Router } from 'vue-router'
import useRoutesStore from '@/stores/modules/routes'
import getPageTitle from '@/utils/pageTitle'
import { setting } from '@/config/setting.config'
import { $msg } from '@/config/interaction.config'
import { sleep } from '@/utils/tools'
import useLoading from '@/plugins/loading'
const { show, hide } = useLoading()

export function setupPermissions(router: Router) {
  const useRouter = useRoutesStore()
  router.beforeEach(async (to: any, from: any, next: any) => {
    if (from.path === '/') {
      await show()
      await sleep(2000)
    }

    //设置页面title
    document.title = getPageTitle(to.meta.title)
    window?.NProgress?.start()

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
        $msg({
          type: 'warning',
          msg: '登录失效，请重新登录'
        })
        next(`/login`)
      }
    }
  })

  router.afterEach(() => {
    hide()
    window?.NProgress?.done()
  })
}
