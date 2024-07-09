<template>
  <template v-for="item in routerList" :key="item.path">
    <!-- 没有子集 -->
    <el-menu-item
      v-if="item?.meta?.hidden != '1'"
      :index="item.path"
      style="width: 100%; overflow: hidden"
      @click="toPage(item)"
    >
      <template #title>
        <el-icon>
          <component :is="iconMapping[item?.meta?.icon]" />
        </el-icon>
        <span style="width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{
          generateTitle(item?.meta?.title)
        }}</span>
      </template>
    </el-menu-item>
    <!-- 有子集 -->
    <el-sub-menu v-if="item.children && item.children.length" :index="item.path">
      <template #title>
        <el-icon>
          <component :is="iconMapping[item.meta.icon]" />
        </el-icon>
        <span style="width: 60px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap">{{
          generateTitle(item.meta.title)
        }}</span>
      </template>
      <Menu :router-list="item.children" />
    </el-sub-menu>
  </template>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

import { iconMapping } from '@/utils/iconMap'

import { generateTitle } from '@/utils/i18n'

defineProps({
  routerList: {
    type: Array<any>,
    default: () => []
  }
})

const router = useRouter()

const toPage = (item) => {
  router.push(item.path)
}
</script>
<!-- 需要有name才可以自己递归 -->
<script lang="ts">
export default {
  name: 'Menu'
}
</script>

<style scoped></style>
