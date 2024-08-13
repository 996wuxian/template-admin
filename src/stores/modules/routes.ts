import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import { MenuList } from '@/service/api/mock-api'
import { isArray } from '@/utils/validate'
import router from '@/router'

import useUserStore from './user'

// 引入架构组件Layout
import Layout from '@/layout/index.vue'
// vite不能使用import(`@/${...}`)导入，只能用glob导入
const modules = import.meta.glob('../../views/*/*.vue')

import { asyncRoutes, addRouter } from '@/router'
import { setting } from '@/config/setting.config'
import { RouteRecordRaw } from 'vue-router'

const useRoutesStore = defineStore('routes', () => {
  const { userInfo } = useUserStore()

  const state = reactive({
    routes: [] as any
  })

  const setRoutes = async () => {
    // 设置后端路由(不需要可以删除)
    const { code, data } = await MenuList()
    // 获取后端路由信息
    if (!isArray(data)) return
    const routers = data.filter((item: any) => item.roles.includes(userInfo.roleId?.toString()))
    console.log('🚀 ~ setRoutes ~ routers:', routers)
    const res = await routerGo(routers)

    console.log(res, 'res')

    if (setting.authentication === 'all') {
      const { code, data } = await MenuList()
      console.log('🚀 ~ setRoutes ~ data:', data)
      console.log('🚀 ~ setRoutes ~ data:', userInfo)
      // 获取后端路由信息
      if (!isArray(data)) return
      const res = await routerGo(data)

      state.routes = [...res]
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
   * 过滤路由拼接组成路由文件路径
   * @param asyncRouterMap // 路由
   * @returns accessedRouters // 转换为组件对象
   */
  function filterAsyncRouter(asyncRouterMap: any) {
    console.log('🚀 ~ filterAsyncRouter ~ asyncRouterMap:', asyncRouterMap)
    // 遍历后台传来的路由字符串，转换为组件对象
    const accessedRouters = asyncRouterMap.filter((route: any) => {
      if (route.url) {
        if (route.url === 'Layout') {
          // Layout组件特殊处理
          route.url = Layout
        } else {
          // 当发现不匹配时，考虑是不是有幽灵符
          // console.log(modules['../../views/home/index.vue'])
          route.url = modules[`../../views${route.url}`]
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
