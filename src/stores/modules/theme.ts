import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import piniaPersistConfig from '@/utils/persist' // 引入指定属性的持久化配置文件
import { Local } from '@/utils/storage'
import { setting } from '@/config/setting.config'

const useThemeStore = defineStore(
  'theme',
  () => {
    const state = reactive({
      themeType: Local.get('themeType') || setting.defaultTheme,
      themeValue: Local.get('themeValue') || setting.defaultThemeValue,
      fontSize: Local.get('fontSize') || 'default',
      layout: Local.get('layout') || setting.defaultLayout
    })

    const setThemeType = (actions: { themeType: string }) => {
      state.themeType = actions.themeType
    }

    const setThemeValue = (actions: { themeValue: string }) => {
      state.themeValue = actions.themeValue
    }

    const setLayout = (actions: { layout: string }) => {
      state.layout = actions.layout
    }

    const setFontSize = (actions: { fontSize: string }) => {
      state.fontSize = actions.fontSize
    }

    return {
      ...toRefs(state),
      setThemeType,
      setThemeValue,
      setLayout,
      setFontSize
    }
  },
  {
    // 注意defineStore的第三个参数可以传入插件配置
    // persist: true // 保存state下所有属性 格式为: theme : {state: {theme: 'black'}}
    persist: piniaPersistConfig('theme', ['themeType', 'themeValue', 'fontSize']) // 保存指定属性 格式为：themeType: {themeType: 'black'}
  }
)

export default useThemeStore
