<template>
  <n-form
    ref="$formRef"
    :model="form"
    :inline="formOption?.inline"
    :rules="rules"
    :label-width="formOption?.labelWidth"
    :size="formOption?.size"
    :label-placement="formOption?.labelPlacement"
    :disabled="formOption?.disabled"
    :label-align="formOption?.labelAlign"
  >
    <n-grid :x-gap="formOption?.xgap" :cols="24">
      <n-form-item-gi
        v-for="(item, index) in config"
        :key="index"
        :span="item.span ? item.span : 24"
        :label="item.label"
        :path="item.path"
        :rule="[
          {
            required: item.required,
            message: item.message ? item.message : `${item.label}不能为空`,
            trigger: item.trigger || ['blur', 'input']
          }
        ]"
        :show-label="item.showLabel"
      >
        <component
          :is="getComponent(item.type)"
          v-model:value="form[item.path]"
          :options="item.options"
          :placeholder="item.placeholder"
          clearable
        />
      </n-form-item-gi>
      <n-form-item-gi v-if="formOption?.search" span="6" class="m-l-20px">
        <n-button type="default">
          <i i-solar-restart-circle-line-duotone class="w-20px h-20px m-r-5px"></i>
          重置</n-button
        >
        <n-button type="primary" class="m-l-20px">
          <i i-solar-rounded-magnifer-bold-duotone class="w-20px h-20px m-r-5px"></i>
          查询</n-button
        >
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NInput, NSelect, NSwitch, NButton } from 'naive-ui'
import type { FormInst } from 'naive-ui'

const $formRef = ref<FormInst>()

interface Config {
  label: string
  path: string
  type: string
  span?: number
  placeholder?: string
  showLabel?: boolean
  required?: boolean
  message?: string
  trigger?: Array<string>
  options?: Array<{ label: string; value: string | number }>
}

interface Options {
  inline?: boolean
  labelWidth?: number
  size?: string // small | medium | large
  labelPlacement?: string // left | top
  disabled?: boolean
  operate?: boolean
  operateText?: string
  xgap?: number
  labelAlign?: string
  search?: boolean
}

const props = defineProps<{
  config: Array<Config>
  form: Record<string, any>
  rules?: Record<string, any>
  formOption?: Options
}>()

console.log(props, 'props')

const getComponent = (type: string) => {
  switch (type) {
    case 'input':
      return NInput
    case 'select':
      return NSelect
    case 'switch':
      return NSwitch
    default:
      return NInput
  }
}

const handleValidateClick = (e: MouseEvent) => {
  e.preventDefault()
  $formRef.value?.validate((errors) => {
    if (!errors) {
      console.log('submit')
    } else {
      console.log(errors)
    }
  })
}
</script>

<style lang="scss" scoped></style>
