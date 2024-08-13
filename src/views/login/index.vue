<template>
  <div class="page theme-option">
    <n-form
      ref="$form"
      :label-width="50"
      :model="form"
      :rules="rules"
      label-placement="left"
      class="form theme-box"
    >
      <div class="flex pos-relative">
        <svg-icon name="start" :width="50" :height="50" class="m-b-20px m-l-auto m-r-auto" />
        <div class="theme">
          <ThemeToggler />
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
            i-solar-key-minimalistic-bold-duotone
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
        <n-button attr-type="button" type="primary" class="btn" @click="login"> 登陆 </n-button>
      </n-form-item>
    </n-form>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import ThemeToggler from '@/components/custom/theme-toggler.vue'
import { Login } from '@/service/api/mock-api'
import { Session } from '@/utils/storage'
import useUserStore from '@/stores/modules/user'
const message = useMessage()
const router = useRouter()
const userStore = useUserStore()

const $form = ref()
const form = ref<any>({
  userName: 'admin',
  password: '123456'
})

const rules = {
  userName: {
    required: true,
    message: '请输入用户名',
    trigger: 'blur'
  },
  password: {
    required: true,
    message: '请输入密码',
    trigger: ['blur']
  }
}

const login = () => {
  $form.value.validate(async (valid: boolean) => {
    if (!valid) {
      const { data } = await Login(form.value)
      Session.set('token', data.token)
      userStore.setUserInfo({ userInfo: data.userInfo })
      router.push('/home')
    } else {
      message.error('请输入账号密码')
    }
  })
}
</script>

<style lang="scss" scoped>
.page {
  @apply w-100vw h-100vh  flex-center;
}

.form {
  @apply bg-[#fff] px-20px pt-20px pb-0 b-rd-10px;
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
}

.btn {
  @apply w-100% mt-10px;
}

.theme {
  @apply absolute top-0 right-0 p-10px b-rd-5px;
  cursor: pointer;
  transition: all 0.3s;

  &:hover {
    background-color: #ececed;
    transition: all 0.3s;
  }
}
</style>
