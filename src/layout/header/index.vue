<template>
  <div class="header theme-page">
    <div
      class="header-block"
      @click="changeSide"
      v-if="layout === 'left_menu' || layout === 'left_menu_mixin'"
    >
      <i i-solar-mirror-right-bold v-if="sideWidth === 200"></i>
      <i i-solar-mirror-left-bold v-else></i>
    </div>
    <div class="header-block m-l-auto" @click="toggleFullscreen">
      <i i-solar-maximize-square-minimalistic-outline v-if="!isFullscreen"></i>
      <i i-solar-minimize-square-minimalistic-linear v-else></i>
    </div>
    <!-- <i i-solar-rewind-back-circle-bold></i>
    <i i-solar-rewind-forward-circle-bold></i> -->
    <!-- <i i-solar-logout-3-bold-duotone></i> -->
    <div class="header-block">
      <i i-solar-palette-bold-duotone class="m-l-auto" @click="drawerShow = true"></i>
    </div>
    <div class="header-block">
      <ThemeToggler />
    </div>
    <n-dropdown
      trigger="click"
      :options="options"
      :show-arrow="true"
      @select="(key: any) => key === 'loginOut' && loginOut()"
    >
      <div class="header-block">
        <i i-solar-user-bold-duotone class="w-20px h-20px"></i>
        <span class="mx-10px">Belinda</span>
        <i i-solar-alt-arrow-down-bold-duotone></i>
      </div>
    </n-dropdown>
  </div>

  <Drawer :show="drawerShow" title="主题配置" @close="close" />
</template>

<script setup lang="ts">
import { useHeaderStore } from './store/index'
import Drawer from './components/drawer.vue'
import { useFullscreen } from '@/utils/fullScrenn'
const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen()
import ThemeToggler from '@/components/custom/theme-toggler.vue'
import useThemeStore from '@/stores/modules/theme'
const themeStore = useThemeStore()
const sideWidth = computed(() => themeStore.$state.sideWidth)
const layout = computed(() => themeStore.$state.layout)
const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exitFullscreen()
  } else {
    enterFullscreen()
  }
}

const { whetherData, getWhether, drawerShow, loginOut } = useHeaderStore()

const changeSide = () => {
  console.log(sideWidth, 'sideWidth')

  themeStore.setSideWidth({
    sideWidth: themeStore.sideWidth === 200 ? 90 : 200
  })
}

// getWhether()

const close = () => {
  drawerShow.value = false
}

const options = [
  {
    label: '退出登录',
    key: 'loginOut'
  }
]
</script>

<style scoped lang="scss">
.header {
  @apply flex flex-items-center w-100% h-58px px-20px;
  border-bottom: 1px solid #ebebeb;

  &-block {
    @apply flex-center p-10px b-rd-5px m-r-20px;
    transition: all 0.3s;
    cursor: pointer;

    &:last-child {
      @apply m-r-0px;
    }

    &:hover {
      background-color: #ececed !important;
      transition: all 0.3s;

      i {
        color: #409eff;
        transition: all 0.3s;
      }
    }
  }

  i {
    display: inline-block;
    @apply w-18px h-18px;
    transition: all 0.3s;
  }
}
</style>
