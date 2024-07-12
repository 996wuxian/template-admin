<template>
  <n-drawer v-model:show="drawerShow" :width="width" :placement="placement">
    <n-drawer-content :title="title">
      <slot name="content"></slot>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
defineProps({
  drawerShow: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 502
  },
  placement: {
    type: String,
    default: 'right'
  },
  title: {
    type: String,
    default: '标题'
  }
})
</script>

<style lang="scss" scoped></style>
