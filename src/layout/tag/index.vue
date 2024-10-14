<template>
  <div ref="tagContainer" class="tag-container">
    <div class="tag">
      <div
        v-for="(item, index) in tagData"
        :key="index"
        class="tag-item"
        :class="{
          'tag-item_button': tagStyle === 'button',
          'tag-item-active': item.isActive === true,
          'tag-item_radio': tagStyle === 'radio',
          'tag-item-radio-active': item.isActive === true
        }"
        @click="toPage(item)"
      >
        <i :class="item.icon" class="inline-block m-r-5px m-b-2px"></i>{{ item.label }}
        <i
          v-if="item.close"
          i-solar-close-square-bold-duotone
          class="tag-item-close"
          @click.stop="removeTag(item)"
        ></i>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { useRouter } from 'vue-router'
import { computed, onMounted } from 'vue'
const router = useRouter()
import useThemeStore from '@/stores/modules/theme'
const useTheme = useThemeStore()
const tagData = computed(() => useTheme.$state.tagData)
const tagStyle = computed(() => useTheme.$state.tagStyle)
import tinycolor from 'tinycolor2'
import { getThemeOverrides } from '@/config/theme.config'
const themeOverrides = getThemeOverrides()
const tagContainer = ref()

const color = computed(() => themeOverrides.value.common?.primaryColor)

const hoverColor = computed(() => {
  return tinycolor(color.value).darken(20).toRgbString()
})
const toPage = (item: any) => {
  router.push(item.key)
  useTheme.setTagData({
    tag: item
  })
}

const removeTag = (item: any) => {
  useTheme.removeTag({ tag: item })
}

// 鼠标横向滚动
onMounted(() => {
  if (tagContainer) {
    tagContainer.value.addEventListener('wheel', handleWheel, { passive: false })
  }
})

// 这个函数处理鼠标滚轮事件。它阻止默认的垂直滚动行为，并将滚轮的垂直移动 (deltaY) 转换为容器的水平滚动 (scrollLeft)。
const handleWheel = (e: WheelEvent) => {
  e.preventDefault()
  const container = e.currentTarget as HTMLElement
  container.scrollLeft += e.deltaY
}
</script>

<style lang="scss" scoped>
.tag-container {
  // 设置为可以水平滚动 (overflow-x-auto)，但垂直方向隐藏溢出 (overflow-y-hidden)。使用各种浏览器特定的属性来隐藏滚动条。
  @apply w-100% h-100% overflow-x-auto overflow-y-hidden;
  scrollbar-width: none;
  -ms-overflow-style: none;
  &::-webkit-scrollbar {
    display: none;
  }
}

.tag {
  // 将宽度设置为 w-max，确保它可以容纳所有的标签项而不被截断。
  @apply w-max h-100% flex items-center px-20px;
  border-bottom: 1px solid #ebebeb;

  &-item {
    // 添加 whitespace-nowrap 确保标签文本不会换行。
    @apply flex-center m-r-10px px-10px py-5px whitespace-nowrap;
    cursor: pointer;

    &-close {
      @apply w-16px h-16px m-b-2px m-l-10px;

      &:hover {
        color: #f56c6c !important;
      }
    }

    &-active {
      @apply text-white;
      background-color: v-bind(color);
      border-color: v-bind(color) !important;
    }

    &-radio-active {
      &::before,
      &::after {
        position: absolute;
        bottom: 0;
        content: '';
        width: 15px;
        height: 20px;
        border-radius: 100%;
        box-shadow: 0 0 0 40px v-bind(color) !important;
      }

      &::before {
        left: -15px;
        clip-path: inset(50% -10px 0 50%);
      }

      &::after {
        right: -15px;
        clip-path: inset(50% 50% 0 -10px);
      }
    }
  }

  &-item_button {
    @apply flex-center b-rd-3px b-1px b-solid b-gray-300;

    &:hover {
      @apply v-bind(hoverColor);
      transition: all 0.3s;
      color: v-bind(hoverColor);

      i {
        color: v-bind(hoverColor);
        transition: all 0.3s;
      }
    }
  }

  &-item_radio {
    @apply relative flex-center h-35px m-t-auto m-r-20px;
    border-radius: 10px 10px 0 0;

    &:hover {
      background-color: v-bind(hoverColor);
      color: #fff;

      &::before,
      &::after {
        box-shadow: 0 0 0 40px v-bind(hoverColor) !important;
      }
    }

    &::before,
    &::after {
      position: absolute;
      bottom: 0;
      content: '';
      width: 15px;
      height: 20px;
      border-radius: 100%;
      box-shadow: 0 0 0 40px transparent;
    }

    &::before {
      left: -15px;
      clip-path: inset(50% -10px 0 50%);
    }

    &::after {
      right: -15px;
      clip-path: inset(50% 50% 0 -10px);
    }
  }
}
</style>
