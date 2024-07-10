<template>
  <svg aria-hidden="true" :width="width" :height="height">
    <use :xlink:href="symbolId" :fill="fill" />
  </svg>
</template>

<!-- SvgIcon组件，可将svg图标直接当组件使用 -->
<script setup lang="ts">
import { computed } from 'vue'

/**
 * 输入属性             类型                默认值              是否必选                描述
 *  name              string             undefined              是                  svg图标名字
 *  width             number                19                  否                  svg图标宽度
 *  height            number                19                  否                  svg图标高度
 *  fill              string              #ffffff               否                  svg图标填充颜色
 */
const props = withDefaults(
  defineProps<{
    name: string
    width?: number
    height?: number
    fill?: string
  }>(),
  {
    width: 19,
    height: 19,
    fill: '#333333'
  }
)

// 获取svg图标名称，需要和vite.config.ts中的配置保持一致
const symbolId = computed(() => `#${props.name}`)
</script>

<style scoped lang="scss"></style>
