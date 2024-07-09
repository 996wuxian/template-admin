import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import piniaPersistConfig from '@/utils/persist' // 引入指定属性的持久化配置文件

const useThemeStore = defineStore(
  'theme',
  () => {
    const state = reactive({
      themeType: localStorage.getItem('themeType') || 'white',
      fontSize: localStorage.getItem('fontSize') || 'default'
    })

    const setTheme = (actions) => {
      state.themeType = actions.themeType
    }

    const setFontSize = (actions) => {
      state.fontSize = actions.fontSize
    }

    return {
      ...toRefs(state),
      setTheme,
      setFontSize
    }
  },
  {
    // 注意defineStore的第三个参数可以传入插件配置
    // persist: true // 保存state下所有属性 格式为: theme : {state: {theme: 'black'}}
    persist: piniaPersistConfig('theme', ['themeType', 'fontSize']) // 保存指定属性 格式为：themeType: {themeType: 'black'}
  }
)

export default useThemeStore
