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
    role: ['1']
  },
  {
    id: 2,
    userName: 'dala',
    sex: '2',
    nickName: 'eosao',
    phone: '1351231231',
    email: 'aowbnao@gmail.com',
    status: '0',
    role: ['2']
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
  await $userForm.value?.validate()
  console.log(userForm.value, 'userForm.value')
}

export const useUserStore = () => {
  return {
    form,
    drawerVisible,
    showEdit,
    $userForm,
    userForm,
    data,
    loading,
    reload,
    submit
  }
}
