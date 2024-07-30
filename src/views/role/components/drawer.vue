<template>
  <n-drawer v-model:show="drawerVisible" :width="300" placement="right">
    <n-drawer-content :title="roleForm.id ? '编辑角色' : '新增角色'">
      <Form ref="$roleForm" :form="roleForm" :config="formConfig" :formOption="formOption" />
      <template #footer>
        <n-button class="m-r-10px" @click="drawerVisible = false">取消</n-button>
        <n-button type="primary" @click="submit">确认</n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import Form from '@/components/common/tp-form.vue'
import { f } from '@/utils/form-cfg'
import { useRoleStore } from '../store'
const { drawerVisible, $roleForm, roleForm, submit } = useRoleStore()

const formOption = {
  inline: false, // 行内
  labelWidth: 80,
  size: 'medium',
  labelPlacement: 'top', // 标签位置
  disabled: false,
  labelAlign: 'left'
}

const formConfig = [
  f('角色名称', 'roleName', 'input', 24, '请输入').r().b(),
  f('角色编码', 'roleCode', 'input', 24, '请输入').r().b(),
  f('角色描述', 'roleDesc', 'input', 24, '请输入').r().b(),
  f('角色状态', 'status', 'select', 24, '请选择')
    .r()
    .ops([
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' }
    ])
    .b()
]
</script>

<style lang="scss" scoped></style>
