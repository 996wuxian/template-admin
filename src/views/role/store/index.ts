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

const $roleForm = ref()
const roleForm = ref<User>({})
const drawerVisible = ref(false)
const showEdit = (row: any) => {
  roleForm.value = {
    ...row
  }
  drawerVisible.value = true
}

const data = ref([
  {
    id: 1,
    roleName: '普通用户',
    roleCode: '1',
    roleDesc: '测试角色',
    status: '1'
  },
  {
    id: 2,
    roleName: '管理员',
    roleCode: '2',
    roleDesc: '管理员',
    status: '0'
  },
  {
    id: 3,
    roleName: '超级管理员',
    roleCode: '3',
    roleDesc: '超级管理员',
    status: '1'
  }
])

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

export const useRoleStore = () => {
  return {
    form,
    drawerVisible,
    showEdit,
    $roleForm,
    roleForm,
    data,
    loading,
    reload,
    submit
  }
}
