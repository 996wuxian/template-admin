<template>
  <div class="tag">
    <div
      class="tag-item_button tag-item_radio"
      v-for="(item, index) in tagData"
      :key="index"
      @click="toPage(item)"
      :class="{ 'tag-item-active': item.isActive === true }"
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

  &-item_button {
    @apply flex-center px-10px py-5px b-rd-3px m-r-10px b-1px b-solid b-gray-300;
    cursor: pointer;
    transition: all 0.3s;

    &:hover {
      @apply b-[#A6E3E9];
      transition: all 0.3s;
      color: #71c9ce;

      i {
        @apply text-[#71C9CE];
        transition: all 0.3s;
      }
    }

    &-close {
      @apply w-16px h-16px m-b-2px m-l-10px;

      &:hover {
        color: #f56c6c !important;
      }
    }

    &-active {
      @apply b-[#A6E3E9] bg-[#A6E3E9] text-white;
    }
  }
}
</style>
