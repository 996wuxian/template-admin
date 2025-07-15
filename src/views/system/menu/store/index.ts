import { ref } from 'vue'
import { arrayToTree } from '@/utils/tools'
import { asyncRoutes } from '@/router/index'
interface Menu {
  parentId?: number
  id?: number
  title?: string
  icon?: string
  name?: string
  path?: string // 路由路径
  url?: string // 组件文件路径
  status?: string
  hide?: string
  sort?: number
  menuType?: string // 菜单类型：0-目录，1-菜单
  children?: Menu[]
}

const form = ref<User>({})

const $roleForm = ref()
const roleForm = ref<User>({})
const modalVisible = ref(false)
const showEdit = (row: any) => {
  roleForm.value = {
    ...row,
  }
  modalVisible.value = true
}

interface Menu {
  parentId?: number
  id?: number
  title?: string
  icon?: string
  name?: string
  url?: string
  status?: string
  hide?: string
  sort?: number
  children?: Menu[]
}

const queryData = async () => {
  // 将路由配置转换为菜单数据
  const menuData = convertRoutesToMenuData(asyncRoutes)
  tableData.value = menuData
}

// 路由转菜单数据的转换函数
const convertRoutesToMenuData = (routes: any[], parentId: number = 0): Menu[] => {
  const menuList: Menu[] = []
  let currentId = 1

  const processRoute = (route: any, pId: number, level: number = 1): Menu[] => {
    const menus: Menu[] = []

    // 跳过隐藏的路由和重定向路由
    if (route.meta?.hide || route.redirect || route.name === 'NoFound') {
      if (route.children) {
        route.children.forEach((child: any) => {
          menus.push(...processRoute(child, pId, level))
        })
      }
      return menus
    }

    // 获取组件路径
    const getComponentPath = (routeComponent: any): string => {
      if (!routeComponent) return ''

      // 如果是动态导入函数，提取路径
      if (typeof routeComponent === 'function') {
        const funcStr = routeComponent.toString()
        const match = funcStr.match(/import\(['"](.*?)['"]\)/)
        if (match && match[1]) {
          return match[1]
        }
      }

      return ''
    }

    // 创建菜单项
    const menuItem: Menu = {
      id: currentId++,
      parentId: pId,
      title: route.meta?.title || route.name,
      icon: route.meta?.icon || '',
      name: route.name,
      path: route.path, // 路由路径
      url: getComponentPath(route.component), // 组件文件路径
      status: '1', // 默认启用
      hide: route.meta?.hide ? '1' : '0',
      sort: currentId,
    }

    // 判断菜单类型：有子路由且子路由不是单纯的组件路由则为目录
    if (route.children && route.children.length > 0) {
      const hasValidChildren = route.children.some(
        (child: any) => !child.meta?.hide && child.meta?.title && child.name !== 'NoFound',
      )

      if (hasValidChildren) {
        menuItem.menuType = '0' // 目录
        menus.push(menuItem)

        // 处理子路由
        route.children.forEach((child: any) => {
          menus.push(...processRoute(child, menuItem.id!, level + 1))
        })
      } else {
        // 只有一个有效子路由，将其作为菜单项
        const validChild = route.children.find((child: any) => !child.meta?.hide && child.component)
        if (validChild) {
          menuItem.menuType = '1' // 菜单
          menuItem.name = validChild.name
          menuItem.path = validChild.path
          menuItem.url = getComponentPath(validChild.component) // 使用子路由的组件路径
          menuItem.title = validChild.meta?.title || menuItem.title
          menuItem.icon = validChild.meta?.icon || menuItem.icon
          menus.push(menuItem)
        }
      }
    } else if (route.component) {
      menuItem.menuType = '1' // 菜单
      menus.push(menuItem)
    }

    return menus
  }

  routes.forEach((route) => {
    menuList.push(...processRoute(route, parentId))
  })

  // 转换为树形结构
  return arrayToTree<Menu>(menuList, 'id', 'parentId', 'children')
}

const tableData = ref<Menu[]>([])

const loading = ref(false)
const reload = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}

const submit = async () => {
  await $roleForm.value?.validate()
}

export const useMenuStore = () => {
  return {
    form,
    modalVisible,
    showEdit,
    $roleForm,
    roleForm,
    queryData,
    tableData,
    loading,
    reload,
    submit,
  }
}
