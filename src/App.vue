<script setup lang="ts">
import { RouterView } from 'vue-router'
import themeOverrides from '@/config/theme.config'
import useThemeStore from '@/stores/modules/theme'
const useTheme = useThemeStore()

onMounted(() => {
  const type = useTheme.$state.themeType
  window.document.documentElement.setAttribute('data-theme', type)
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides">
    <n-dialog-provider>
      <n-message-provider>
        <RouterView />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped></style>
