<template>
  <div class="aside">
    <div i-solar-widget-5-bold-duotone></div>
    <span v-show="Number(sideWidth) === 200"> {{ setting.title }}</span>
  </div>
  <n-menu
    v-if="menuOptions"
    :value="route.path"
    :options="menuOptions"
    accordion
    @update:value="(key: any) => change(key)"
    :render-icon="renderMenuIcon"
    :root-indent="36"
    :indent="12"
    :collapsed="sideWidth === 90 ? true : false"
    :collapsed-width="90"
    class="w-100%"
  />
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setting } from '@/config/setting.config'
import useRoutesStore from '@/stores/modules/routes'
import { NIcon } from 'naive-ui'
import useThemeStore from '@/stores/modules/theme'
const useTheme = useThemeStore()
const sideWidth = computed(() => useTheme.$state.sideWidth)
const routes = useRoutesStore().routes
const route = useRoute()
const router = useRouter()

const menuOptions = ref(routes)

// todo 动态渲染菜单图标 缺陷：只能写死, 动态的显示不出来
function renderMenuIcon(option: any) {
  if (option.icon) {
    return h(NIcon, {
      class: `${option.icon}`
    })
  } else {
    return null
  }
}

const change = (key: any) => {
  router.push(key)
}
</script>

<style lang="scss" scoped>
.aside {
  @apply text-18px font-700 color-[#71C9CE] cursor-pointer text-center my-10px flex flex-center justify-around;
}
</style>
