import { ref } from 'vue'
import { UserList } from '@/service/api/mock-api'

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

const $userForm = ref()
const userForm = ref<User>({})
const drawerVisible = ref(false)
const showEdit = (row: any) => {
  userForm.value = {
    ...row
  }
  drawerVisible.value = true
}

const queryData = async () => {
  const { code, data } = await UserList()
  if (code != 200) return
  tableData.value = data
}

const tableData = ref()

const loading = ref(false)
const reload = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}

const submit = async () => {
  await $userForm.value?.validate()
}

export const useUserStore = () => {
  return {
    form,
    drawerVisible,
    showEdit,
    $userForm,
    userForm,
    queryData,
    tableData,
    loading,
    reload,
    submit
  }
}
