import { ref } from 'vue'

interface User {
  userName?: string
  sex?: null
  nickName?: string
  phone?: string
  email?: string
  status?: string
  Role?: string
}

const form = ref<User>({})

const drawerVisible = ref(false)
const showEdit = (row) => {
  drawerVisible.value = true
}

const userForm = ref<User>({})
export const useUserStore = () => {
  return {
    form,
    drawerVisible,
    showEdit,
    userForm
  }
}
