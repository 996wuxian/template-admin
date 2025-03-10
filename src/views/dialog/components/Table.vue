<template>
  <n-data-table :columns="columns" :data="data" :pagination="pagination" :bordered="false" />
</template>

<script setup lang="ts">
import type { DataTableColumns } from 'naive-ui'
import { NButton } from 'naive-ui'
import { h } from 'vue'
import { useDialogStore } from '../store'
const { openModal } = useDialogStore()

interface Song {
  no: number
  title: string
  length: string
}

const data: Song[] = [
  { no: 3, title: 'Wonderwall', length: '4:18' },
  { no: 4, title: "Don't Look Back in Anger", length: '4:48' },
  { no: 12, title: 'Champagne Supernova', length: '7:27' }
]

const columns: DataTableColumns<Song> = [
  {
    title: 'No',
    key: 'no'
  },
  {
    title: 'Title',
    key: 'title'
  },
  {
    title: 'Length',
    key: 'length'
  },
  {
    title: 'Action',
    key: 'actions',
    render(row) {
      return h(
        NButton,
        {
          strong: true,
          tertiary: true,
          size: 'small',
          onClick: () => play(row)
        },
        { default: () => 'Play' }
      )
    }
  }
]

const play = (row: Song) => {
  openModal({ type: 'Form', title: 'Play' })
}

const pagination = false as const
</script>
