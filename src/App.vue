<script setup lang="ts">
import { watch } from 'vue'
import { RouterView } from 'vue-router'
import { useOsTheme, darkTheme } from 'naive-ui'
import type { GlobalTheme } from 'naive-ui'
import { getThemeOverrides } from '@/config/theme.config'
import useThemeStore from '@/stores/modules/theme'

const useTheme = useThemeStore()
const osThemeRef = useOsTheme() // 跟随系统
const theme = ref<GlobalTheme | null>(null)
const themeType = computed(() => useTheme.themeType)
const osThemeType = computed(() => osThemeRef.value)
const themeOverrides = getThemeOverrides()
watch(
  () => [themeType.value, osThemeType.value],
  ([newType, newOsTheme]) => {
    if (newType === 'dark') {
      theme.value = darkTheme
    } else if (newType === 'default' && newOsTheme === 'dark') {
      theme.value = darkTheme
    } else {
      theme.value = null
    }
  },
  {
    immediate: true
  }
)

onMounted(() => {
  window.document.documentElement.setAttribute('data-theme', useTheme.$state.themeType)
})
</script>

<template>
  <n-config-provider :theme-overrides="themeOverrides" :theme="theme">
    <n-dialog-provider>
      <n-message-provider>
        <RouterView />
      </n-message-provider>
    </n-dialog-provider>
  </n-config-provider>
</template>

<style scoped lang="scss"></style>
