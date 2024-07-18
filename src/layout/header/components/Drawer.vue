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
        <n-divider> 页面功能 </n-divider>
        <div v-for="setting in settings" :key="setting.label" class="step-block">
          {{ setting.label }}
          <component
            :is="setting.component"
            v-model:value="setting.model"
            placeholder=""
            v-bind="setting.props"
            @update:value="(value: any) => setting.handler(value, setting.type, setting?.text)"
          />
        </div>
      </div>
      <n-button>重置配置</n-button>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { ref, defineEmits, onMounted, defineProps } from 'vue'
import Layout from './layout.vue'
import { $msg } from '@/config/interaction.config'
import useThemeStore from '@/stores/modules/theme'
import { State } from '@/types/theme-state-type'
import { NInputNumber, NSwitch, NSelect } from 'naive-ui'

const useTheme = useThemeStore()
const whether = ref(useTheme.$state.whether)
const breadcrumb = ref(useTheme.$state.breadcrumb)
const breadcrumbIcon = ref(useTheme.$state.breadcrumbIcon)
const sideWidth = ref(useTheme.$state.sideWidth)
const sideFoldWidth = ref(useTheme.$state.sideFoldWidth)
const headerHeight = ref(useTheme.$state.headerHeight)
const tag = ref(useTheme.$state.tag)
const tagStyle = ref(useTheme.$state.tagStyle)
const footer = ref(useTheme.$state.footer)
const footerHeight = ref(useTheme.$state.footerHeight)

interface LayoutOption {
  id: number
  nav?: boolean
  side?: boolean
  header?: boolean
  aside?: boolean
  content?: boolean
  isActive: boolean
  tip: string
  name: string
}

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

const drawerShow = ref(props.drawerShow)

const layoutOption = ref<LayoutOption[]>([
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

const options = [
  {
    label: '按钮风格',
    value: 'button'
  },
  {
    label: '圆角风格',
    value: 'radio'
  }
]

const changeLayout = (item: any) => {
  layoutOption.value.forEach((v) => {
    v.isActive = false
  })
  item.isActive = true
  useTheme.setLayout({ layout: item.name })

  if (item.name === 'left_menu_mixin') {
    useTheme.setSize({ type: 'sideWidth', size: 90 })
  } else {
    useTheme.setSize({ type: 'sideWidth', size: 200 })
  }
}

const loadMessage = (value: boolean, text: string) => {
  let msg = value ? `已显示${text}` : `已隐藏${text}`
  $msg({
    type: 'success',
    msg
  })
}

// 对于某些处理器不需要使用到的参数（如_text），可以通过下划线前缀来标记它是未使用的，这是一种常见的TS做法。
const sizeChange = (value: number, type: keyof State, _text: string) => {
  useTheme.setSize({ type: type, size: value })
  if (type === 'sideWidth') {
    useTheme.setSize({ type: 'oldSideWidth', size: value })
  }
}

const switchChange = (value: boolean, type: keyof State, text: string) => {
  useTheme.setStatus({ type: type, bool: !useTheme.$state[type] })
  loadMessage(value, text)
}

const selectChange = (value: string, _type: keyof State, _text: string) => {
  useTheme.setTagStyle({ tagStyle: value })
}

// type HandlerType = (value: number | boolean | string, type: keyof State, text: string) => void;

interface Settings {
  label?: string
  component?: any
  model?: any
  props?: any
  handler?: any
  type?: keyof State
  text?: string
}

const settings = ref<Settings[]>([
  {
    label: '侧边栏宽度',
    component: NInputNumber,
    model: sideWidth,
    props: { min: 90, max: 500, style: { width: '120px' } },
    handler: sizeChange,
    type: 'sideWidth'
  },
  {
    label: '侧边栏折叠宽度',
    component: NInputNumber,
    model: sideFoldWidth,
    props: { min: 70, max: 120, style: { width: '120px' } },
    handler: sizeChange,
    type: 'sideFoldWidth'
  },
  {
    label: '头部高度',
    component: NInputNumber,
    model: headerHeight,
    props: { min: 40, max: 100, style: { width: '120px' } },
    handler: sizeChange,
    type: 'headerHeight'
  },
  {
    label: '显示天气',
    component: NSwitch,
    model: whether,
    props: {},
    handler: switchChange,
    type: 'whether',
    text: '天气'
  },
  {
    label: '显示面包屑',
    component: NSwitch,
    model: breadcrumb,
    props: {},
    handler: switchChange,
    type: 'breadcrumb',
    text: '面包屑'
  },
  {
    label: '显示面包屑图标',
    component: NSwitch,
    model: breadcrumbIcon,
    props: {},
    handler: switchChange,
    type: 'breadcrumbIcon',
    text: '面包屑图标'
  },
  {
    label: '显示标签栏',
    component: NSwitch,
    model: tag,
    props: {},
    handler: switchChange,
    type: 'tag',
    text: '标签栏'
  },
  {
    label: '标签栏风格',
    component: NSelect,
    model: tagStyle,
    props: { options, style: { width: '120px' } },
    handler: selectChange,
    type: 'tagStyle',
    text: '标签栏风格'
  },
  {
    label: '显示底部',
    component: NSwitch,
    model: footer,
    props: {},
    handler: switchChange,
    type: 'footer',
    text: '底部'
  },
  {
    label: '底部高度',
    component: NInputNumber,
    model: footerHeight,
    props: { min: 20, max: 150, style: { width: '120px' } },
    handler: sizeChange,
    type: 'footerHeight'
  }
])

const emit = defineEmits(['close'])

const closeDrawer = () => {
  emit('close')
}

onMounted(() => {
  const choose = useTheme.$state.layout

  layoutOption.value.forEach((v) => {
    if (v.name === choose) {
      v.isActive = true
    }
  })
})
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

.step-block {
  @apply flex items-center justify-between mb-10px;
}
</style>
