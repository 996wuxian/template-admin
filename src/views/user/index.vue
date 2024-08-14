<template>
  <!-- 由于formItem的验证提示消息盒子占位缘故，所以需要手动设置padding -->
  <n-card content-style="padding: 25px 20px 5px 20px">
    <Form :form="form" :config="formConfig" :formOption="formOption" />
  </n-card>
  <n-card class="m-t-10px card">
    <n-space justify="space-between" class="m-b-10px">
      <div class="text-16px">用户列表</div>
      <n-space>
        <n-button ghost @click="showEdit({})">
          <i i-solar-add-square-bold-duotone class="w-20px h-20px m-r-5px"></i>
          新增</n-button
        ><n-button :disabled="checkedData.length === 0">
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
      v-if="tableData"
      class="table"
      :columns="columns"
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      :row-key="rowKey"
      @update:checked-row-keys="handleCheck"
    />
  </n-card>

  <Drawer />
</template>

<script lang="ts" setup>
import { ref, withDirectives } from 'vue'
import Form from '@/components/common/tp-form.vue'
import { f } from '@/utils/form-cfg'
import { t } from '@/utils/table-cfg'
import { NButton, NTag, NPopconfirm, DataTableRowKey } from 'naive-ui'
import Draggable from '@/components/common/draggable.vue'
import Drawer from './components/drawer.vue'
import { useUserStore } from './store'
const { form, showEdit, queryData, tableData, loading, reload } = useUserStore()
import { vPer } from '@/directive/v-per'

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
  f('用户名', 'userName', 'input', 6, '请输入').r().b(),
  f('性别', 'sex', 'select', 6, '请选择')
    .r('', ['blur', 'change'])
    .ops([
      { label: '不限', value: '0' },
      { label: '男', value: '1' },
      { label: '女', value: '2' }
    ])
    .b(),
  f('昵称', 'nickName', 'input', 6, '请输入').r().b(),
  f('手机号', 'phone', 'input', 6, '请输入').r().b(),
  f('邮箱', 'email', 'input', 6, '请输入').r().b(),
  f('用户状态', 'status', 'select', 6, '请选择')
    .r()
    .ops([
      { label: '启用', value: '1' },
      { label: '禁用', value: '0' }
    ])
    .b()
]

const columns = ref([
  t('勾选').c().b(),
  t('序号', 'id').b(),
  t('用户名', 'userName').b(),
  t('性别', 'sex')
    .r((row) =>
      h(
        NTag,
        {
          type: row.sex === '1' ? 'success' : 'primary',
          bordered: false
        },
        { default: () => (row.sex === '1' ? '男' : '女') }
      )
    )
    .b(),
  t('昵称', 'nickName').b(),
  t('手机号', 'phone').b(),
  t('邮箱', 'email').b(),
  t('用户状态', 'status')
    .r((row) =>
      h(
        NTag,
        {
          type: row.status === '1' ? 'success' : 'error',
          bordered: false
        },
        { default: () => (row.status === '1' ? '启用' : '禁用') }
      )
    )
    .b(),
  t('操作')
    .f('right', 130)
    .r((row) => [
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
            withDirectives(
              h(
                NButton,
                {
                  size: 'small',
                  type: 'error',
                  ghost: true
                },
                { default: () => '删除' }
              ),
              [[vPer, '']]
            ),

          default: () => '确定删除吗？'
        }
      )
    ])
    .b()
])

const columnsCopy = ref(columns.value)

const pagination = {
  pageSize: 8
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

const deleteRow = (row: any) => {}

const rowKey = (row: any) => row.id

const checkedData = ref<DataTableRowKey[]>([])
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedData.value = rowKeys
}

onBeforeMount(() => {
  queryData()
})
</script>

<style lang="scss" scoped>
.card {
  height: calc(100% - 158px);
}
.table {
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
@/utils/form-cfg @/directive/v-per
