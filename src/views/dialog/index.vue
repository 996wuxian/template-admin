<template>
  <div class="container">
    <n-button type="primary" @click="openModal({ type: 'Table', title: '弹窗1' })"
      >打开弹窗</n-button
    >
  </div>
</template>

<script setup lang="ts">
import { useDialogStore } from './store'

const { openModal } = useDialogStore()
</script>

<style scoped></style>
