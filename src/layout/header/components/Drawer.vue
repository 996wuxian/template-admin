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
        <n-divider> 主题颜色 </n-divider>
        <div v-for="cs in colorSetting" :key="cs.label" class="step-block">
          {{ cs.label }}
          <component
            style="width: 120px"
            :is="cs.component"
            v-model:value="cs.color"
            @update:value="(value: any) => cs.handler(value)"
          />
        </div>
        <n-divider> 页面功能 </n-divider>
        <div v-for="setting in settings" :key="setting.label">
          <div class="step-block" v-if="!setting.hidden">
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
      </div>
      <div class="w-100% flex m-t-20px">
        <n-button type="primary" @click="initTheme">重置配置</n-button>
        <n-button type="primary" @click="copyTheme" class="m-l-auto">复制配置</n-button>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { ref, defineEmits, onMounted, defineProps } from 'vue'
import Layout from './layout.vue'
import { $msg } from '@/config/interaction.config'
import useThemeStore from '@/stores/modules/theme'
import { State } from '@/types/theme-state-type'
import { NInputNumber, NSwitch, NSelect, NColorPicker } from 'naive-ui'
import { getThemeOverrides } from '@/config/theme.config'
const themeOverrides = getThemeOverrides() // 在组件中调用
import useClipboard from 'vue-clipboard3'
const { toClipboard } = useClipboard()

const useTheme = useThemeStore()
const whether = computed(() => useTheme.whether)
const breadcrumb = computed(() => useTheme.breadcrumb)
const breadcrumbIcon = computed(() => useTheme.breadcrumbIcon)
const sideWidth = computed(() => useTheme.sideWidth)
const sideFoldWidth = computed(() => useTheme.sideFoldWidth)
const headerHeight = computed(() => useTheme.headerHeight)
const tag = computed(() => useTheme.tag)
const tagStyle = computed(() => useTheme.tagStyle)
const footer = computed(() => useTheme.footer)
const footerHeight = computed(() => useTheme.footerHeight)

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

  if (type === 'breadcrumb') {
    const data = settings.value.find((item) => item.type === 'breadcrumbIcon')
    data!.hidden = !data!.hidden
  }

  if (type === 'tag') {
    const data = settings.value.find((item) => item.type === 'tagStyle')
    data!.hidden = !data!.hidden
  }

  if (type === 'footer') {
    const data = settings.value.find((item) => item.type === 'footerHeight')
    data!.hidden = !data!.hidden
  }
}

const selectChange = (value: string, _type: keyof State, _text: string) => {
  useTheme.setTagStyle({ tagStyle: value })
}

const colorChange = (value: string) => {
  useTheme.setColor({ type: 'primaryColor', value: value })
  console.log('🚀 ~ colorChange ~ value:', value)
}

interface Settings {
  label?: string
  component?: any
  model?: any
  props?: any
  handler?: any
  type?: keyof State
  text?: string
  hidden?: boolean
}

const settings = ref<Settings[]>([
  {
    label: '侧边栏宽度',
    component: NInputNumber,
    model: sideWidth.value,
    props: { min: 90, max: 500, style: { width: '120px' } },
    handler: sizeChange,
    type: 'sideWidth',
    hidden: false
  },
  {
    label: '侧边栏折叠宽度',
    component: NInputNumber,
    model: sideFoldWidth.value,
    props: { min: 70, max: 120, style: { width: '120px' } },
    handler: sizeChange,
    type: 'sideFoldWidth',
    hidden: false
  },
  {
    label: '头部高度',
    component: NInputNumber,
    model: headerHeight.value,
    props: { min: 40, max: 100, style: { width: '120px' } },
    handler: sizeChange,
    type: 'headerHeight',
    hidden: false
  },
  {
    label: '显示天气',
    component: NSwitch,
    model: whether.value,
    props: {},
    handler: switchChange,
    type: 'whether',
    text: '天气',
    hidden: false
  },
  {
    label: '显示面包屑',
    component: NSwitch,
    model: breadcrumb.value,
    props: {},
    handler: switchChange,
    type: 'breadcrumb',
    text: '面包屑',
    hidden: false
  },
  {
    label: '显示面包屑图标',
    component: NSwitch,
    model: breadcrumbIcon.value,
    props: {},
    handler: switchChange,
    type: 'breadcrumbIcon',
    text: '面包屑图标',
    hidden: breadcrumb.value ? false : true
  },
  {
    label: '显示标签栏',
    component: NSwitch,
    model: tag.value,
    props: {},
    handler: switchChange,
    type: 'tag',
    text: '标签栏',
    hidden: false
  },
  {
    label: '标签栏风格',
    component: NSelect,
    model: tagStyle.value,
    props: { options, style: { width: '120px' } },
    handler: selectChange,
    type: 'tagStyle',
    text: '标签栏风格',
    hidden: tag.value ? false : true
  },
  {
    label: '显示底部',
    component: NSwitch,
    model: footer.value,
    props: {},
    handler: switchChange,
    type: 'footer',
    text: '底部',
    hidden: false
  },
  {
    label: '底部高度',
    component: NInputNumber,
    model: footerHeight.value,
    props: { min: 20, max: 150, style: { width: '120px' } },
    handler: sizeChange,
    type: 'footerHeight',
    hidden: footer.value ? false : true
  }
])

const colorSetting = ref([
  {
    label: '主色',
    color: themeOverrides.common?.primaryColor,
    component: NColorPicker,
    handler: colorChange
  },
  {
    label: '成功色',
    color: '#67C23A',
    component: NColorPicker,
    handler: colorChange
  },
  {
    label: '警告色',
    color: '#E6A23C',
    component: NColorPicker,
    handler: colorChange
  },
  {
    label: '错误色',
    color: '#F56C6C',
    component: NColorPicker,
    handler: colorChange
  },
  {
    label: '信息色',
    color: '#909399',
    component: NColorPicker,
    handler: colorChange
  }
])

watch(
  () => ({
    sideWidth: useTheme.sideWidth,
    sideFoldWidth: useTheme.sideFoldWidth,
    headerHeight: useTheme.headerHeight,
    footerHeight: useTheme.footerHeight
  }),
  (newValues) => {
    settings.value = settings.value.map((setting) => {
      switch (setting.type) {
        case 'sideWidth':
          setting.model = newValues.sideWidth
          break
        case 'sideFoldWidth':
          setting.model = newValues.sideFoldWidth
          break
        case 'headerHeight':
          setting.model = newValues.headerHeight
          break
        case 'footerHeight':
          setting.model = newValues.footerHeight
          break
      }
      return setting
    })
  }
)

const emit = defineEmits(['close'])

const closeDrawer = () => {
  emit('close')
}

const initTheme = () => {
  useTheme.initTheme()
}

const copyTheme = async () => {
  const data = {
    defaultTheme: useTheme.themeType,
    defaultThemeValue: useTheme.themeValue,
    defaultLayout: useTheme.layout,
    sideWidth: useTheme.sideWidth,
    sideFoldWidth: useTheme.sideFoldWidth,
    headerHeight: useTheme.headerHeight,
    whether: useTheme.whether,
    breadcrumb: useTheme.breadcrumb,
    breadcrumbIcon: useTheme.breadcrumbIcon,
    tag: useTheme.tag,
    tagStyle: useTheme.tagStyle,
    footer: useTheme.footer,
    footerHeight: useTheme.footerHeight
  }

  try {
    await toClipboard(JSON.stringify(data))
    $msg({
      type: 'success',
      msg: '复制成功, 请在代码config/setting.config.ts中粘贴修改'
    })
  } catch (e) {
    $msg({
      type: 'error',
      msg: '复制失败'
    })
  }
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
