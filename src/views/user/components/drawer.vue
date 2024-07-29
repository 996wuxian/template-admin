<template>
  <n-drawer v-model:show="drawerVisible" :width="300" placement="right">
    <n-drawer-content title="编辑用户">
      <n-form ref="formRef" :model="userForm">
        <n-form-item
          path="userName"
          label="用户名"
          :rule="[
            {
              required: true,
              message: '用户名不能为空',
              trigger: ['blur', 'input']
            }
          ]"
        >
          <n-input v-model:value="userForm.userName" placeholder="请输入" clearable />
        </n-form-item>
        <n-form-item path="sex" label="性别">
          <n-radio-group v-model:value="userForm.sex" name="radiogroup">
            <n-space>
              <n-radio v-for="song in sexs" :key="song.value" :value="song.value">
                {{ song.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item path="nickName" label="昵称">
          <n-input v-model:value="userForm.nickName" placeholder="请输入" clearable />
        </n-form-item>
        <n-form-item path="phone" label="手机号">
          <n-input v-model:value="userForm.phone" placeholder="请输入" clearable />
        </n-form-item>
        <n-form-item path="email" label="邮箱">
          <n-input v-model:value="userForm.email" placeholder="请输入" clearable />
        </n-form-item>
        <n-form-item path="status" label="用户状态">
          <n-radio-group v-model:value="userForm.status" name="radiogroup">
            <n-space>
              <n-radio v-for="song in status" :key="song.value" :value="song.value">
                {{ song.label }}
              </n-radio>
            </n-space>
          </n-radio-group>
        </n-form-item>
        <n-form-item path="role" label="用户角色">
          <n-select
            v-model:value="userForm.role"
            multiple
            :options="options"
            placeholder="请选择"
            clearable
          />
        </n-form-item>
      </n-form>
    </n-drawer-content>
  </n-drawer>
</template>

<script lang="ts" setup>
import { useUserStore } from '../store'
const { drawerVisible, userForm } = useUserStore()

const sexs = [
  { label: '男', value: 1 },
  { label: '女', value: 2 }
]

const status = [
  { label: '启用', value: 1 },
  { label: '禁用', value: 2 }
]

const options = [
  {
    label: '普通用户',
    value: 1
  },
  {
    label: '管理员',
    value: 2
  },
  {
    label: '超级管理员',
    value: 3
  }
]
</script>

<style lang="scss" scoped></style>
