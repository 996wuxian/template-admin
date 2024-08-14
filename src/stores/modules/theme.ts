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
      themeType: Local.get('themeType') || setting.theme.defaultTheme,
      themeValue: Local.get('themeValue') || setting.theme.defaultThemeValue,
      fontSize: Local.get('fontSize') || 'default',
      layout: Local.get('layout') || setting.theme.defaultLayout,
      sideWidth: Number(Local.get('sideWidth')) || setting.theme.sideWidth,
      oldSideWidth: Number(Local.get('oldSideWidth')) || setting.theme.sideWidth,
      sideFoldWidth: Number(Local.get('sideFoldWidth')) || setting.theme.sideFoldWidth,
      headerHeight: Number(Local.get('headerHeight')) || setting.theme.headerHeight,
      tagData: Local.get('tagData') || defaultTag,
      whether: Local.get('whether') || setting.theme.whether,
      breadcrumb: Local.get('breadcrumb') || setting.theme.breadcrumb,
      breadcrumbIcon: Local.get('breadcrumbIcon') || setting.theme.breadcrumbIcon,
      tag: Local.get('tag') || setting.theme.tag,
      tagStyle: Local.get('tagStyle') || setting.theme.tagStyle,
      footer: Local.get('footer') || setting.theme.footer,
      footerHeight: Number(Local.get('footerHeight')) || setting.theme.footerHeight,
      primaryColor: Local.get('primaryColor') || setting.theme.primaryColor,
      successColor: Local.get('successColor') || setting.theme.successColor,
      warningColor: Local.get('warningColor') || setting.theme.warningColor,
      errorColor: Local.get('errorColor') || setting.theme.errorColor,
      infoColor: Local.get('infoColor') || setting.theme.infoColor
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

    const setColor = (actions: { type: keyof typeof state; value: string }) => {
      state[actions.type] = actions.value
    }

    const setFontSize = (actions: { fontSize: string }) => {
      state.fontSize = actions.fontSize
    }

    const initTheme = () => {
      state.themeType = setting.theme.defaultTheme
      state.themeValue = setting.theme.defaultThemeValue
      state.layout = setting.theme.defaultLayout
      state.sideWidth = setting.theme.sideWidth
      state.oldSideWidth = setting.theme.sideWidth
      state.sideFoldWidth = setting.theme.sideFoldWidth
      state.headerHeight = setting.theme.headerHeight
      state.breadcrumb = setting.theme.breadcrumb
      state.breadcrumbIcon = setting.theme.breadcrumbIcon
      state.tag = setting.theme.tag
      state.tagStyle = setting.theme.tagStyle
      state.footer = setting.theme.footer
      state.footerHeight = setting.theme.footerHeight
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
      setFontSize,
      setColor,
      initTheme
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
      'tagStyle',
      'footer',
      'footerHeight',
      'fontSize',
      'primaryColor',
      'successColor',
      'warningColor',
      'errorColor',
      'infoColor'
    ])
  }
)

export default useThemeStore
