<template>
  <n-card>
    <n-upload multiple directory-dnd :default-upload="false" :max="100" @change="handleChange">
      <n-upload-dragger>
        <div style="margin-bottom: 12px" class="flex justify-center">
          <i i-solar-download-outline class="w-30px h-30px color-#666"></i>
        </div>
        <n-text style="font-size: 16px"> 点击或者拖动文件到该区域来上传 </n-text>
        <n-p depth="3" style="margin: 8px 0 0 0">
          请不要上传敏感数据，比如你的银行卡号和密码，信用卡号有效期和安全码
        </n-p>
      </n-upload-dragger>
    </n-upload>

    <div v-for="[taskId, task] in Array.from(uploadInfo.tasks)" :key="taskId" class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <span>{{ task.fileName }}</span>
        <div v-if="!task.isCompleted">
          <n-button v-if="!task.isPaused" size="small" @click="pauseUpload(taskId)">暂停</n-button>
          <n-button v-else size="small" type="primary" @click="resumeUpload(taskId)">继续</n-button>
        </div>
      </div>
      <n-progress
        :percentage="task.progress"
        :processing="!task.isPaused && !task.isCompleted"
        :status="task.isCompleted ? 'success' : 'default'"
      />
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SparkMD5 from 'spark-md5'

// const chunkSize = 1024 * 1024 // 1MB
const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiaWQiOjEsInVzZXJOYW1lIjoiYWRtaW4iLCJlbWFpbCI6bnVsbCwicGhvbmUiOm51bGwsInN0YXRlIjowLCJjcmVhdGVkQXQiOiIyMDI0LTEwLTE4VDAxOjUxOjQ0LjE1NloiLCJ1cGRhdGVkQXQiOiIyMDI0LTEwLTE4VDAxOjUxOjQ0LjE1NloiLCJyb2xlcyI6W3siaWQiOjEsIm5hbWUiOiLnrqHnkIblkZgiLCJjcmVhdGVUaW1lIjoiMjAyNC0xMC0xOFQwMTo1MTo0NC4xNDlaIiwidXBkYXRlVGltZSI6IjIwMjQtMTAtMThUMDE6NTE6NDQuMTQ5WiJ9XX0sImlkIjoid3V4aWFuIiwiaWF0IjoxNzQxNTk1MzY5LCJleHAiOjE3NDE2MTMzNjl9.Al6iYH9OYszVxO9sUMq6VJcB25t0zyOI41E7WdAvu8w`

// 动态计算最佳分片大小(calculateChunkSize 中的分片是为了实际的文件上传)
const calculateChunkSize = (fileSize: number) => {
  // 最小分片大小 1MB
  const minChunkSize = 1024 * 1024
  // 最大分片大小 10MB
  const maxChunkSize = 10 * 1024 * 1024
  // 期望的分片数量范围
  const minChunks = 10
  const maxChunks = 100

  // 初始分片大小：将文件大小除以期望的最小分片数
  let chunkSize = Math.ceil(fileSize / minChunks)

  // 确保分片大小在合理范围内
  if (chunkSize < minChunkSize) {
    chunkSize = minChunkSize
  } else if (chunkSize > maxChunkSize) {
    chunkSize = maxChunkSize
  }

  // 确保分片数量不会过多
  const chunks = Math.ceil(fileSize / chunkSize)
  if (chunks > maxChunks) {
    chunkSize = Math.ceil(fileSize / maxChunks)
  }

  return chunkSize
}

// 计算文件hash的函数(calculateHash 中的分片是为了快速计算大文件的特征值（hash）)
const calculateHash = async (file: File): Promise<string> => {
  const options = {
    chunkNum: 10, // 10个分片
    sampleSize: 1024 * 1024 // 1MB 采样大小
  }

  // 处理小文件
  if (file.size <= 10 * 1024 * 1024) {
    // 小于10MB的文件，直接计算hash
    options.chunkNum = 1
    const spark = new SparkMD5.ArrayBuffer()
    const buffer = await file.arrayBuffer()
    spark.append(buffer)
    return spark.end()
  }

  // 对大文件进行分片采样 假设文件大小约84MB，所以每个分片约8.4MB
  const chunkSize = Math.floor(file.size / options.chunkNum)
  const sampledChunks: Blob[] = []

  // 从每个分片中只取1MB的数据
  for (let i = 0; i < options.chunkNum; i++) {
    const start = i * chunkSize
    const sampleChunk = file.slice(start, start + options.sampleSize)
    sampledChunks.push(sampleChunk)
  }

  // 合并采样数据
  const sampleMerged = new Blob(sampledChunks, { type: file.type }) // 大约10MB的数据，大约10,485,760 字节（即10MB）

  // 使用SparkMD5计算这个合并后的采样数据的hash值
  return new Promise((resolve) => {
    const fileReader = new FileReader()
    fileReader.readAsArrayBuffer(sampleMerged)
    fileReader.onload = (e) => {
      const buffer = e.target?.result as ArrayBuffer
      const hash = SparkMD5.ArrayBuffer.hash(buffer)
      resolve(hash)
    }
  })
  // 这种采样策略的优点是：
  // 1. 避免读取整个大文件，提高性能
  // 2. 保持一定的特征代表性（取每个区域的开头部分）
  // 3. 生成的hash值仍然能较好地代表文件的唯一性
  // 需要注意的是，这种方式计算出的hash值并不是完整文件内容的hash，而是文件特征的hash。这个hash值主要用于：

  // - 文件的快速特征识别
  // - 秒传判断
  // - 断点续传的文件标识
}

interface UploadTask {
  fileName: string
  progress: number
  isPaused: boolean
  uploadedChunks: Set<number>
  controller: AbortController | null
  isCompleted: boolean
  currentFile: File | null
  fileHash: string
}

interface UploadInfoState {
  tasks: Map<string, UploadTask>
  concurrentLimit: number
  activeUploads: number
}

const uploadInfo = ref<UploadInfoState>({
  tasks: new Map(),
  concurrentLimit: 6, // 同时上传的文件数量限制
  activeUploads: 0
})

// 添加任务队列
const uploadQueue: string[] = []

// 添加新的上传任务
const addUploadTask = (file: File) => {
  const taskId = `${file.name}-${Date.now()}`
  uploadInfo.value.tasks.set(taskId, {
    fileName: file.name,
    progress: 0,
    isPaused: false,
    uploadedChunks: new Set<number>(),
    controller: null,
    isCompleted: false,
    currentFile: file,
    fileHash: ''
  })
  uploadQueue.push(taskId)
  processQueue()
}

// 处理上传队列
const processQueue = async () => {
  while (
    uploadQueue.length > 0 &&
    uploadInfo.value.activeUploads < uploadInfo.value.concurrentLimit
  ) {
    const taskId = uploadQueue.shift()
    if (taskId) {
      uploadInfo.value.activeUploads++
      const task = uploadInfo.value.tasks.get(taskId)
      if (task) {
        try {
          // 计算文件hash
          task.fileHash = await calculateHash(task.currentFile!)

          // 获取已上传进度
          task.uploadedChunks = getUploadProgress(task.fileHash)

          // 检查文件是否已存在
          const exists = await getFileExist(task.fileHash)
          if (exists) {
            console.log(`文件 ${task.fileName} 已存在，秒传成功`)
            task.isCompleted = true
            task.progress = 100
          } else {
            // 开始上传
            await handleUpload(taskId)
          }
        } catch (error) {
          console.error(`处理文件 ${task.fileName} 失败:`, error)
        } finally {
          uploadInfo.value.activeUploads--
          processQueue() // 继续处理队列
        }
      }
    }
  }
}

// 保存上传进度到localStorage
const saveUploadProgress = (fileHash: string, chunks: Set<number>) => {
  localStorage.setItem(`upload_${fileHash}`, JSON.stringify([...chunks]))
}

// 修改获取上传进度的函数
const getUploadProgress = (fileHash: string) => {
  const progress = localStorage.getItem(`upload_${fileHash}`)
  if (!progress) return new Set<number>()
  // 确保解析出的数组元素为 number 类型
  const chunks = JSON.parse(progress) as number[]
  return new Set<number>(chunks)
}

// 暂停上传
const pauseUpload = (taskId: string) => {
  const task = uploadInfo.value.tasks.get(taskId)
  if (task) {
    task.isPaused = true
    if (task.controller) {
      task.controller.abort()
      task.controller = null
    }
  }
}

// 继续上传
const resumeUpload = (taskId: string) => {
  const task = uploadInfo.value.tasks.get(taskId)
  if (task) {
    task.isPaused = false
    handleUpload(taskId)
  }
}

// 添加网络状态监听和重连相关的状态
const isOnline = ref(navigator.onLine)
const retryCount = ref(0)
const maxRetries = 3
const retryDelay = 1000 // 重试延迟时间（毫秒）

// 监听网络状态
onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

// 网络状态处理函数
const handleOnline = () => {
  isOnline.value = true
  console.log('网络已连接，尝试恢复上传')
  resumeAllPendingTasks()
}

const handleOffline = () => {
  isOnline.value = false
  console.log('网络已断开，暂停所有上传')
  pauseAllTasks()
}

// 暂停所有任务
const pauseAllTasks = () => {
  uploadInfo.value.tasks.forEach((task, taskId) => {
    if (!task.isCompleted && !task.isPaused) {
      pauseUpload(taskId)
    }
  })
}

// 恢复所有待处理的任务
const resumeAllPendingTasks = () => {
  uploadInfo.value.tasks.forEach((task, taskId) => {
    if (!task.isCompleted && task.isPaused) {
      resumeUpload(taskId)
    }
  })
}

// 修改 uploadChunk 方法，添加重试机制
const uploadChunk = async (
  chunk: Blob,
  index: number,
  fileHash: string,
  fileName: string,
  totalChunks: number,
  taskId: string,
  retryCount = 0
) => {
  const task = uploadInfo.value.tasks.get(taskId)
  if (!task) return Promise.reject('任务不存在')

  if (!isOnline.value) {
    console.log('当前处于离线状态，暂停上传')
    task.isPaused = true
    return Promise.reject('offline')
  }

  // 检查分片是否已上传
  if (task.uploadedChunks.has(index)) {
    console.log(`分片 ${index} 已上传，跳过`)
    return Promise.resolve()
  }

  const controller = new AbortController()
  task.controller = controller

  try {
    const data = new FormData()
    data.append('name', `${fileHash}_${fileName}-${index}`)
    data.append('files', chunk)
    data.append('fileHash', fileHash)
    data.append('chunkIndex', index.toString())
    data.append('totalChunks', totalChunks.toString())

    const response = await fetch('http://localhost:9528/api/upload/uploadFile', {
      method: 'POST',
      body: data,
      headers: { Authorization: token },
      signal: controller.signal
    })

    if (response.ok) {
      task.uploadedChunks.add(index)
      task.progress = Math.floor((task.uploadedChunks.size / totalChunks) * 100)
      saveUploadProgress(fileHash, task.uploadedChunks)
      console.log(`分片 ${index} 上传成功，当前进度: ${task.progress}%`)
    } else {
      throw new Error('上传失败')
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      return Promise.reject('paused')
    }

    // 网络错误或其他错误时进行重试
    if (retryCount < maxRetries && isOnline.value) {
      console.log(`分片 ${index} 上传失败，${retryDelay / 1000}秒后进行第 ${retryCount + 1} 次重试`)
      await new Promise((resolve) => setTimeout(resolve, retryDelay))
      return uploadChunk(chunk, index, fileHash, fileName, totalChunks, taskId, retryCount + 1)
    }

    console.error(`分片 ${index} 上传失败，已达到最大重试次数:`, error)
    throw error
  }
}

// 修改 getFileExist 方法
const getFileExist = async (fileHash: string) => {
  const res = await fetch(`http://localhost:9528/api/upload/checkFileExist?hash=${fileHash}`, {
    method: 'GET',
    headers: { Authorization: token }
  })
  const data = await res.json()
  if (data.code !== 200) return false
  return data.exist
}

// 修改 handleUpload 方法
const handleUpload = async (taskId: string) => {
  const task = uploadInfo.value.tasks.get(taskId)
  if (!task || !task.currentFile || !task.fileHash) return

  const dynamicChunkSize = calculateChunkSize(task.currentFile.size)
  const chunks = []
  let startPos = 0

  while (startPos < task.currentFile.size) {
    chunks.push(task.currentFile.slice(startPos, startPos + dynamicChunkSize))
    startPos += dynamicChunkSize
  }

  // 更新进度条显示已上传的分片
  if (task.uploadedChunks.size > 0) {
    task.progress = Math.floor((task.uploadedChunks.size / chunks.length) * 100)
  }

  // 使用 Promise.all 并发上传分片，但限制并发数
  const concurrentLimit = 3 // 每个文件同时上传的分片数
  const pendingChunks = []

  for (let i = 0; i < chunks.length; i++) {
    if (task.isPaused) {
      console.log('上传已暂停，停止添加新分片')
      break
    }

    // 如果分片已上传，跳过
    if (task.uploadedChunks.has(i)) {
      continue
    }

    // 创建上传任务
    const uploadTask = () =>
      uploadChunk(
        chunks[i],
        i,
        task.fileHash,
        task.fileName,
        chunks.length,
        taskId,
        retryCount.value
      ).catch((error) => {
        if (error === 'paused') {
          console.log(`分片 ${i} 上传已暂停`)
          return
        }
        console.error(`分片 ${i} 上传失败:`, error)
      })

    pendingChunks.push(uploadTask)

    // 当达到并发限制或所有分片都已添加时，执行上传
    if (pendingChunks.length >= concurrentLimit || i === chunks.length - 1) {
      await Promise.all(pendingChunks.map((task) => task()))
      pendingChunks.length = 0 // 清空待处理队列

      // 再次检查是否暂停
      if (task.isPaused) {
        console.log('上传已暂停，不继续上传下一批分片')
        break
      }
    }
  }

  // 所有分片上传完成，请求合并
  if (!task.isPaused && task.uploadedChunks.size === chunks.length) {
    try {
      console.log('所有分片上传完成，开始合并文件')
      const mergeResponse = await fetch(
        `http://localhost:9528/api/upload/merge?name=${task.fileHash}_${task.fileName}&fileHash=${task.fileHash}`,
        {
          method: 'GET',
          headers: { Authorization: token }
        }
      )
      const mergeResult = await mergeResponse.json()
      console.log('合并响应:', mergeResult)

      // 清理进度记录
      localStorage.removeItem(`upload_${task.fileHash}`)
      // 设置完成状态
      task.isCompleted = true
      console.log('文件合并完成')
    } catch (error) {
      console.error('合并文件失败:', error)
    }
  }
}

// 修改 handleChange 方法，重置完成状态
const handleChange = async ({ file }: any) => {
  if (file.status === 'removed') {
    return
  }
  addUploadTask(file.file)
}
</script>

<style scoped>
.mt-4 {
  margin-top: 1rem;
}
.mb-2 {
  margin-bottom: 0.5rem;
}
.flex {
  display: flex;
}
.items-center {
  align-items: center;
}
.justify-between {
  justify-content: space-between;
}
</style>
