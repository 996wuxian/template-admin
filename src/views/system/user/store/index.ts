import { ref } from 'vue'

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
    ...row,
  }
  drawerVisible.value = true
}

const queryData = async () => {
  const data = [
    {
      id: 1,
      userName: 'admin',
      sex: '1',
      nickName: '管理员',
      phone: '12345678901',
      email: 'admin@admin.com',
      status: '1',
      role: '1',
    },
    {
      id: 2,
      userName: 'user',
      sex: '1',
      nickName: '用户',
    },
  ]
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
    submit,
  }
}
