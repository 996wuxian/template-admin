import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import piniaPersistConfig from '@/utils/persist' // 引入指定属性的持久化配置文件
import { Local } from '@/utils/storage'
import { setting } from '@/config/setting.config'
import { useRouter } from 'vue-router'

const useThemeStore = defineStore(
  'theme',
  () => {
    const router = useRouter()

    const state = reactive({
      themeType: Local.get('themeType') || setting.defaultTheme,
      themeValue: Local.get('themeValue') || setting.defaultThemeValue,
      fontSize: Local.get('fontSize') || 'default',
      layout: Local.get('layout') || setting.defaultLayout,
      sideWidth: Number(Local.get('sideWidth')) || setting.sideWidth,
      tagData: Local.get('tagData') || [
        {
          key: '/home',
          label: '首页',
          icon: 'i-solar-home-smile-bold',
          close: false,
          isActive: true
        }
      ]
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

    const setSideWidth = (actions: { sideWidth: number }) => {
      state.sideWidth = actions.sideWidth
    }

    const setTagData = (actions: { tag: object }) => {
      const item = state.tagData.find((item: any) => item.label === actions.tag.label)
      if (item) {
        state.tagData.forEach((element) => {
          element.isActive = false
        })
        item.isActive = true
        return
      }
      state.tagData.forEach((element) => {
        element.isActive = false
      })
      actions.tag.isActive = true
      state.tagData.push(actions.tag)
    }

    const removeTag = (actions: { tag: object }) => {
      state.tagData = state.tagData.filter((item) => item.label !== actions.tag.label)
      state.tagData.forEach((item) => {
        item.isActive = false
      })
      state.tagData[state.tagData.length - 1].isActive = true
      router.push(state.tagData[state.tagData.length - 1].key)
    }

    const setFontSize = (actions: { fontSize: string }) => {
      state.fontSize = actions.fontSize
    }

    return {
      ...toRefs(state),
      setThemeType,
      setThemeValue,
      setLayout,
      setSideWidth,
      setTagData,
      removeTag,
      setFontSize
    }
  },
  {
    // 注意defineStore的第三个参数可以传入插件配置
    // persist: true // 保存state下所有属性 格式为: theme : {state: {theme: 'black'}}
    persist: piniaPersistConfig('theme', [
      'themeType',
      'themeValue',
      'layout',
      'sideWidth',
      'tagData',
      'fontSize'
    ]) // 保存指定属性 格式为：themeType: {themeType: 'black'}
  }
)

export default useThemeStore
