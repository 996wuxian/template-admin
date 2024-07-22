import { createRouter, createWebHashHistory, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

import Layout from '@/layout/index.vue'

import { setting } from '@/config/setting.config'

import { setupPermissions } from './permissions'

const constantRoutes = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hidden: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hidden: true
    }
  }
]

export const asyncRoutes = [
  {
    path: '/',
    name: 'Root',
    component: Layout,
    redirect: '/home',
    meta: {
      title: '首页',
      icon: 'i-solar-home-smile-bold',
      hidden: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页',
          icon: 'i-solar-home-smile-bold'
        }
      }
    ]
  },
  {
    path: '/system',
    name: 'System',
    meta: {
      title: '系统管理',
      icon: 'i-solar-settings-minimalistic-bold-duotone',
      hidden: false
    },
    component: Layout,
    children: [
      {
        path: '/user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'i-solar-user-bold-duotone',
          hidden: false
        }
      },
      {
        path: '/role',
        name: 'Role',
        component: () => import('@/views/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'i-solar-user-plus-bold-duotone',
          hidden: false
        }
      },
      {
        path: '/menu',
        name: 'Menu',
        component: () => import('@/views/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'i-solar-widget-4-bold-duotone',
          hidden: false
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NoFound',
    redirect: '/404',
    meta: {
      hidden: true
    }
  }
]

const router = createRouter({
  history: setting.isHashRouterMode ? createWebHashHistory() : createWebHistory(),
  routes: constantRoutes as RouteRecordRaw[]
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
  // 后端路由
  setupPermissions(router)
  app.use(router)
  return router
}

export default router
