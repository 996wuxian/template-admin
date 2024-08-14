/**
 * @description 通用配置
 * @param title {String} 标题
 * @param isHashRouterMode {Boolean} 路由模式，是否为hash模式
 * @param routesWhiteList {Array} 不经过token校验的路由，白名单路由建议配置到与login页面同级，如果需要放行带传参的页面，请使用query传参，配置时只配置path即可
 * @param authentication {String} intelligence(前端导出路由)和 all(后端导出路由)两种方式
 * @param defaultTheme {String} 默认主题 light default dark,
 * @param defaultThemeValue {Number} 主题对应图标 0: light -> 1: default -> 2: dark -> 0: light
 * @param defaultLayout {String} 默认布局 left_menu left_menu_mixin top_menu top_menu_mixin
 * @param sideWidth {Number} 默认侧边栏宽度
 * @param sideFoldWidth {Number} 默认侧边栏折叠宽度
 * @param headerHeight {Number} 默认头部宽度
 * @param whether {Boolean} 是否需要天气
 * @param breadcrumb {Boolean} 是否需要面包屑 系统管理 / 用户管理
 * @param breadcrumbIcon {Boolean} 是否需要面包屑图标
 * @param tag {Boolean} 是否需要标签栏
 * @param tagStyle {String} 标签栏风格 button / radio
 * @param footer {Boolean} 是否需要底部
 * @param footerHeight {Number} 默认底部宽度
 */
export const setting = {
  title: 'template-admin',
  isHashRouterMode: true,
  routesWhiteList: ['/login', '/register', '/404', '/403'],
  authentication: 'all',
  theme: {
    defaultTheme: 'light',
    defaultThemeValue: 1,
    defaultLayout: 'left_menu',
    sideWidth: 200,
    sideFoldWidth: 90,
    headerHeight: 58,
    whether: true,
    breadcrumb: true,
    breadcrumbIcon: true,
    tag: true,
    tagStyle: 'radio',
    footer: true,
    footerHeight: 48,
    primaryColor: '#71C9CE',
    successColor: '#18A058',
    warningColor: '#F0783D',
    errorColor: '#E23C55',
    infoColor: '#C2C2C2'
  }
}
