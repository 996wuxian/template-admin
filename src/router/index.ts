import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import Layout from '@/layout/index.vue'
import { setting } from '@/config/setting.config'
import { setupPermissions } from './permissions'

const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    meta: {
      hide: true,
    },
    component: () => import('@/views/login/index.vue'),
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hide: true,
    },
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hide: true,
    },
  },
]

export const asyncRoutes = [
  {
    path: '/',
    name: 'Root',
    component: Layout,
    redirect: '/home',
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'i-solar-home-smile-bold',
          roles: [1, 2, 3],
        },
      },
      {
        path: '/system',
        name: 'System',
        meta: {
          title: '系统管理',
          icon: 'i-solar-settings-minimalistic-bold-duotone',
          roles: [1, 2],
        },
        children: [
          {
            path: 'user',
            name: 'SystemUser',
            component: () => import('@/views/system/user/index.vue'),
            meta: {
              title: '用户管理',
              icon: 'i-solar-user-bold-duotone',
              roles: [1, 2],
            },
          },
          {
            path: 'role',
            name: 'SystemRole',
            component: () => import('@/views/system/role/index.vue'),
            meta: {
              title: '角色管理',
              icon: 'i-solar-user-plus-bold-duotone',
              roles: [1, 2],
            },
          },
          {
            path: 'menu',
            name: 'Menu',
            component: () => import('@/views/system/menu/index.vue'),
            meta: {
              title: '菜单管理',
              icon: 'i-solar-widget-4-bold-duotone',
              hide: false,
              roles: [1],
            },
          },
        ],
      },
      {
        path: '/change-role',
        name: 'ChangeRole',
        component: () => import('@/views/change-role/index.vue'),
        meta: {
          title: '切换权限',
          icon: 'i-solar-square-transfer-horizontal-bold',
          hide: false,
          roles: [1, 2, 3],
        },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NoFound',
    redirect: '/404',
    meta: {
      hide: true,
    },
  },
]

const router = createRouter({
  history: setting.isHashRouterMode ? createWebHashHistory() : createWebHistory(),
  routes: constantRoutes as RouteRecordRaw[],
})

export const addRouter = (routes: any) => {
  routes.forEach((route: any) => {
    if (!router.hasRoute(route.name)) router.addRoute(route as RouteRecordRaw)
    if (route.children) addRouter(route.children)
  })
}

export function setupRouter(app: any) {
  // 开发路由
  if (setting.authentication === 'intelligence') addRouter(asyncRoutes)
  // 路由权限
  setupPermissions(router)
  app.use(router)
  return router
}

export default router
