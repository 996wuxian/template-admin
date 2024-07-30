<template>
  <n-drawer v-model:show="drawerVisible" :width="300" placement="right">
    <n-drawer-content :title="userForm.id ? '编辑用户' : '新增用户'">
      <Form ref="$userForm" :form="userForm" :config="formConfig" :formOption="formOption" />
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
import { useUserStore } from '../store'
const { drawerVisible, $userForm, userForm, submit } = useUserStore()

const formOption = {
  inline: false, // 行内
  labelWidth: 80,
  size: 'medium',
  labelPlacement: 'top', // 标签位置
  disabled: false,
  labelAlign: 'left'
}

const formConfig = [
  f('用户名', 'userName', 'input', 24, '请输入').r().b(),
  f('性别', 'sex', 'select', 24, '请选择')
    .r('', ['blur', 'change'])
    .ops([
      { label: '不限', value: '0' },
      { label: '男', value: '1' },
      { label: '女', value: '2' }
    ])
    .b(),
  f('昵称', 'nickName', 'input', 24, '请输入').r().b(),
  f('手机号', 'phone', 'input', 24, '请输入').r().b(),
  f('邮箱', 'email', 'input', 24, '请输入').r().b(),
  f('用户状态', 'status', 'select', 24, '请选择')
    .r()
    .ops([
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' }
    ])
    .b(),
  f('用户角色', 'role', 'select', 24, '请选择')
    .r('', ['blur', 'change'], 'array')
    .ops([
      { label: '普通用户', value: '1' },
      { label: '管理员', value: '2' },
      { label: '超级管理员', value: '3' }
    ])
    .mult()
    .b()
]
</script>

<style lang="scss" scoped></style>
