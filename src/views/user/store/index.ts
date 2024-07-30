import { ref } from 'vue'

interface User {
  userName?: string
  sex?: null
  nickName?: string
  phone?: string
  email?: string
  status?: string
  role?: string
}

const form = ref<User>({})

const userForm = ref<User>({})
const drawerVisible = ref(false)
const showEdit = (row: any) => {
  userForm.value = {
    ...row
  }
  drawerVisible.value = true
}

const data = ref([
  {
    id: 1,
    userName: 'qwer',
    sex: '1',
    nickName: 'overa',
    phone: '1351231231',
    email: 'aowbnao@gmail.com',
    status: '1',
    role: [1]
  },
  {
    id: 2,
    userName: 'dala',
    sex: '2',
    nickName: 'eosao',
    phone: '1351231231',
    email: 'aowbnao@gmail.com',
    status: '0',
    role: [2]
  }
])

const loading = ref(false)
const reload = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}

export const useUserStore = () => {
  return {
    form,
    drawerVisible,
    showEdit,
    userForm,
    data,
    loading,
    reload
  }
}
