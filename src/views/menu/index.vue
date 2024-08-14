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
      :data="tableData"
      :pagination="pagination"
      :loading="loading"
      :row-key="rowKey"
      @update:checked-row-keys="handleCheck"
    />
  </n-card>

  <Modal />
</template>

<script lang="ts" setup>
import { ref, h } from 'vue'
import { t } from '@/utils/table-cfg'
import { NButton, NTag, NPopconfirm, DataTableRowKey } from 'naive-ui'
import Draggable from '@/components/common/draggable.vue'
import Modal from './components/modal.vue'
import { useMenuStore } from './store'
const { showEdit, queryData, tableData, loading, reload } = useMenuStore()

const columns = ref([
  t('勾选').c().b(),
  t('ID', 'id').f('left', 100).b(),
  t('菜单类型', 'menuType')
    .f('left', 100)
    .r((row) =>
      h(
        NTag,
        {
          type: row.menuType === '1' ? 'success' : 'default',
          bordered: false
        },
        { default: () => (row.menuType === '1' ? '菜单' : '目录') }
      )
    )
    .b(),
  t('菜单名称', 'title').b(),
  t('图标', 'icon', 'center', 100)
    .r((row) =>
      h(
        'div',
        {
          class: `${row.icon} w-100% flex-center text-20px`
          // style: 'font-size: 20px; width: 100%; text-align: center'
        },
        { default: () => row.icon }
      )
    )
    .b(),
  t('路由地址', 'path').f('left', 200).b(),
  t('路由名称', 'name').b(),
  t('路由路径', 'url').f('left', 200).b(),
  t('菜单状态', 'status')
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
  t('是否隐藏', 'hide')
    .r((row) =>
      h(
        NTag,
        {
          type: row.hide === '0' ? 'success' : 'default',
          bordered: false
        },
        { default: () => (row.hide === '0' ? '否' : '是') }
      )
    )
    .b(),
  t('父级菜单ID', 'parentId').b(),
  t('排序', 'sort').b(),
  t('操作', '', 'right')
    .f('right', 230)
    .r((row) => [
      row.children && row.children.length > 0
        ? h(
            NButton,
            {
              size: 'small',
              type: 'primary',
              ghost: true,
              style: { marginRight: '10px' },
              onClick: () => showEdit(row)
            },
            { default: () => '新增子菜单' }
          )
        : null,
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
  pageSize: 10
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
  height: 100%;
}
.table {
  height: calc(100% - 50px);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
