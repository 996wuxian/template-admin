<template>
  <n-layout has-sider class="w-100vw h-100vh">
    <n-layout-sider content-style="padding: 20px;" class="w-100px bg-cyan"> 海淀桥 </n-layout-sider>
    <n-layout class="w-100% h-100%">
      <n-layout-header><Header /></n-layout-header>
      <n-layout has-sider class="content">
        <n-layout-sider content-style="padding: 24px;" class="w-100px bg-cyan">
          海淀桥
        </n-layout-sider>
        <n-layout-content content-style="padding: 24px;" class="bg-blue">
          <router-view />
        </n-layout-content>
      </n-layout>

      <n-layout-footer class="bg-amber h-58px">成府路</n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import Header from './header/index.vue'
</script>

<style scoped lang="scss">
.content {
  height: calc(100% - 116px);
}
</style>
