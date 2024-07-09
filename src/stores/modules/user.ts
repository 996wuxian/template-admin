import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import piniaPersistConfig from '@/utils/persist'

interface User {
  id: number
  userName: string
  phone: string
  address: string
  roles: Array<any>
  state: number
  createdAt: string
  updatedAt: string
}

const useUserStore = defineStore(
  'user',
  () => {
    const state = reactive({
      userInfo: {} as User
    })

    const setUserInfo = async (action) => {
      state.userInfo = action.userInfo
    }

    return {
      ...toRefs(state),
      setUserInfo
    }
  },
  {
    persist: piniaPersistConfig('userInfo', ['userInfo'])
  }
)

export default useUserStore
