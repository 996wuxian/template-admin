<template>
  <div class="layout" :class="[isActive ? 'layout-active' : '']">
    <div class="h-full w-10px bg-[#CBF1F5] b-rd-5px m-r-5px" v-if="nav"></div>
    <div class="h-full w-18px bg-[#CBF1F5] b-rd-5px m-r-5px" v-if="side"></div>
    <div class="flex flex-col flex-1">
      <div class="w-100% h-18px bg-[#71C9CE] b-rd-5px m-b-5px" v-if="header"></div>
      <div class="flex-1 flex">
        <div class="w-18px h-full bg-[#CBF1F5] b-rd-5px m-r-5px" v-if="aside"></div>
        <div class="bg-[#E3FDFD] b-rd-5px flex-1" v-if="content"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
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
  }
})
</script>

<style lang="scss" scoped>
.layout {
  @apply w-106px h-74px rd-8px p-6px  flex b-solid b-2px b-[#fff];
  box-shadow: 0 2px 10px rgba($color: #000, $alpha: 0.1);
  transition: all 0.3s;

  &:hover {
    @apply b-[#71C9CE];
    transition: all 0.3s;
  }
}

.layout-active {
  @apply b-[#71C9CE];
}
</style>
