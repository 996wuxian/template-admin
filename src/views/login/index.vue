<template>
  <div class="page">
    <n-form
      ref="$form"
      :label-width="50"
      :model="form"
      :rules="rules"
      label-placement="left"
      class="form"
    >
      <div class="flex pos-relative">
        <svg-icon name="start" :width="50" :height="50" class="m-b-20px m-l-auto m-r-auto" />
        <div class="theme" @click="changeTheme">
          <i i-solar-sun-fog-bold-duotone class="theme-icon" v-if="themeValue === 1" />
          <i i-solar-planet-2-bold-duotone class="theme-icon" v-if="themeValue === 2" />
          <i i-solar-moon-fog-bold-duotone class="theme-icon" v-if="themeValue === 3" />
        </div>
      </div>

      <n-form-item label="用户名 : " path="userName">
        <template #label>
          <i i-solar-user-bold-duotone class="inline-block w-25px h-25px color-[#71C9CE]" />
        </template>
        <n-input v-model:value="form.userName" placeholder="请输入" clearable />
      </n-form-item>
      <n-form-item label="密码 : " path="password">
        <template #label>
          <i
            i-solar-password-minimalistic-input-bold-duotone
            class="inline-block w-25px h-25px color-[#71C9CE]"
          />
        </template>
        <n-input
          v-model:value="form.password"
          placeholder="请输入"
          type="password"
          clearable
          show-password-on="click"
        />
      </n-form-item>
      <n-form-item>
        <n-button attr-type="button" type="primary" class="btn"> 登陆 </n-button>
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

const themeValue = ref(1)
const changeTheme = () => {
  if (themeValue.value > 2) {
    themeValue.value = 0
  }
  themeValue.value++
}
</script>

<style lang="scss" scoped>
.page {
  @apply w-100vw h-100vh bg-[#f0f5ff] flex-center;
}

.form {
  @apply bg-[#fff] px-20px pt-20px pb-0 b-rd-10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.btn {
  @apply w-100% mt-10px;
}

.theme {
  @apply absolute top-0 right-0 px-10px pt-10px pb-5px b-rd-5px;
  cursor: pointer;
  transition: all 0.3s;

  &-icon {
    @apply inline-block w-20px h-20px color-[#FDA736];
  }

  &:hover {
    background-color: #ececed;
    transition: all 0.3s;
  }
}
</style>
