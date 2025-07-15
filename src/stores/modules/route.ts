import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
// import { isArray } from '@/utils/validate'
// import router from '@/router'
import useUserStore from './user'
// import Layout from '@/layout/index.vue'
// addRouter
import { asyncRoutes } from '@/router'
import { setting } from '@/config/setting.config'
import piniaPersistConfig from '../persist'
// vite不能使用import(`@/${...}`)导入，只能用glob导入
// const modules = import.meta.glob('../../views/*/*.vue')

const useRoutesStore = defineStore(
  'routes',
  () => {
    const state = reactive({
      routes: [] as any,
      route: [] as any,
    })

    const setRoutes = async () => {
      const userStore = useUserStore()
      const userRole = userStore.userInfo.roleId

      // 设置后端路由(不需要可以删除)
      if (setting.authentication === 'all') {
        // const { code, data } = await MenuList()
        // // 获取后端路由信息
        // if (!isArray(data) || code !== 200) {
        //   return
        // }
        // const routers = data.filter((item: any) => i.roles.includes(userInfo.roleId?.toString()))
        // const res = await routerGo(routers)
        // const newRoutes = await transformMenuData(res)
        // 必须在addroutes前，使用router.options.routes=XXXXX的方法手动添加,才会显示菜单
        // router.options.routes = router.options.routes.concat(newRoutes)
        // addRouter(newRoutes) // 动态添加路由'
        // state.routes = await mapRoute(newRoutes)
      } else {
        // 前端写死的动态路由
        // const routes = await mapRoute(asyncRoutes)
        // const routes = asyncRoutes
        // state.routes = routes

        // 前端路由 - 根据用户角色过滤
        let routes = JSON.parse(JSON.stringify(asyncRoutes)) // 深拷贝避免修改原数组

        if (userRole) {
          // 根据用户角色过滤路由
          routes = filterRoutesByRole(routes, userRole)
        }

        state.routes = routes
      }
    }

    // 根据用户角色过滤路由
    const filterRoutesByRole = (routes: any[], roleId: number): any[] => {
      return routes.filter((route) => {
        // 检查当前路由是否允许该角色访问
        const hasPermission = !route.meta?.roles || route.meta.roles.includes(roleId)

        if (hasPermission) {
          // 如果有子路由，递归过滤
          if (route.children && route.children.length > 0) {
            const filteredChildren = filterRoutesByRole(route.children, roleId)
            route.children = filteredChildren
            // 如果有子路由但都被过滤掉了，检查父路由本身是否有组件
            return filteredChildren.length > 0 || route.component
          }
          return true
        }

        return false
      })
    }

    // interface Router {
    //   label?: string
    //   key?: string
    //   path?: string
    //   name?: string
    //   meta?: {
    //     title?: string
    //     hide?: boolean
    //     icon?: string
    //   }
    //   redirect?: string
    //   children?: Router[]
    // }

    /**
     * 导航到一个新的路由方法封装
     * @param routerList 后端路由
     */
    // async function routerGo(routerList: any) {
    //   const newRouter = filterAsyncRouter(routerList)
    //   newRouter.push({
    //     path: '/:pathMatch(.*)*',
    //     name: 'NoFound',
    //     redirect: '/404',
    //     meta: {
    //       hide: true,
    //     },
    //   }) // 404放在最后

    //   return newRouter
    // }

    /**
     * 过滤路由拼接组成路由文件路径
     * @param asyncRouterMap // 后端路由
     * @returns accessedRouters // 转换为组件对象
     */
    // function filterAsyncRouter(asyncRouterMap: any) {
    //   // 遍历后台传来的路由字符串，转换为组件对象
    //   const accessedRouters = asyncRouterMap.filter((route: any) => {
    //     if (route.url) {
    //       if (route.url === 'Layout') {
    //         // Layout组件特殊处理
    //         route.url = Layout
    //       } else {
    //         // 当发现不匹配时，考虑是不是有幽灵符
    //         // console.log(modules['../../views/home/index.vue'])
    //         route.url = modules[`../../views${route.url}`]
    //       }
    //     }
    //     if (route.children && route.children.length) {
    //       route.children = filterAsyncRouter(route.children)
    //     }
    //     return true
    //   })
    //   return accessedRouters
    // }

    const setCurrentRoute = async (action: any) => {
      state.route = action.route
    }

    return {
      ...toRefs(state),
      setRoutes,
      setCurrentRoute,
    }
  },
  {
    persist: piniaPersistConfig('route', ['route']),
  },
)

export default useRoutesStore
