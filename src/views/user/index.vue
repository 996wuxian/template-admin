<template>
  <!-- 由于formItem的验证提示消息盒子占位缘故，所以需要手动设置padding -->
  <n-card content-style="padding: 25px 20px 5px 20px">
    <Form :form="form" :config="formConfig" :formOption="formOption" />
  </n-card>
  <n-card class="m-t-10px">
    <n-space justify="space-between" class="m-b-10px">
      <div class="text-16px">用户列表</div>
      <n-space>
        <n-button ghost>
          <i i-solar-add-square-bold-duotone class="w-20px h-20px m-r-5px"></i>
          新增</n-button
        ><n-button>
          <i i-solar-trash-bin-minimalistic-bold-duotone class="w-20px h-20px m-r-5px"></i>
          批量删除</n-button
        ><n-button>
          <i i-solar-restart-circle-line-duotone class="w-20px h-20px m-r-5px"></i>
          刷新</n-button
        ><n-button>
          <i i-solar-tuning-square-bold-duotone class="w-20px h-20px m-r-5px"></i>
          列设置</n-button
        >
      </n-space>
    </n-space>
    <n-data-table :columns="columns" :data="data" :pagination="pagination" />
  </n-card>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Form from '@/components/common/tp-form.vue'
import _ from '@/utils/core'
import { NButton, NTag } from 'naive-ui'

const form = ref({
  userName: '',
  sex: null,
  nickName: '',
  phone: '',
  email: '',
  status: ''
})

const formOption = {
  inline: false, // 行内
  labelWidth: 80,
  size: 'medium',
  labelPlacement: 'left', // 标签位置
  disabled: false,
  operate: true,
  operateText: '搜索',
  xgap: 20,
  labelAlign: 'right',
  search: true
}

const formConfig = [
  _.f('用户名', 'userName', 'input', 6, '请输入').r().b(),
  _.f('性别', 'sex', 'select', 6, '请选择')
    .r()
    .ops([
      { label: '不限', value: 0 },
      { label: '男', value: 1 },
      { label: '女', value: 2 }
    ])
    .b(),
  _.f('昵称', 'nickName', 'input', 6, '请输入').r().b(),
  _.f('手机号', 'phone', 'input', 6, '请输入').r().b(),
  _.f('邮箱', 'email', 'input', 6, '请输入').r().b(),
  _.f('用户状态', 'status', 'select', 6, '请选择')
    .r()
    .ops([
      { label: '启用', value: 1 },
      { label: '禁用', value: 0 }
    ])
    .b()
]

const data = ref([
  {
    id: 1,
    userName: 'qwer',
    sex: '男',
    nickName: 'overa',
    phone: '1351231231',
    email: 'aowbnao@gmail.com',
    status: '启用'
  },
  {
    id: 2,
    userName: 'dala',
    sex: '女',
    nickName: 'eosao',
    phone: '1351231231',
    email: 'aowbnao@gmail.com',
    status: '禁用'
  }
])

const columns = [
  {
    type: 'selection'
  },
  {
    title: '序号',
    key: 'id',
    align: 'center'
  },
  {
    title: '用户名',
    key: 'userName',
    align: 'center'
  },
  {
    title: '性别',
    key: 'sex',
    align: 'center',
    render(row: any) {
      return h(
        NTag,
        {
          type: row.sex === '男' ? 'success' : 'primary',
          bordered: false
        },
        {
          default: () => row.sex
        }
      )
    }
  },
  {
    title: '昵称',
    key: 'nickName',
    align: 'center'
  },
  {
    title: '手机号',
    key: 'phone',
    align: 'center'
  },
  {
    title: '邮箱',
    key: 'email',
    align: 'center'
  },
  {
    title: '用户状态',
    key: 'status',
    align: 'center',
    render(row: any) {
      return h(
        NTag,
        {
          type: row.status === '启用' ? 'success' : 'error',
          bordered: false
        },
        {
          default: () => row.status
        }
      )
    }
  },
  {
    title: '操作',
    key: 'actions',
    align: 'center',
    fixed: 'right',
    width: 130,
    render(row: any) {
      return [
        h(
          NButton,
          {
            size: 'small',
            type: 'primary',
            ghost: true,
            style: { marginRight: '10px' },
            onClick: () => sendMail(row)
          },
          { default: () => '编辑' }
        ),
        h(
          NButton,
          {
            size: 'small',
            type: 'error',
            ghost: true,
            onClick: () => sendMail(row)
          },
          { default: () => '删除' }
        )
      ]
    }
  }
]

const pagination = {
  pageSize: data.value.length
}

const sendMail = (row) => {}
</script>

<style lang="scss" scoped></style>
