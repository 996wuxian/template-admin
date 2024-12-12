<template>
  <div class="flex w-100% h-100% flex-items-center overflow-hidden" :class="containerClass">
    <div v-if="title" class="title" :style="`color: ${themeOverrides.common?.primaryColor}`">
      <div i-solar-widget-5-bold-duotone :style="iconStyle"></div>
      <span v-show="showTitle" class="m-l-10px">{{ setting.title }}</span>
    </div>

    <n-menu
      v-if="menuOptions"
      :value="route.path"
      :options="menuOptions"
      accordion
      :render-icon="renderMenuIcon"
      :root-indent="36"
      :indent="12"
      :collapsed="collapsed"
      :collapsed-width="sideFoldWidth"
      :mode="mode"
      responsive
      class="w-100%"
      @update:value="(key, item) => change(key, item)"
    />

    <div v-if="showCollapseButton" class="theme-block" @click="changeSide">
      <i :class="collapseIconClass"></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NIcon } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

import { setting } from '@/config/setting.config'
import useRoutesStore from '@/stores/modules/routes'
import useThemeStore from '@/stores/modules/theme'
import { getThemeOverrides } from '@/config/theme.config'

const themeOverrides = getThemeOverrides() as GlobalThemeOverrides
const useTheme = useThemeStore()
const routes = useRoutesStore().routes
const useRoutes = useRoutesStore()
const route = useRoute()
const router = useRouter()

const sideWidth = computed(() => useTheme.$state.sideWidth)
const oldSideWidth = computed(() => useTheme.$state.oldSideWidth)
const sideFoldWidth = computed(() => useTheme.$state.sideFoldWidth)
const layout = computed(() => useTheme.$state.layout)
const collapsed = computed(() => useTheme.$state.collapsed)
// 容器类名
const containerClass = computed(() => ({
  'flex-col': props.mode === 'vertical'
}))
// 图标样式
const iconStyle = computed(() => ({
  width: !collapsed.value ? '20px' : '25px',
  height: !collapsed.value ? '20px' : '25px'
}))
// 是否显示标题
const showTitle = computed(() => !collapsed.value)
// 是否显示折叠按钮
const showCollapseButton = computed(() => layout.value === 'top_menu_mixin' && props.collapsed)
// 折叠图标类名
const collapseIconClass = computed(() => ({
  'i-solar-mirror-right-bold': sideWidth.value > sideFoldWidth.value,
  'i-solar-mirror-left-bold': sideWidth.value <= sideFoldWidth.value
}))

const menuOptions = ref(routes)

const props = defineProps({
  mode: { type: String, default: 'vertical' },
  title: { type: Boolean, default: true }
})

// todo 动态渲染菜单图标 缺陷：需要在uno.config.ts的safelist中先添加对应icon
function renderMenuIcon(option: any) {
  if (option.icon) {
    return h(NIcon, {
      class: `${option.icon}`
    })
  } else {
    return null
  }
}

const change = (key: any, item: any) => {
  router.push(key)
  useTheme.setTagData({
    tag: {
      ...item,
      close: true
    }
  })
  useRoutes.setCurrentRoute({ route: item })
}

const changeSide = () => {
  useTheme.setSize({
    type: 'sideWidth',
    size: sideWidth.value > sideFoldWidth.value ? sideFoldWidth.value : oldSideWidth.value
  })
}
</script>

<style lang="scss" scoped>
.title {
  @apply text-18px font-700 color-[#71C9CE] cursor-pointer text-center my-10px flex flex-items-center justify-around min-w-200px;
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
