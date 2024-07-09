import { setting } from '@/config/setting.config'
const title = setting.title

export default function getPageTitle(pageTitle: string) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
