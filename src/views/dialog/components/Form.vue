<template>
  <n-form ref="user" :model="user" inline :label-width="80" style="width: 600px">
    <n-form-item
      :rule="{
        required: true,
        message: '请输入姓名',
        trigger: 'blur'
      }"
      label="姓名"
      path="user.name"
    >
      <n-input placeholder="输入姓名" />
    </n-form-item>
    <n-form-item label="年龄" path="user.age">
      <n-input placeholder="输入年龄" />
    </n-form-item>
    <n-form-item label="电话号码" path="phone">
      <n-input placeholder="电话号码" />
    </n-form-item>
    <n-form-item>
      <n-button attr-type="button"> 验证 </n-button>
    </n-form-item>
  </n-form>
</template>

<script setup lang="ts">
const user = {
  name: '',
  age: 0,
  phone: ''
}
</script>

<style scoped></style>
