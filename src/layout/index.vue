<template>
  <n-layout has-sider class="w-100vw h-100vh">
    <n-layout-sider
      :width="layout === 'left_menu' ? sideWidth : layout === 'left_menu_mixin' ? 90 : 0"
      collapse-mode="width"
      class="aside"
    >
      <Aside />
    </n-layout-sider>
    <n-layout class="w-100% h-100% transition-all">
      <n-layout-header><Header /></n-layout-header>
      <n-layout has-sider class="content">
        <n-layout-sider
          :width="layout === 'top_menu_mixin' ? sideWidth : 0"
          collapse-mode="width"
          class="aside"
        >
          <Aside />
        </n-layout-sider>
        <n-layout-content content-style="padding: 24px;" class="">
          <router-view />
        </n-layout-content>
      </n-layout>
      <n-layout-footer class="h-58px"></n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import Header from './header/index.vue'
import Aside from './aside/index.vue'
import useThemeStore from '@/stores/modules/theme'
const useTheme = useThemeStore()
const layout = computed(() => useTheme.$state.layout)
const sideWidth = computed(() => useTheme.$state.sideWidth)
</script>

<style scoped lang="scss">
.content {
  height: calc(100% - 116px);
  box-sizing: border-box;
}

.aside {
  box-shadow: 2px 0 10px rgba(156, 156, 156, 0.1);
  border-right: 1px solid #ebebeb;
  transition: all 0.3s;
}
</style>
