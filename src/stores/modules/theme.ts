import { defineStore } from 'pinia'
import { reactive, toRefs } from 'vue'
import piniaPersistConfig from '@/utils/persist' // 引入指定属性的持久化配置文件
import { Local } from '@/utils/storage'
import { setting } from '@/config/setting.config'
import { useRouter } from 'vue-router'

const defaultTag = [
  {
    key: '/home',
    label: '首页',
    icon: 'i-solar-home-smile-bold',
    close: false,
    isActive: true
  }
]

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
      sideFoldWidth: Number(Local.get('sideFoldWidth')) || setting.sideFoldWidth,
      headerHeight: Number(Local.get('headerHeight')) || setting.headerHeight,
      tagData: Local.get('tagData') || defaultTag,
      whether: Local.get('whether') || setting.whether,
      breadcrumb: Local.get('breadcrumb') || setting.breadcrumb,
      breadcrumbIcon: Local.get('breadcrumbIcon') || setting.breadcrumbIcon,
      tag: Local.get('tag') || setting.tag,
      tagStyle: Local.get('tagStyle') || setting.tagStyle
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

    const setSize = (actions: { type: keyof typeof state; size: number }) => {
      state[actions.type] = actions.size
    }

    const setTagData = (actions: { tag: any }) => {
      const item = state.tagData.find((item: any) => item.label === actions.tag.label)
      if (item) {
        state.tagData.forEach((element: any) => {
          element.isActive = false
        })
        item.isActive = true
        return
      }
      state.tagData.forEach((element: any) => {
        element.isActive = false
      })
      actions.tag.isActive = true
      state.tagData.push(actions.tag)
    }

    const removeTag = (actions: { tag: any }) => {
      state.tagData = state.tagData.filter((item: any) => item.label !== actions.tag.label)
      state.tagData.forEach((item: any) => {
        item.isActive = false
      })
      state.tagData[state.tagData.length - 1].isActive = true
      router.push(state.tagData[state.tagData.length - 1].key)
    }

    const setStatus = (actions: { type: keyof typeof state; bool: boolean }) => {
      state[actions.type] = actions.bool
    }

    const setTagStyle = (actions: { tagStyle: string }) => {
      state.tagStyle = actions.tagStyle
    }

    const setFontSize = (actions: { fontSize: string }) => {
      state.fontSize = actions.fontSize
    }

    return {
      ...toRefs(state),
      setThemeType,
      setThemeValue,
      setLayout,
      setSize,
      setTagData,
      removeTag,
      setStatus,
      setTagStyle,
      setFontSize
    }
  },
  {
    // persist: true // 保存state下所有属性 格式为: theme : {state: {theme: 'black'}}
    persist: piniaPersistConfig('theme', [
      'themeType',
      'themeValue',
      'layout',
      'sideWidth',
      'sideFoldWidth',
      'headerHeight',
      'tagData',
      'whether',
      'breadcrumb',
      'breadcrumbIcon',
      'tag',
      'tagType',
      'fontSize'
    ])
  }
)

export default useThemeStore
