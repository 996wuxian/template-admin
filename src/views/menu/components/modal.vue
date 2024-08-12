<template>
  <n-modal
    v-model:show="modalVisible"
    :mask-closable="false"
    preset="card"
    positive-text="确认"
    negative-text="取消"
    title="菜单管理"
    :bordered="false"
    class="w-800px"
    :segmented="
      {
        content: 'soft',
        footer: 'soft'
      } as const
    "
  >
    <Form ref="$roleForm" :form="roleForm" :config="formConfig" :formOption="formOption" />
    <template #footer>
      <div class="w-100% flex">
        <n-button type="default" class="m-l-auto"> 取消 </n-button>
        <n-button type="primary" class="m-l-10px"> 确认 </n-button>
      </div>
    </template>
  </n-modal>
</template>

<script lang="ts" setup>
import { useMenuStore } from '../store'
import Form from '@/components/common/tp-form.vue'
import { f } from '@/utils/form-cfg'
const { modalVisible, roleForm } = useMenuStore()

const formOption = {
  inline: false, // 行内
  labelWidth: 80,
  size: 'medium',
  labelPlacement: 'left', // 标签位置
  disabled: false,
  labelAlign: 'right',
  xgap: 20
}

const formConfig = [
  f('菜单类型', 'menuType', 'radio', 12, '请选择')
    .r()
    .ary([
      { label: '目录', value: '0' },
      { label: '菜单', value: '1' }
    ])
    .b(),
  f('菜单名称', 'title', 'input', 12, '请输入').r().b(),
  f('图标', 'icon', 'input', 12, '请输入').r().b(),
  f('路由名称', 'name', 'input', 12, '请输入').r().b(),
  f('路由路径', 'url', 'input', 12, '请输入').r().b(),
  f('菜单状态', 'status', 'select', 12, '请选择')
    .r()
    .ops([
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' }
    ])
    .b(),
  f('是否隐藏', 'hide', 'switch', 12, '请输入').r().b(),
  f('排序', 'sort', 'input', 12, '请输入').r().b()
]
</script>

<style lang="scss" scoped></style>
