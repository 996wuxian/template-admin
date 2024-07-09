<template>
  <div class="header">
    <el-row justify="space-between" align="middle" style="width: 100%">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item v-if="route.meta.father">{{ route.meta.father }}</el-breadcrumb-item>
        <el-breadcrumb-item>{{ route.meta.title }}</el-breadcrumb-item>
      </el-breadcrumb>
      <div style="display: flex; align-items: center">
        <el-icon><Sunny /></el-icon>{{ whetherData?.province }}-{{ whetherData?.city }}：{{
          whetherData?.temperature
        }}°
      </div>
      <div style="display: flex; align-items: center">
        <el-icon size="large" style="cursor: pointer" @click="fullscreen"><FullScreen /></el-icon>
        <el-dropdown trigger="click" style="cursor: pointer">
          <el-icon size="large" style="padding: 0 10px; cursor: pointer"><BellFilled /></el-icon>
          <template #dropdown>
            <div style="width: 300px; height: 200px">
              <el-empty image-size="70px" description="暂无消息" />
            </div>
          </template>
        </el-dropdown>
        <el-icon
          size="large"
          style="padding-right: 10px; cursor: pointer"
          @click="drawerShow = true"
          ><Setting
        /></el-icon>
        <div>
          <el-dropdown trigger="click" style="cursor: pointer">
            <span class="el-dropdown-link">
              {{ '管理员' }}<el-icon class="el-icon--right"><arrow-down /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item icon="UserFilled">个人中心</el-dropdown-item>
                <el-dropdown-item icon="Promotion" @click="loginOut">退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <el-avatar
          style="margin-left: 10px; cursor: pointer"
          src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"
        />
      </div>
    </el-row>
  </div>
  <Drawer />
</template>

<script setup lang="ts">
import Drawer from './components/Drawer.vue'
import { useRoute } from 'vue-router'
import { useHeaderStore } from './store/index'

const { whetherData, getWhether, fullscreen, drawerShow, loginOut } = useHeaderStore()

const route = useRoute()

getWhether()
</script>

<style scoped lang="scss">
.header {
  width: 100%;
  display: flex;
  height: 100%;
}
</style>
