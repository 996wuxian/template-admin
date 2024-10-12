<template>
  <n-card class="h-[calc(100vh-170px)]">
    startIndex: {{ startIndex }} <br />
    endIndex: {{ endIndex }} <br />
    scrollTop: {{ scrollTop }} <br />
    startOffset: {{ startOffset }}
    <div ref="container" class="w-full h-500px overflow-y-auto" @scroll="onScroll">
      <div :style="{ height: totalHeight + 'px' }">
        <div
          :style="{
            transform: `translateY(${startOffset}px)`,
            width: '100%'
          }"
          class="flex flex-col gap-10px"
        >
          <div
            v-for="item in visibleItems"
            :key="item.index"
            class="bg-#CCCCCC flex-center w-full"
            :style="{ height: `${itemHeight}px` }"
          >
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>

<script lang="ts" setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

const data = Array.from({ length: 100000 }, (_, i) => i)
const container = ref()
// 每个列表项的高度
const itemHeight = 30
// 缓冲区大小，用于预加载更多项
const bufferSize = 10

// 计算列表总高度
const totalHeight = computed(() => data.length * itemHeight)
// 可见项数量
const visibleCount = ref(0)
// 滚动位置
const scrollTop = ref(0)

// 计算可见项的起始索引
const startIndex = computed(() => Math.floor(scrollTop.value / itemHeight))
// 计算可见项的结束索引
const endIndex = computed(() => Math.min(startIndex.value + visibleCount.value, data.length))

// 计算当前可见的列表项
const visibleItems = computed(() => {
  return data
    .slice(Math.max(0, startIndex.value), endIndex.value + bufferSize)
    .map((value, index) => ({
      index: startIndex.value + index,
      value
    }))
})

// 计算列表项容器的起始偏移量
const startOffset = computed(() => startIndex.value * itemHeight)

// 计算可见项数量，根据容器高度和列表项高度
const calcVisibleCount = () => {
  if (container.value) {
    const containerHeight = container.value.clientHeight
    visibleCount.value = Math.ceil(containerHeight / itemHeight) + bufferSize
  }
}

const onScroll = () => {
  if (container.value) {
    scrollTop.value = container.value.scrollTop
  }
}

onMounted(() => {
  calcVisibleCount()
  window.addEventListener('resize', calcVisibleCount)
})

onUnmounted(() => {
  window.removeEventListener('resize', calcVisibleCount)
})
</script>
