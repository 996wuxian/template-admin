// 路由图标收集
export const extractIcons = async () => {
  const { asyncRoutes } = await import('@/router')
  const icons = [] as any
  const traverse = (routeArray: any) => {
    routeArray.forEach((route: any) => {
      if (route.meta && route.meta.icon) {
        icons.push(route.meta.icon)
      }
      if (route.children) {
        traverse(route.children)
      }
    })
  }

  traverse(asyncRoutes)
  return [...new Set(icons)] // 去重
}
