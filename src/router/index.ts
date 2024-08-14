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
      hide: true
    }
  },
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/error-page/403.vue'),
    meta: {
      hide: true
    }
  },
  {
    path: '/404',
    name: '404',
    component: () => import('@/views/error-page/404.vue'),
    meta: {
      hide: true
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
      hide: false
    },
    children: [
      {
        path: '/home',
        name: 'Home',
        component: () => import('@/views/home/index.vue'),
        meta: {
          title: '首页'
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
      hide: false
    },
    component: Layout,
    children: [
      {
        path: '/system/user',
        name: 'User',
        component: () => import('@/views/user/index.vue'),
        meta: {
          title: '用户管理',
          icon: 'i-solar-user-bold-duotone',
          hide: false
        }
      },
      {
        path: '/system/role',
        name: 'Role',
        component: () => import('@/views/role/index.vue'),
        meta: {
          title: '角色管理',
          icon: 'i-solar-user-plus-bold-duotone',
          hide: false
        }
      },
      {
        path: '/system/menu',
        name: 'Menu',
        component: () => import('@/views/menu/index.vue'),
        meta: {
          title: '菜单管理',
          icon: 'i-solar-widget-4-bold-duotone',
          hide: false
        }
      }
    ]
  },
  {
    path: '/change-role',
    name: 'ChangeRole',
    component: Layout,
    meta: {
      title: '切换权限',
      icon: 'i-solar-square-transfer-horizontal-bold',
      hide: false
    },
    children: [
      {
        path: '/change-role',
        name: 'ChangeRole',
        component: () => import('@/views/change-role/index.vue'),
        meta: {
          title: '切换权限',
          icon: 'i-solar-square-transfer-horizontal-bold'
        }
      }
    ]
  },
  {
    path: '/text-sadmin',
    name: 'TextAadmin',
    component: Layout,
    meta: {
      title: '超级管理员可见',
      icon: 'i-solar-key-minimalistic-square-2-bold',
      hide: false
    },
    children: [
      {
        path: '/text-sadmin',
        name: 'TextAadmin',
        component: () => import('@/views/text-sadmin/index.vue'),
        meta: {
          title: '超级管理员可见',
          icon: 'i-solar-key-minimalistic-square-2-bold'
        }
      }
    ]
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NoFound',
    redirect: '/404',
    meta: {
      hide: true
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
