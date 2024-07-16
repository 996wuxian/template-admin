import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

// import { QueryUserMenu } from '@/api/user'

import { isArray } from '@/utils/validate'
import router from '@/router'

// 引入架构组件Layout
import Layout from '@/layout/index.vue'
// vite不能使用import(`@/${...}`)导入，只能用glob导入
const modules = import.meta.glob('../../views/*/*.vue')

import { asyncRoutes, addRouter } from '@/router'
import { setting } from '@/config/setting.config'
import { RouteRecordRaw } from 'vue-router'

const useRoutesStore = defineStore('routes', () => {
  const state = reactive({
    routes: [] as any
  })

  const setRoutes = async () => {
    // 设置后端路由(不需要可以删除)
    if (setting.authentication === 'all') {
      // // 获取后端路由信息
      // const { userInfo } = JSON.parse(window.localStorage.getItem('userInfo'))
      // const { data } = (await QueryUserMenu(userInfo.id)) as any
      // if (!isArray(data)) return
      // const res = await routerGo(data)
      // res.forEach((item) => {
      //   if (item.children) {
      //     if (item.children.length === 1 && item.children[0].meta.title === item.meta.title) {
      //       item.path = item.children[0].path
      //       delete item.children
      //     } else if (item.children.length > 1) {
      //       item.children = item.children.filter((_item) => _item.meta.title !== item.meta.title)
      //     }
      //   }
      // })
      // state.routes = [...res]
    } else {
      // 前端写死的动态路由
      const routes = await mapRoute(asyncRoutes)
      state.routes = routes
    }
  }

  interface Router {
    label?: string
    key?: string
    path?: string
    name?: string
    meta?: {
      title?: string
      hidden?: boolean
      icon?: string
    }
    redirect?: string
    children?: Router[]
  }

  async function mapRoute(routes: Router[]) {
    const mapChildren = (children: Router[]): Router[] => {
      return children
        .filter((child) => !child?.meta?.hidden)
        .map((child) => ({
          key: child?.path,
          label: child.meta?.title,
          children: child.children ? mapChildren(child.children) : undefined,
          icon: child?.meta?.icon ? child.meta.icon : undefined
        }))
    }

    return routes
      .filter((route) => !route?.meta?.hidden)
      .map((route) => {
        const children = route.children ? mapChildren(route.children) : []
        return {
          key:
            children.length === 1 && children[0]?.meta?.title === route?.meta?.title
              ? children[0].path
              : route.redirect || route.path,
          label: route.meta?.title,
          children: children.length > 1 ? children : undefined,
          icon: route?.meta?.icon ? route.meta.icon : undefined
        }
      })
  }

  /**
   * 导航到一个新的路由方法封装
   * @param routerList 后端路由
   */
  async function routerGo(routerList) {
    const newRouter = filterAsyncRouter(routerList)
    newRouter.push({
      path: '/:pathMatch(.*)*',
      name: 'NoFound',
      redirect: '/404',
      meta: {
        hidden: true
      }
    }) // 404放在最后
    // 必须在addroutes前，使用router.options.routes=XXXXX的方法手动添加,才会显示菜单
    router.options.routes = router.options.routes.concat(newRouter)
    addRouter(newRouter) // 动态添加路由'
    return newRouter
  }

  /**
   * 过滤路由拼接Component
   * @param asyncRouterMap // 路由
   * @returns accessedRouters // 转换为组件对象
   */
  function filterAsyncRouter(asyncRouterMap) {
    // 遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter((route) => {
      if (route.component) {
        if (route.component === 'Layout') {
          // Layout组件特殊处理
          route.component = Layout
        } else {
          // 当发现不匹配时，考虑是不是有幽灵符
          route.component = modules[`../../views/${route.component}`]
        }
      }
      if (route.children && route.children.length) {
        route.children = filterAsyncRouter(route.children)
      }
      return true
    })
    return accessedRouters
  }

  return {
    ...toRefs(state),
    setRoutes
  }
})

export default useRoutesStore
