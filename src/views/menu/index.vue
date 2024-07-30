<template>
  <n-card class="card">
    <n-space justify="space-between" class="m-b-10px">
      <div class="text-16px">菜单列表</div>
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
import { f } from '@/utils/form-cfg'
import { t } from '@/utils/table-cfg'
import { NButton, NTag, NPopconfirm, DataTableRowKey } from 'naive-ui'
import Draggable from '@/components/common/draggable.vue'
import Drawer from './components/drawer.vue'
import { useRoleStore } from './store'
const { form, showEdit, data, loading, reload } = useRoleStore()

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
  f('角色名称', 'roleName', 'input', 6, '请输入').r().b(),
  f('角色编码', 'roleCode', 'input', 6, '请输入').r().b(),
  f('角色状态', 'status', 'select', 6, '请选择')
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
  t('角色名称', 'roleName').b(),
  t('角色编码', 'roleCode').b(),
  t('角色描述', 'roleDesc').b(),
  t('角色状态', 'status')
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
    ])
    .b()
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

const deleteRow = (row: any) => {}

const rowKey = (row: any) => row.id

const checkedData = ref<DataTableRowKey[]>([])
const handleCheck = (rowKeys: DataTableRowKey[]) => {
  checkedData.value = rowKeys
  console.log('🚀 ~ handleCheck ~ rowKeys:', rowKeys)
}
</script>

<style lang="scss" scoped>
.card {
  height: 100%;
}
.table {
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
