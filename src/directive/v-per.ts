import useUserStore from '@/stores/modules/user'
import useRoutesStore from '@/stores/modules/routes'
import { DirectiveBinding } from 'vue'

// 1、Partial<Record<string, string[]>>
// 2、mapPermisstons[route.key as keyof typeof mapPermisstons]

const mapPermisstons: Partial<Record<string, string[]>> = {
  '/system/user': ['1', '2'],
  '/system/role': ['1', '2'],
  '/system/menu': ['1', '2'],
  '/change-role': ['1', '2']
}
/**
 * @description 按钮权限指令
 */
export const vPer = (el: HTMLDivElement, bindings: DirectiveBinding<any>) => {
  const { userInfo } = useUserStore()
  const { route } = useRoutesStore()
  const role = userInfo.roleId

  const allowedRoles = mapPermisstons[route.key] || []
  if (!allowedRoles.includes(role?.toString()!)) {
    el.style.display = 'none'
  }
}
