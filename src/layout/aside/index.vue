<template>
  <div class="text-18px font-700 color-[#71C9CE] cursor-pointer text-center my-10px">
    <slot name="title">
      {{ setting.title }}
    </slot>
  </div>
  <n-menu
    :value="route.path"
    :options="menuOptions"
    accordion
    @update:value="(key: any) => change(key)"
    class="w-100%"
  />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setting } from '@/config/setting.config'
import useRoutesStore from '@/stores/modules/routes'
const routes = useRoutesStore().routes
const route = useRoute()
const router = useRouter()

const menuOptions = routes

const change = (key: any) => {
  router.push(key)
}
</script>

<style lang="scss" scoped></style>
