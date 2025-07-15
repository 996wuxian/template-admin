<template>
  <div class="tag">
    <div
      v-for="(item, index) in tagData"
      :key="index"
      :class="{
        'tag-item_button': tagStyle === 'button',
        'tag-item-active': item.isActive === true,
        'tag-item_radio': tagStyle === 'radio',
        'tag-item-radio-active': tagStyle === 'radio' && item.isActive === true,
      }"
      class="tag-item"
      @click="toPage(item)"
    >
      <i :class="item.icon" class="inline-block m-r-5px m-b-2px"></i>
      {{ item.label }}
      <i
        v-if="item.close"
        i-solar-close-square-bold-duotone
        class="tag-item-close"
        @click.stop="removeTag(item)"
      ></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
  import tinycolor from 'tinycolor2'
  import { useRouter } from 'vue-router'
  import useThemeStore from '@/stores/modules/theme'
  import { getThemeOverrides } from '@/config/theme.config'

  const router = useRouter()
  const useTheme = useThemeStore()
  const themeOverrides = getThemeOverrides()

  const tagData = computed(() => useTheme.$state.tagData)
  const tagStyle = computed(() => useTheme.$state.tagStyle)
  const color = computed(() => themeOverrides.value.common?.primaryColor)
  const hoverColor = computed(() => {
    return tinycolor(color.value).darken(20).toRgbString()
  })

  const toPage = (item: any) => {
    router.push(item.key)
    useTheme.setTagData({
      tag: item,
    })
  }

  const removeTag = (item: any) => {
    useTheme.removeTag({ tag: item })
  }
</script>

<style lang="scss" scoped>
  .tag {
    @apply w-100% h-100% flex items-center px-20px;
    border-bottom: 1px solid #ebebeb;

    &-item {
      @apply flex-center m-r-10px px-10px py-5px;
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
        position: relative;
        &::before,
        &::after {
          @apply absolute bottom-0 w-15px h-20px rd-100%;
          content: '';
          box-shadow: 0 0 0 40px v-bind(color) !important; /*使用box-shadow不影响尺寸*/
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
          box-shadow: 0 0 0 40px v-bind(hoverColor) !important; /*使用box-shadow不影响尺寸*/
        }
      }

      &::before,
      &::after {
        @apply absolute bottom-0 w-15px h-20px rd-100%;
        content: '';
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
