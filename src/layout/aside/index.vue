<script setup lang="ts">
  import { h, ref } from 'vue'
  import { NIcon, NMenu } from 'naive-ui'
  import type { MenuOption } from 'naive-ui'
  import { useRoute, useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import useRoutesStore from '@/stores/modules/route'
  import useThemeStore from '@/stores/modules/theme'
  import { getThemeOverrides } from '@/config/theme.config'
  import type { GlobalThemeOverrides } from 'naive-ui'
  import { setting } from '@/config/setting.config'

  const themeOverrides = getThemeOverrides() as GlobalThemeOverrides
  const props = defineProps({
    mode: { type: String, default: 'vertical' },
    title: { type: Boolean, default: true },
  })

  const route = useRoute()
  const router = useRouter()
  const useTheme = useThemeStore()
  const routesStore = useRoutesStore()
  const { routes } = storeToRefs(routesStore)
  const inverted = ref(false)
  const sideWidth = computed(() => useTheme.sideWidth)
  const sideFoldWidth = computed(() => useTheme.sideFoldWidth)
  const oldSideWidth = computed(() => useTheme.oldSideWidth)
  const collapsed = computed(() => useTheme.collapsed)
  const layout = computed(() => useTheme.layout)
  // 容器类名
  const containerClass = computed(() => ({
    'flex-col': props.mode === 'vertical',
  }))
  // 图标样式
  const iconStyle = computed(() => ({
    width: !collapsed.value ? '20px' : '25px',
    height: !collapsed.value ? '20px' : '25px',
  }))
  // 是否显示标题
  const showTitle = computed(() => !collapsed.value)
  // 是否显示折叠按钮
  const showCollapseButton = computed(
    () => layout.value === 'top_menu_mixin' && props.mode === 'vertical',
  )
  // 折叠图标类名
  const collapseIconClass = computed(() => ({
    'i-solar-mirror-right-bold': sideWidth.value > sideFoldWidth.value,
    'i-solar-mirror-left-bold': sideWidth.value <= sideFoldWidth.value,
  }))

  // 递归转换路由为菜单选项
  function transformRoutesToMenu(routes: any[], parentPath = ''): MenuOption[] {
    return routes
      .filter((route) => !route.meta?.hide)
      .map((route) => {
        if (route.name === 'Root') {
          return transformRoutesToMenu(route.children || [], '')
        }

        // 构建完整路径
        const fullPath = route.path.startsWith('/')
          ? route.path
          : `${parentPath}/${route.path}`.replace(/\/+/g, '/')

        return {
          label: route.meta?.title || route.name,
          key: fullPath,
          children: route.children ? transformRoutesToMenu(route.children, fullPath) : undefined,
          icon: route.meta?.icon,
        }
      })
      .flat()
  }

  // 处理菜单点击
  function handleUpdateValue(key: string) {
    router.push(key)

    // 查找对应的菜单项
    const findMenuItem = (options: MenuOption[], targetKey: string): MenuOption | null => {
      for (const option of options) {
        if (option.key === targetKey) {
          return option
        }
        if (option.children) {
          const found = findMenuItem(option.children, targetKey)
          if (found) return found
        }
      }
      return null
    }

    const menuItem = findMenuItem(menuOptions, key)
    if (menuItem) {
      useTheme.setTagData({
        tag: {
          key: menuItem.key,
          label: menuItem.label,
          icon: menuItem.icon,
          close: key !== '/home', // 首页不允许关闭
          isActive: true,
        },
      })
    }
  }

  const menuOptions = transformRoutesToMenu(routes.value)

  function renderMenuIcon(option: any) {
    if (option.icon) {
      return h(NIcon, {
        class: `${option.icon}`,
      })
    } else {
      return null
    }
  }

  const changeSide = () => {
    useTheme.setStatus({
      type: 'collapsed',
      bool: !useTheme.collapsed,
    })

    useTheme.setSize({
      type: 'sideWidth',
      size: useTheme.collapsed ? sideFoldWidth.value : oldSideWidth.value,
    })
  }
</script>

<template>
  <div class="flex flex-1 h-100% flex-items-center overflow-hidden" :class="containerClass">
    <div
      v-if="title"
      class="flex-1 flex items-center justify-center p-10px text-16px font-700"
      :style="`color: ${themeOverrides.common?.primaryColor}`"
    >
      <div i-solar-widget-5-bold-duotone :style="iconStyle"></div>
      <span v-show="showTitle" class="m-l-10px line-clamp-1">{{ setting.title }}</span>
    </div>
    <n-menu
      :inverted="inverted"
      :collapsed="collapsed"
      :collapsed-width="sideFoldWidth"
      :options="menuOptions"
      :default-value="router.currentRoute.value.path"
      @update:value="handleUpdateValue"
      :render-icon="renderMenuIcon"
      :value="route.path"
      accordion
      class="w-100% items-center"
      :mode="mode"
    />
    <div v-if="showCollapseButton" class="theme-block" @click="changeSide">
      <i :class="collapseIconClass"></i>
    </div>
  </div>
</template>

<style scoped lang="scss">
  :deep(.n-menu) {
    height: 100%;
    width: 100%;
  }

  .theme-block {
    @apply flex-center p-10px b-rd-5px text-20px cursor-pointer w-fit mt-auto;
    transition: all 0.3s;

    &:hover {
      background-color: #ececed !important;
      transition: all 0.3s;

      i {
        color: #409eff;
        transition: all 0.3s;
      }
    }
  }
</style>
