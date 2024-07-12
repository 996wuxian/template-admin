<template>
  <div class="header">
    <i i-solar-mirror-left-bold></i>
    <i i-solar-mirror-right-bold></i>
    <!-- <i i-solar-rewind-back-circle-bold></i>
    <i i-solar-rewind-forward-circle-bold></i> -->
    <i i-solar-logout-3-bold-duotone></i>
    <i i-solar-maximize-square-minimalistic-outline></i>
    <i i-solar-minimize-square-minimalistic-linear></i>
    <i i-solar-palette-bold-duotone class="m-l-auto"></i>
  </div>
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHeaderStore } from './store/index'

const { whetherData, getWhether, fullscreen, drawerShow, loginOut } = useHeaderStore()

const route = useRoute()

getWhether()
</script>

<style scoped lang="scss">
.header {
  @apply flex flex-items-center w-100% h-58px px-20px;

  i {
    display: inline-block;
    @apply w-18px h-18px;
  }
}
</style>
