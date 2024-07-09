<template>
  <div class="page">
    <n-form
      ref="$form"
      :label-width="80"
      :model="form"
      :rules="rules"
      label-placement="left"
      class="form"
    >
      <n-form-item label="用户名 : " path="userName">
        <n-input v-model:value="form.userName" placeholder="请输入" />
      </n-form-item>
      <n-form-item label="密码 : " path="password">
        <n-input v-model:value="form.password" placeholder="请输入" />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" class="w-100% mt-10px"> 登陆 </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

const $form = ref()
const form = ref<any>({})

const rules = {
  userName: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['input', 'blur']
  }
}
</script>

<style lang="scss" scoped>
.page {
  @apply w-100vw h-100vh bg-[#f0f5ff] flex-center;
}

.form {
  @apply bg-[#fff] px-20px pt-20px pb-0 b-rd-10px;
}
</style>
