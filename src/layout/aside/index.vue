<template>
  <div class="flex flex-col w-100% h-100% flex-items-center overflow-hidden">
    <div class="title">
      <div
        i-solar-widget-5-bold-duotone
        :style="[
          Number(sideWidth) === 200
            ? { width: '20px', height: '20px' }
            : { width: '25px', height: '25px' }
        ]"
      ></div>
      <span v-show="Number(sideWidth) === 200" class="m-l-10px"> {{ setting.title }}</span>
    </div>
    <n-menu
      v-if="menuOptions"
      :value="route.path"
      :options="menuOptions"
      accordion
      @update:value="(key: any, item: any) => change(key, item)"
      :render-icon="renderMenuIcon"
      :root-indent="36"
      :indent="12"
      :collapsed="sideWidth === 90 ? true : false"
      :collapsed-width="90"
      class="w-100%"
    />
    <div class="theme-block" @click="changeSide" v-if="layout === 'top_menu_mixin'">
      <i i-solar-mirror-right-bold v-if="sideWidth === 200"></i>
      <i i-solar-mirror-left-bold v-else></i>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { setting } from '@/config/setting.config'
import useRoutesStore from '@/stores/modules/routes'
import { NIcon } from 'naive-ui'
import useThemeStore from '@/stores/modules/theme'
const useTheme = useThemeStore()
const sideWidth = computed(() => useTheme.$state.sideWidth)
const layout = computed(() => useTheme.$state.layout)
const routes = useRoutesStore().routes
const route = useRoute()
const router = useRouter()

const menuOptions = ref(routes)

// todo 动态渲染菜单图标 缺陷：只能写死, 动态的显示不出来
function renderMenuIcon(option: any) {
  if (option.icon) {
    return h(NIcon, {
      class: `${option.icon}`
    })
  } else {
    return null
  }
}

const change = (key: any, item: any) => {
  router.push(key)
  useTheme.setTagData({
    tag: {
      ...item,
      close: true
    }
  })
}

const changeSide = () => {
  useTheme.setSideWidth({
    sideWidth: useTheme.sideWidth === 200 ? 90 : 200
  })
}
</script>

<style lang="scss" scoped>
.title {
  @apply text-18px font-700 color-[#71C9CE] cursor-pointer text-center my-10px flex flex-items-center justify-around;
}

.theme-block {
  @apply flex-center p-10px b-rd-5px;
  transition: all 0.3s;
  cursor: pointer;
  font-size: 20px;
  width: fit-content;
  margin-top: auto;

  &:hover {
    background-color: #ececed !important;
    transition: all 0.3s;

    i {
      color: #409eff;
      transition: all 0.3s;
    }
  }
}
</style>
