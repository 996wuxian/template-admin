<template>
  <div class="header theme-page">
    <div class="header-block">
      <i i-solar-mirror-left-bold></i>
      <!-- <i i-solar-mirror-right-bold></i> -->
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
        <svg-icon
          name="user"
          class="m-r-10px"
          :width="22"
          :height="22"
          hoverFill="#409eff"
          hoverable
          fill="#333"
        />
        Belinda
        <i i-solar-alt-arrow-down-bold-duotone class="m-l-5px"></i>
      </div>
    </n-dropdown>
  </div>

  <Drawer :show="drawerShow" title="主题配置" @close="close" />
</template>

<script setup lang="ts">
import { useRoute } from 'vue-router'
import { useHeaderStore } from './store/index'
import Drawer from './components/drawer.vue'
import { useFullscreen } from '@/utils/fullScrenn'
const { isFullscreen, enterFullscreen, exitFullscreen } = useFullscreen()
import ThemeToggler from '@/components/custom/theme-toggler.vue'

const toggleFullscreen = () => {
  if (isFullscreen.value) {
    exitFullscreen()
  } else {
    enterFullscreen()
  }
}

const { whetherData, getWhether, fullscreen, drawerShow, loginOut } = useHeaderStore()

const route = useRoute()

getWhether()

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
