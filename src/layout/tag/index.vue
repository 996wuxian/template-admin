<template>
  <div class="tag">
    <div
      class="tag-item"
      v-for="(item, index) in tagData"
      :key="index"
      @click="toPage(item)"
      :class="{
        'tag-item_button': tagStyle === 'button',
        'tag-item-active': item.isActive === true,
        'tag-item_radio': tagStyle === 'radio',
        'tag-item-radio-active': item.isActive === true
      }"
    >
      <i :class="item.icon" class="inline-block m-r-5px m-b-2px"></i>{{ item.label }}
      <i
        i-solar-close-square-bold-duotone
        class="tag-item-close"
        v-if="item.close"
        @click.stop="removeTag(item)"
      ></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import useThemeStore from '@/stores/modules/theme'
const useTheme = useThemeStore()
const tagData = computed(() => useTheme.$state.tagData)
const tagStyle = computed(() => useTheme.$state.tagStyle)

const toPage = (item: any) => {
  router.push(item.key)
  useTheme.setTagData({
    tag: item
  })
}

const removeTag = (item: any) => {
  useTheme.removeTag({ tag: item })
}
</script>

<style lang="scss" scoped>
.tag {
  @apply w-100% h-44px flex items-center px-20px;
  border-bottom: 1px solid #ebebeb;

  &-item {
    @apply flex-center m-r-10px px-10px py-5px;
    cursor: pointer;
    transition: all 0.3s;

    &-close {
      @apply w-16px h-16px m-b-2px m-l-10px;

      &:hover {
        color: #f56c6c !important;
      }
    }

    &-active {
      @apply bg-[#A6E3E9] text-white;
      border-color: #a6e3e9 !important;
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
        box-shadow: 0 0 0 40px #a6e3e9 !important; /*使用box-shadow不影响尺寸*/
        transition: all 0.5s;
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
      @apply b-[#A6E3E9];
      transition: all 0.3s;
      color: #71c9ce;

      i {
        @apply text-[#71C9CE];
        transition: all 0.3s;
      }
    }
  }

  &-item_radio {
    @apply relative flex-center h-35px m-t-auto m-r-20px;
    border-radius: 10px 10px 0 0;
    transition: all 0.3s;

    &:hover {
      @apply bg-[#A6E3E9];
      transition: all 0.3s;
      color: #fff;

      &::before,
      &::after {
        box-shadow: 0 0 0 40px #a6e3e9; /*使用box-shadow不影响尺寸*/
        transition: all 0.3s;
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
      box-shadow: 0 0 0 40px transparent; /*使用box-shadow不影响尺寸*/
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
