<template>
  <div class="w-20px h-20px overflow-hidden">
    <div v-for="item in themeDatas" :key="item.id" @click.stop="changeTheme(item)">
      <i
        v-show="item.id === themeValue"
        class="inline-block w-20px h-20px"
        :class="[item.icon, item.color]"
      />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import useThemeStore from '@/stores/modules/theme'
const useTheme = useThemeStore()
const themeValue = ref(useTheme.$state.themeValue)

watch(
  () => useTheme.$state.themeValue,
  (newValue) => {
    themeValue.value = newValue
  }
)

const changeTheme = (item: any) => {
  if (themeValue.value >= 2) {
    themeValue.value = -1
  }

  themeValue.value++

  window.document.documentElement.setAttribute('data-theme', themeDatas.value[item.id].name)

  useTheme.setThemeType({ themeType: item.name })
  useTheme.setThemeValue({ themeValue: themeValue.value })
}

const themeDatas = ref([
  {
    id: 0,
    name: 'light',
    color: 'color-[#FDA736]',
    icon: 'i-solar-sun-fog-bold-duotone'
  },
  {
    id: 1,
    name: 'default',
    color: '',
    icon: 'i-solar-asteroid-bold-duotone'
  },
  {
    id: 2,
    name: 'dark',
    color: 'color-[#282A36]',
    icon: 'i-solar-moon-fog-bold-duotone'
  }
])

defineProps({
  showAll: {
    type: Boolean,
    default: false
  }
})

// defineExpose({ changeTheme })
</script>

<style lang="scss" scoped></style>
