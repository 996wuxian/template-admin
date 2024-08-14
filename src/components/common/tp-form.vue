<template>
  <n-form
    style="width: 100%"
    ref="$formRef"
    :model="formData"
    :inline="formOption?.inline"
    :rules="rules"
    :label-width="formOption?.labelWidth"
    :size="formOption?.size"
    :label-placement="formOption?.labelPlacement"
    :disabled="formOption?.disabled"
    :label-align="formOption?.labelAlign"
  >
    <n-grid :x-gap="formOption?.xgap" :cols="24" style="width: 100%">
      <n-form-item-gi
        v-for="(item, index) in config"
        :key="index"
        :span="item.span ? item.span : 24"
        :label="item.label"
        :path="item.path"
        :rule="[
          {
            type: item.rType,
            required: item.required,
            message: item.message ? item.message : `${item.label}不能为空`,
            trigger: item.trigger
          }
        ]"
        :show-label="item.showLabel"
      >
        <component
          v-if="item.type !== 'radio'"
          :is="getComponent(item.type)"
          v-model:value="form[item.path]"
          :options="item.options"
          :placeholder="item.placeholder"
          :multiple="item.multiple"
          clearable
        />

        <n-radio-group v-else v-model:value="form[item.path]" name="radiogroup">
          <n-space>
            <n-radio v-for="song in item.arrays" :key="song.value" :value="song.value">
              {{ song.label }}
            </n-radio>
          </n-space>
        </n-radio-group>
      </n-form-item-gi>
      <n-form-item-gi v-if="formOption?.search" span="6" class="m-l-20px">
        <n-button type="default" @click="reset">
          <i i-solar-restart-circle-line-duotone class="w-20px h-20px m-r-5px"></i>
          重置</n-button
        >
        <n-button type="primary" class="m-l-20px" @click="search">
          <i i-solar-rounded-magnifer-bold-duotone class="w-20px h-20px m-r-5px"></i>
          查询</n-button
        >
      </n-form-item-gi>
    </n-grid>
  </n-form>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { NInput, NSelect, NSwitch, NButton, NCascader, NRadio } from 'naive-ui'
import type { FormInst } from 'naive-ui'

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
  multiple?: boolean
  rType?: string
  arrays?: Array<{ label: string; value: string | number }>
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

const $formRef = ref<FormInst>()

const formData = ref(props.form)

const getComponent = (type: string) => {
  switch (type) {
    case 'input':
      return NInput
    case 'select':
      return NSelect
    case 'switch':
      return NSwitch
    case 'cascader':
      return NCascader
    case 'radio':
      return NRadio
    default:
      return NInput
  }
}

const reset = () => {
  for (const key in formData.value) {
    if (Object.prototype.hasOwnProperty.call(formData.value, key)) {
      formData.value[key] = ''
    }
  }
  $formRef.value?.restoreValidation()
}

const search = (e: MouseEvent) => {
  e.preventDefault()
  $formRef.value?.validate((errors) => {
    if (!errors) {
      console.log('submit')
    } else {
      console.log(errors)
    }
  })
}

const validate = async () => {
  return await $formRef.value?.validate()
}

defineExpose({ validate })
</script>

<style lang="scss" scoped></style>
