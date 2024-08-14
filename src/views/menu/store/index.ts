import { ref } from 'vue'
import { MenuList } from '@/service/api/mock-api'
import { arrayToTree, treeFilter } from '@/utils/tools'

interface User {
  id?: number
  userName?: string
  sex?: null
  nickName?: string
  phone?: string
  email?: string
  status?: string
  role?: string
}

const form = ref<User>({})

const $roleForm = ref()
const roleForm = ref<User>({})
const modalVisible = ref(false)
const showEdit = (row: any) => {
  roleForm.value = {
    ...row
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
  const { code, data } = await MenuList(true)
  if (code !== 200) return
  tableData.value = arrayToTree<Menu>(data, 'id', 'parentId', 'children')
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
    submit
  }
}
