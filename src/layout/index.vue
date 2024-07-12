<template>
  <n-layout has-sider>
    <n-layout-sider content-style="padding: 24px;" class="w-100px bg-cyan"> 海淀桥 </n-layout-sider>
    <n-layout>
      <n-layout-header><Header /></n-layout-header>
      <n-layout has-sider>
        <n-layout-sider content-style="padding: 24px;" class="w-100px bg-cyan">
          海淀桥
        </n-layout-sider>
        <n-layout-content content-style="padding: 24px;" class="bg-blue">
          <router-view />
        </n-layout-content>
      </n-layout>

      <n-layout-footer class="bg-amber">成府路</n-layout-footer>
    </n-layout>
  </n-layout>
</template>

<script setup lang="ts">
import Header from './header/index.vue'
</script>

<style scoped lang="scss"></style>
