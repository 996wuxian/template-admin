/**
 * @description 导出通用配置
 */
export const setting = {
  // 标题
  title: 'template-admin',
  // 路由模式，是否为hash模式
  isHashRouterMode: true,
  // 不经过token校验的路由，白名单路由建议配置到与login页面同级，如果需要放行带传参的页面，请使用query传参，配置时只配置path即可
  routesWhiteList: ['/login', '/register', '/404', '/403'],
  // intelligence(前端导出路由)和 all(后端导出路由)两种方式
  authentication: 'intelligence',
  // 默认主题
  defaultTheme: 'light', // light default dark,
  // 主题对应图标
  defaultThemeValue: 1, // 0: light -> 1: default -> 2: dark -> 0: light
  // 默认布局
  defaultLayout: 'left_menu', // left_menu left_menu_mixin top_menu top_menu_mixin
  // 默认菜单宽度
  sideWidth: 200,
  // 默认菜单宽度
  headerHeight: 58,
  // 是否需要天气
  whether: true,
  // 是否需要面包屑 系统管理 / 用户管理
  breadcrumb: true,
  // 是否需要面包屑图标
  breadcrumbIcon: true,
  // 是否需要标签栏
  tag: true,
  // 标签栏风格 button / radio
  tagStyle: 'radio',
  // 是否需要多标签页缓存
  multiTagsCache: true,
  // 是否需要固定头部
  fixedHeader: true,
  // 是否需要固定侧边栏
  fixedSideBar: true,
  // 是否需要固定底部
  fixedFooter: false
}
