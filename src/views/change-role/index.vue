<template>
  <n-card
    title="切换权限"
    :segmented="{
      content: true,
      footer: 'soft'
    }"
  >
    <n-table striped>
      <thead>
        <tr>
          <th>用户角色</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{{ userInfo.roleName }}</td>
        </tr>
        <tr>
          <td>切换账号</td>
        </tr>
        <tr>
          <td>
            <n-button :loading="loading" @click="changeRole('super')">超级管理员</n-button>
            <n-button :loading="loading" class="mx-10px" @click="changeRole('admin')"
              >管理员</n-button
            >
            <n-button :loading="loading" @click="changeRole('user')">普通用户</n-button>
          </td>
        </tr>
        <tr>
          <td>v-per按钮权限（超级管理员和管理员可见，普通用户不可见）</td>
        </tr>
        <tr>
          <td>
            <n-button type="default" v-per>删除</n-button>
          </td>
        </tr>
      </tbody>
    </n-table>
  </n-card>
</template>

<script lang="ts" setup>
import useUserStore from '@/stores/modules/user'
const userStore = useUserStore()
const userInfo = computed(() => userStore.userInfo)

const loading = ref(false)
const changeRole = (role: String) => {
  loading.value = true
  let userInfo = {} as any
  if (role === 'super') {
    userInfo = {
      roleName: '超级管理员',
      roleId: 1,
      userName: 'sadmin'
    }
  } else if (role === 'admin') {
    userInfo = {
      roleName: '管理员',
      roleId: 2,
      userName: 'admin'
    }
  } else {
    userInfo = {
      roleName: '普通用户',
      roleId: 3,
      userName: 'user'
    }
  }
  setTimeout(() => {
    loading.value = false
    userStore.setUserInfo({ userInfo: userInfo })
    window.location.reload()
  }, 1500)
}
</script>

<style lang="scss" scoped></style>
