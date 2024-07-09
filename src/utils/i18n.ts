import i18n from '@/lang/index'
export const generateTitle = (title: string) => {
  //i18n.global.te('routers.' + title) 只能在ts文件中用
  const hasKey = i18n.global.te(`routers.${title}`) //返回布尔值，如果lang文件夹下没有配置routers.title 则返回false
  if (hasKey) {
    const translatedTitle = i18n.global.t(`routers.${title}`)
    return translatedTitle
  }
  return title
}
