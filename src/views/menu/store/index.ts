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
const modalVisible = ref(false)
const showEdit = (row: any) => {
  roleForm.value = {
    ...row
  }
  modalVisible.value = true
}

interface Menu {
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

const data = ref<Menu[]>([
  {
    id: 1,
    title: '首页',
    icon: 'i-solar-home-smile-bold',
    name: 'home',
    url: '/home',
    status: '1',
    hide: '1',
    sort: 1
  },
  {
    id: 2,
    title: '系统管理',
    icon: 'i-solar-settings-minimalistic-bold-duotone',
    name: 'home',
    url: '/home',
    status: '1',
    hide: '1',
    sort: 1,
    children: [
      {
        id: 3,
        title: '系统管理',
        icon: 'i-solar-settings-minimalistic-bold-duotone',
        name: 'home',
        url: '/home',
        status: '1',
        hide: '1',
        sort: 1
      }
    ]
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
  console.log(roleForm.value, 'roleForm.value')
}

export const useMenuStore = () => {
  return {
    form,
    modalVisible,
    showEdit,
    $roleForm,
    roleForm,
    data,
    loading,
    reload,
    submit
  }
}
