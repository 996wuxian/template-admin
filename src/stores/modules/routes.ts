import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'

import { MenuList } from '@/service/api/mock-api'
import { isArray } from '@/utils/validate'
import router from '@/router'
import { $msg } from '@/config/interaction.config'

import useUserStore from './user'

// 引入架构组件Layout
import Layout from '@/layout/index.vue'
// vite不能使用import(`@/${...}`)导入，只能用glob导入
const modules = import.meta.glob('../../views/*/*.vue')

import { asyncRoutes, addRouter } from '@/router'
import { setting } from '@/config/setting.config'
// import { RouteRecordRaw } from 'vue-router'
import piniaPersistConfig from '@/utils/persist'

const useRoutesStore = defineStore(
  'routes',
  () => {
    const state = reactive({
      routes: [] as any,
      route: [] as any
    })

    const setRoutes = async () => {
      const { userInfo } = useUserStore()

      // 设置后端路由(不需要可以删除)
      if (setting.authentication === 'all') {
        const { code, data } = await MenuList()
        // 获取后端路由信息
        if (!isArray(data) || code !== 200) {
          $msg({
            type: 'error',
            msg: '获取菜单失败'
          })
          return
        }
        const routers = data.filter((item: any) => item.roles.includes(userInfo.roleId?.toString()))
        const res = await routerGo(routers)
        const newRoutes = await transformMenuData(res)
        // 必须在addroutes前，使用router.options.routes=XXXXX的方法手动添加,才会显示菜单
        router.options.routes = router.options.routes.concat(newRoutes)
        addRouter(newRoutes) // 动态添加路由'
        state.routes = await mapRoute(newRoutes)
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
        hide?: boolean
        icon?: string
      }
      redirect?: string
      children?: Router[]
    }

    async function mapRoute(routes: Router[]) {
      const mapChildren = (children: Router[]): Router[] => {
        return children
          .filter((child) => !child?.meta?.hide)
          .map((child) => ({
            key: child?.path,
            label: child.meta?.title,
            children: child.children ? mapChildren(child.children) : undefined,
            icon: child?.meta?.icon ? child.meta.icon : undefined
          }))
      }

      return routes
        .filter((route) => !route?.meta?.hide)
        .map((route) => {
          const children = route.children ? mapChildren(route.children) : []
          return {
            // key, path 对齐 n-menu的options
            key:
              (children.length === 1 && children[0]?.meta?.title) ||
              children[0].label === route?.meta?.title
                ? children[0].path
                  ? children[0].path
                  : children[0].key
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
    async function routerGo(routerList: any) {
      const newRouter = filterAsyncRouter(routerList)
      newRouter.push({
        path: '/:pathMatch(.*)*',
        name: 'NoFound',
        redirect: '/404',
        meta: {
          hide: true
        }
      }) // 404放在最后

      return newRouter
    }

    /**
     * 过滤路由拼接组成路由文件路径
     * @param asyncRouterMap // 路由
     * @returns accessedRouters // 转换为组件对象
     */
    function filterAsyncRouter(asyncRouterMap: any) {
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

    async function transformMenuData(data: any) {
      const result = []
      // Helper function to find child routes
      const findChildren = (parentId: number) => {
        return data
          .filter((item: any) => item.parentId === parentId)
          .map((item: any) => {
            const route = {
              path: item.path,
              name: item.name,
              meta: {
                title: item.title,
                icon: item.icon || '',
                hide: item.hide === '1'
              },
              component: item.menuType === '0' ? Layout : item.url
            }

            const children = findChildren(item.id)
            if (children.length) {
              ;(route as any).children = children
            }

            return route
          })
      }

      // Find top-level routes
      const topLevelRoutes = data.filter((item: any) => item.parentId === 0)

      // Process each top-level route
      topLevelRoutes.forEach((item: any) => {
        const route = {
          path: item.path,
          name: item.name,
          component: Layout,
          meta: {
            title: item.title,
            icon: item.icon || '',
            hide: item.hide === '1'
          }
        }

        // Find children of the current route
        const children = findChildren(item.id)
        if (children.length) {
          ;(route as any).children = children
        }

        // Redirect rule for root routes
        if (item.name === 'Root') {
          ;(route as any).redirect = children.length ? children[0].path : undefined
        }

        result.push(route)
      })

      // Add the "NoFound" route at the end
      const noFoundRoute = data.find((item: any) => item.name === 'NoFound')
      if (noFoundRoute) {
        result.push(noFoundRoute)
      }

      return result
    }

    const setCurrentRoute = async (action: any) => {
      state.route = action.route
    }

    return {
      ...toRefs(state),
      setRoutes,
      setCurrentRoute
    }
  },
  {
    persist: piniaPersistConfig('route', ['route'])
  }
)

export default useRoutesStore
