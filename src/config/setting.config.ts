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
	// 加载时显示文字
	loadingText: '加载中...',
	// intelligence(前端导出路由)和 all(后端导出路由)两种方式
	authentication: 'intelligence'
}
