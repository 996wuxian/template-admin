<template>
  <n-drawer
    v-model:show="drawerShow"
    :width="width"
    :placement="placement"
    close-on-esc
    mask-closable
    :trap-focus="false"
    @mask-click="closeDrawer"
    @esc="closeDrawer"
    @update:show="closeDrawer"
  >
    <n-drawer-content>
      <template #header>
        {{ title }}
      </template>
      <div class="flex flex-col">
        <n-divider> 主题模式 </n-divider>
        <div class="block">
          <ThemeToggler />
        </div>
        <n-divider> 布局模式 </n-divider>
        <div class="flex flex-wrap justify-between h-200px px-20px">
          <div v-for="item in layoutOption" :key="item.id" @click="changeLayout(item)">
            <Layout
              :nav="item?.nav"
              :side="item?.side"
              :header="item?.header"
              :aside="item?.aside"
              :content="item?.content"
              :is-active="item.isActive"
              :tip="item.tip"
            />
          </div>
        </div>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { ref, defineEmits } from 'vue'
import Layout from './layout.vue'
import useThemeStore from '@/stores/modules/theme'
const useTheme = useThemeStore()

const drawerShow = ref(false)

const props = defineProps({
  drawerShow: {
    type: Boolean,
    default: false
  },
  width: {
    type: Number,
    default: 360
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

drawerShow.value = props.drawerShow

const emit = defineEmits(['close'])

const closeDrawer = () => {
  emit('close')
}

const layoutOption = ref([
  {
    id: 0,
    side: true,
    header: true,
    content: true,
    isActive: false,
    tip: '左侧菜单模式',
    name: 'left_menu'
  },
  {
    id: 1,
    nav: true,
    side: true,
    header: true,
    content: true,
    isActive: false,
    tip: '左侧菜单混合模式',
    name: 'left_menu_mixin'
  },
  {
    id: 2,
    header: true,
    content: true,
    isActive: false,
    tip: '顶部菜单模式',
    name: 'top_menu'
  },
  {
    id: 3,
    header: true,
    aside: true,
    content: true,
    isActive: false,
    tip: '顶部菜单混合模式',
    name: 'top_menu_mixin'
  }
])

onMounted(() => {
  const choose = useTheme.$state.layout

  layoutOption.value.forEach((v) => {
    if (v.name === choose) {
      v.isActive = true
    }
  })
})

const changeLayout = (item: any) => {
  layoutOption.value.forEach((v) => {
    v.isActive = false
  })
  item.isActive = true
  useTheme.setLayout({ layout: item.name })

  if (item.name === 'left_menu_mixin') {
    useTheme.setSideWidth({ sideWidth: 90 })
  } else {
    useTheme.setSideWidth({ sideWidth: 200 })
  }
}
</script>

<style lang="scss" scoped>
.block {
  @apply flex-center p-10px b-rd-5px w-100%;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    background-color: #ececed !important;
    transition: all 0.3s;
  }
}
</style>
