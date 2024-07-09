<template>
  <el-drawer v-model="drawerShow" title="设置" direction="rtl" size="300px">
    <el-row :gutter="20" align="middle" style="padding-left: 10px">
      <el-row :gutter="20">
        <el-col :span="6">主题</el-col>
        <el-col :span="18">
          <el-select v-model="theme" size="small" @change="changeTheme">
            <el-option label="夜间" value="black" />
            <el-option label="白昼" value="white" />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="6">语言</el-col>
        <el-col :span="18">
          <el-select v-model="languages" size="small" @change="changeLanguage">
            <el-option label="中文简体" value="zh" />
            <el-option label="中文繁体" value="tc" />
            <el-option label="英文" value="en" />
          </el-select>
        </el-col>
      </el-row>
      <el-row :gutter="20" style="margin-top: 20px">
        <el-col :span="6">字号</el-col>
        <el-col :span="18">
          <el-select v-model="fontSize" size="small" @change="changeFontSize">
            <el-option label="小号" value="small" />
            <el-option label="默认" value="default" />
            <el-option label="大号" value="large" />
          </el-select>
        </el-col>
      </el-row>
    </el-row>
    <div style="margin-top: 20px">正在建设中...</div>
    <div class="changebox"></div>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
const { locale } = useI18n()

locale.value = Local.get('lang') || 'zh'

import useThemeStore from '@/stores/modules/theme'
const useTheme = useThemeStore()

import { useHeaderStore } from '../store/index'
import { Local } from '@/utils/storage'
const { drawerShow } = useHeaderStore()
// 主题
const theme = ref()
theme.value = useTheme.themeType

const changeTheme = () => {
  document.documentElement.setAttribute('data-theme', theme.value)
  useTheme.setTheme({ themeType: theme.value })
}

// 语言
const languages = ref(Local.get('lang') || 'zh')

const changeLanguage = () => {
  if (languages.value === 'zh') {
    Local.set('lang', 'zh')
    locale.value = languages.value
  } else if (languages.value === 'tc') {
    locale.value = 'tc'
    Local.set('lang', 'tc')
  } else if (languages.value === 'en') {
    locale.value = 'en'
    Local.set('lang', 'en')
  }
}

// 字号
const fontSize = ref()
fontSize.value = useTheme.fontSize

const changeFontSize = () => {
  document.documentElement.setAttribute('data-size', fontSize.value)
  useTheme.setFontSize({ fontSize: fontSize.value })
}
</script>

<style scoped lang="scss"></style>
