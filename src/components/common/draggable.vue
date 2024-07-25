<template>
  <div class="block">
    <VueDraggable
      v-model="list"
      :animation="150"
      handle=".handle"
      class="flex flex-col gap-2 p-4 bg-gray-500/5 rounded w-100%"
      @start="onStart"
      @end="onEnd"
    >
      <div
        v-for="item in list"
        :key="item.id"
        class="h-50px bg-gray-500/5 rounded flex items-center px-4"
      >
        <i i-solar-tuning-2-bold class="handle cursor-move m-r-2.5"></i>

        <n-checkbox
          :value="item.id"
          :label="item.name"
          :checked="item.checked"
          @update:checked="(value: boolean) => changeChecked(value, item)"
        />
      </div>
    </VueDraggable>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { VueDraggable, DraggableEvent } from 'vue-draggable-plus'

interface List {
  id?: number
  name?: string
  checked?: boolean
}

const props = defineProps({
  list: { type: Array<List>, default: () => [] }
})

const list = ref(props.list)

const emit = defineEmits(['updateList', 'updateDrag'])
const changeChecked = (value: boolean, item: any) => {
  emit('updateList', { ...item, checked: value })
}

const onStart = (event: DraggableEvent) => {}

const onEnd = (event: DraggableEvent) => {
  emit('updateDrag', {
    item: event.data,
    start: event.oldDraggableIndex,
    end: event.newDraggableIndex
  })
}
</script>

<style lang="scss" scoped>
.block {
  max-height: 500px;
  overflow-y: auto;
}
</style>
