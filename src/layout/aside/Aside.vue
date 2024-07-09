<template>
  <div class="aside">
    <div class="fl-j-a-w" style="width: 90%">
      <img
        style="width: 50px"
        :src="
          usetheme.themeType === 'black'
            ? `/src/assets/images/home-logo.png`
            : `/src/assets/images/home-logo1.png`
        "
        alt=""
      />
      <el-scrollbar class="scrollbar" style="width: 100%">
        <el-menu
          :active-text-color="usetheme.themeType === 'black' ? '#ffd04b' : '#80a596'"
          class="el-menu-vertical-demo"
          :background-color="usetheme.themeType === 'black' ? '#010103' : '#e9ecef'"
          :text-color="usetheme.themeType === 'black' ? '#fff' : '#010103'"
          :default-active="route.path"
        >
          <Menu :router-list="routerList" />
        </el-menu>
      </el-scrollbar>
    </div>

    <div>
      <img
        style="width: 50px"
        :src="
          usetheme.themeType === 'black'
            ? `/src/assets/images/home-logo.png`
            : `/src/assets/images/home-logo1.png`
        "
        alt=""
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import Menu from './components/Menu.vue'
import { useRoute } from 'vue-router'
const route = useRoute()

import usethemeStore from '@/stores/modules/theme'
const usetheme = usethemeStore()

import useRoutesStore from '@/stores/modules/routes'
const useRoutes = useRoutesStore()

const routerList = ref([])
routerList.value = useRoutes.routes
</script>

<style scoped lang="scss">
@import '@/assets/scss/global.scss';

.aside {
  width: 100%;
  height: 100%;
  min-height: 300px;
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  overflow: auto;
  .aside-logo {
    width: 100%;
    height: 100px;
    .aside-logo-img {
      width: 100%;
      height: 100%;
    }
  }
}

:deep() {
  .el-menu-item {
    border-radius: 10px;
  }

  .el-menu-item.is-active {
    background-color: #80a596;
    color: #fff;
  }

  .el-menu-item:hover {
    background-color: #80a596;
    color: #ffd04b;
  }
  .el-sub-menu__title {
    border-radius: 10px;
  }
  .el-sub-menu__title:hover {
    background-color: #80a596;
    color: #ffd04b;
  }
  .el-menu-vertical-demo {
    border: none;
    width: 100%;
  }
}
</style>
