import Table from '../components/Table.vue'
import Form from '../components/Form.vue'
import { dialog } from '@/hooks/dialog'
import { ref } from 'vue'

const map = {
  Table,
  Form
}

// 使用 Map 管理多个弹窗实例
const modalMap = ref(new Map<string, { close: () => void }>())
const modalCounter = ref(0)

// 创建唯一的 modalKey
const createModalKey = () => {
  modalCounter.value += 1
  return `${modalCounter.value}`
}
const openModal = (options: {
  type: keyof typeof map
  title: string
  props?: Record<string, any>
}) => {
  const { type, title, props = {} } = options
  const modalKey = createModalKey()

  const modal = dialog(
    map[type],
    {
      title,
      modalKey,
      ...props
    },
    {
      style: {
        width: '700px'
      },
      closable: false,
      maskClosable: false,
      onBeforeLeave: () => {
        modalMap.value.delete(modalKey)
      }
    }
  )
  modalMap.value.set(modalKey, modal)
  return modalKey
}

// 关闭指定弹窗
const closeModal = (key: string) => {
  modalMap.value.get(key)?.close()
}

// 关闭所有弹窗
const closeAllModals = () => {
  modalMap.value.forEach((modal) => modal.close())
  modalMap.value.clear()
}

export const useDialogStore = () => {
  return {
    openModal,
    closeModal,
    closeAllModals,
    modalMap
  }
}
