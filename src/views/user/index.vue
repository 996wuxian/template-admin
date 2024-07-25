<template>
  <!-- 由于formItem的验证提示消息盒子占位缘故，所以需要手动设置padding -->
  <n-card content-style="padding: 25px 20px 5px 20px">
    <Form :form="form" :config="formConfig" :formOption="formOption" />
  </n-card>
  <n-card class="m-t-10px card">
    <n-space justify="space-between" class="m-b-10px">
      <div class="text-16px">用户列表</div>
      <n-space>
        <n-button ghost>
          <i i-solar-add-square-bold-duotone class="w-20px h-20px m-r-5px"></i>
          新增</n-button
        ><n-button>
          <i i-solar-trash-bin-minimalistic-bold-duotone class="w-20px h-20px m-r-5px"></i>
          批量删除</n-button
        ><n-button @click="reload">
          <i i-solar-restart-circle-line-duotone class="w-20px h-20px m-r-5px"></i>
          刷新</n-button
        >
        <n-popselect :options="[]" trigger="click">
          <n-button>
            <i i-solar-tuning-square-bold-duotone class="w-20px h-20px m-r-5px"></i>
            列设置</n-button
          >
          <template #empty> 拖拽排序 </template>
          <template #action>
            <Draggable :list="list" @update-list="updateList" @update-drag="updateDrag" />
          </template>
        </n-popselect>
      </n-space>
    </n-space>
    <n-data-table
      class="table"
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :loading="loading"
      :row-key="rowKey"
      @update:checked-row-keys="handleCheck"
    />
  </n-card>

  <Drawer />
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import Form from '@/components/common/tp-form.vue'
import _ from '@/utils/core'
import { NButton, NTag, NPopconfirm, DataTableRowKey } from 'naive-ui'
import Draggable from '@/components/common/draggable.vue'
import Drawer from './components/drawer.vue'
import { useUserStore } from './store'
const { form, showEdit } = useUserStore()

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

const columns = ref([
  {
    type: 'selection',
    title: '勾选'
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
            onClick: () => showEdit(row)
          },
          { default: () => '编辑' }
        ),
        h(
          NPopconfirm,
          {
            positiveText: '确认',
            negativeText: '取消',
            onPositiveClick: () => deleteRow(row) // 确认删除的操作
          },
          {
            trigger: () =>
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  ghost: true
                },
                { default: () => '删除' }
              ),
            default: () => '确定删除吗？'
          }
        )
      ]
    }
  }
])
const columnsCopy = ref(columns.value)

const pagination = {
  pageSize: data.value.length
}

const list = ref()
list.value = columns.value
  .map((item, index) => {
    return {
      id: index,
      name: item.title,
      checked: true
    }
  })
  .filter((item) => item.name !== undefined)
const updateList = (value: any) => {
  const item = list.value.find((item: any) => item.id === value.id)
  if (item) {
    item.checked = value.checked
  }
  if (!item.checked) {
    columns.value = columns.value.filter((item) => item.title !== value.name)
  } else {
    const index = columnsCopy.value.findIndex((item) => item.title === value.name)
    columns.value.splice(index, 0, columnsCopy.value[index])
  }
}
const updateDrag = (value: any) => {
  const start = value.start
  const end = value.end

  // 更新 list.value 的顺序
  const draggedItem = list.value.splice(start, 1)[0]

  list.value.splice(end, 0, draggedItem)

  columns.value = [
    ...list.value
      .map((item: any) => {
        const column = columnsCopy.value.find((column: any) => column.title === item.name)
        return column ? { ...column, checked: item.checked } : null
      })
      .filter((item: any) => item.checked)
  ]
}

const deleteRow = (row) => {}
const loading = ref(false)
const reload = () => {
  loading.value = true
  setTimeout(() => {
    loading.value = false
  }, 2000)
}

const rowKey = (row) => row.id
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  console.log('🚀 ~ handleCheck ~ rowKeys:', rowKeys)
}
</script>

<style lang="scss" scoped>
.card {
  height: calc(100% - 160px);
}
.table {
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
