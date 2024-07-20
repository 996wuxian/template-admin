<template>
  <n-tooltip placement="bottom" trigger="hover">
    <template #trigger>
      <div class="layout" :class="[isActive ? 'layout-active' : '']">
        <div class="block w-10px" v-if="nav"></div>
        <div class="block w-18px" v-if="side"></div>
        <div class="flex flex-col flex-1">
          <div class="header" v-if="header"></div>
          <div class="flex-1 flex">
            <div class="block w-18px" v-if="aside"></div>
            <div class="content" v-if="content"></div>
          </div>
        </div>
      </div>
    </template>
    <span> {{ tip }} </span>
  </n-tooltip>
</template>

<script lang="ts" setup>
import { getThemeOverrides } from '@/config/theme.config'
import tinycolor from 'tinycolor2'
const themeOverrides = getThemeOverrides()

const color = computed(() => themeOverrides.value.common?.primaryColor)
const lightenColor = computed(() => {
  return tinycolor(color.value).lighten(20).toRgbString()
})
const lightenMoreColor = computed(() => {
  return tinycolor(color.value).lighten(30).toRgbString()
})

defineProps({
  nav: {
    type: Boolean,
    default: false
  },
  side: {
    type: Boolean,
    default: false
  },
  header: {
    type: Boolean,
    default: false
  },
  aside: {
    type: Boolean,
    default: false
  },
  content: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: false
  },
  tip: {
    type: String,
    default: ''
  }
})
</script>

<style lang="scss" scoped>
.layout {
  @apply w-106px h-74px rd-8px p-6px  flex b-solid b-2px b-[#fff] m-b-20px;
  box-shadow: 0 2px 10px rgba($color: #000, $alpha: 0.1);
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    border-color: v-bind(color);
    transition: all 0.3s;
  }
}

.layout-active {
  border-color: v-bind(color);
}

.block {
  @apply h-full  b-rd-5px m-r-5px;
  background-color: v-bind(lightenColor);
}

.header {
  @apply w-100% h-18px b-rd-5px m-b-5px;
  background-color: v-bind(color);
}

.content {
  @apply b-rd-5px flex-1;
  background-color: v-bind(lightenMoreColor);
}
</style>
