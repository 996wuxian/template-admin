<template>
  <n-card>
    <n-upload multiple directory-dnd :default-upload="false" :max="5" @change="handleChange">
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

    <div v-if="uploadInfo.fileName" class="mt-4">
      <div class="flex items-center justify-between mb-2">
        <span>{{ uploadInfo.fileName }}</span>
        <div v-if="!uploadInfo.isCompleted">
          <n-button v-if="!uploadInfo.isPaused" size="small" @click="pauseUpload">暂停</n-button>
          <n-button v-else size="small" type="primary" @click="resumeUpload">继续</n-button>
        </div>
      </div>
      <n-progress
        :percentage="uploadInfo.progress"
        :processing="!uploadInfo.isPaused && !uploadInfo.isCompleted"
        :status="uploadInfo.isCompleted ? 'success' : 'default'"
      />
    </div>
  </n-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import SparkMD5 from 'spark-md5'

// const chunkSize = 1024 * 1024 // 1MB
const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiaWQiOjEsInVzZXJOYW1lIjoiYWRtaW4iLCJlbWFpbCI6bnVsbCwicGhvbmUiOm51bGwsInN0YXRlIjowLCJjcmVhdGVkQXQiOiIyMDI0LTEwLTE4VDAxOjUxOjQ0LjE1NloiLCJ1cGRhdGVkQXQiOiIyMDI0LTEwLTE4VDAxOjUxOjQ0LjE1NloiLCJyb2xlcyI6W3siaWQiOjEsIm5hbWUiOiLnrqHnkIblkZgiLCJjcmVhdGVUaW1lIjoiMjAyNC0xMC0xOFQwMTo1MTo0NC4xNDlaIiwidXBkYXRlVGltZSI6IjIwMjQtMTAtMThUMDE6NTE6NDQuMTQ5WiJ9XX0sImlkIjoid3V4aWFuIiwiaWF0IjoxNzQxMzA4NDA2LCJleHAiOjE3NDEzMjY0MDZ9.g1cu5b971zRSeFWI9gEvgHXlf14sDbQMfzIyh-_Qews`

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

interface UploadInfoState {
  fileName: string
  progress: number
  isPaused: boolean
  uploadedChunks: Set<number>
  controller: AbortController | null
  isCompleted: boolean
  currentFile: File | null
  fileHash: string
}

const uploadInfo = ref<UploadInfoState>({
  fileName: '',
  progress: 0,
  isPaused: false,
  uploadedChunks: new Set<number>(),
  controller: null as AbortController | null,
  isCompleted: false, // 添加完成状态
  currentFile: null,
  fileHash: ''
})

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
const pauseUpload = () => {
  uploadInfo.value.isPaused = true
  if (uploadInfo.value.controller) {
    uploadInfo.value.controller.abort()
    uploadInfo.value.controller = null
  }
}

// 继续上传
const resumeUpload = () => {
  uploadInfo.value.isPaused = false
  handleUpload()
}

// 上传单个分片
const uploadChunk = async (
  chunk: Blob,
  index: number,
  fileHash: string,
  fileName: string,
  totalChunks: number
) => {
  // 检查分片是否已上传，如果已上传则跳过
  if (uploadInfo.value.uploadedChunks.has(index)) {
    console.log(`分片 ${index} 已上传，跳过`)
    return Promise.resolve()
  }

  // 创建 AbortController，用于取消请求
  const controller = new AbortController()
  uploadInfo.value.controller = controller

  const data = new FormData()
  data.append('name', `${fileHash}_${fileName}-${index}`)
  data.append('files', chunk)
  data.append('fileHash', fileHash)
  data.append('chunkIndex', index.toString())
  data.append('totalChunks', totalChunks.toString())

  try {
    console.log(`开始上传分片 ${index}`)
    const response = await fetch('http://localhost:9528/api/upload/uploadFile', {
      method: 'POST',
      body: data,
      headers: { Authorization: token },
      signal: controller.signal // 关联 AbortController
    })

    if (response.ok) {
      uploadInfo.value.uploadedChunks.add(index)
      uploadInfo.value.progress = Math.floor(
        (uploadInfo.value.uploadedChunks.size / totalChunks) * 100
      )
      // 保存上传进度到localStorage
      saveUploadProgress(fileHash, uploadInfo.value.uploadedChunks)
      console.log(`分片 ${index} 上传成功，当前进度: ${uploadInfo.value.progress}%`)
    }
  } catch (error: any) {
    if (error.name === 'AbortError') {
      console.log(`分片 ${index} 上传已暂停`)
      return Promise.reject('paused')
    }

    console.error(`分片 ${index} 上传失败:`, error)
    throw error
  }
}

const getFileExist = async () => {
  const res = await fetch(
    `http://localhost:9528/api/upload/checkFileExist?hash=${uploadInfo.value.fileHash}`,
    {
      method: 'GET',
      headers: { Authorization: token }
    }
  )
  const data = await res.json()
  console.log('🚀 ~ getFileExist ~ data:', data)
  if (data.code !== 200) return
  return data.exist
}

// 修改 handleUpload 方法
const handleUpload = async () => {
  if (!uploadInfo.value.currentFile || !uploadInfo.value.fileHash) return

  // 使用动态计算的分片大小
  const dynamicChunkSize = calculateChunkSize(uploadInfo.value.currentFile.size)
  console.log(`文件大小: ${uploadInfo.value.currentFile.size}，分片大小: ${dynamicChunkSize}`)

  const chunks = []
  let startPos = 0

  while (startPos < uploadInfo.value.currentFile.size) {
    chunks.push(uploadInfo.value.currentFile.slice(startPos, startPos + dynamicChunkSize))
    startPos += dynamicChunkSize
  }
  console.log(`总分片数: ${chunks.length}，已上传分片数: ${uploadInfo.value.uploadedChunks.size}`)

  // 更新进度条显示已上传的分片
  if (uploadInfo.value.uploadedChunks.size > 0) {
    uploadInfo.value.progress = Math.floor(
      (uploadInfo.value.uploadedChunks.size / chunks.length) * 100
    )
  }

  for (let i = 0; i < chunks.length; i++) {
    if (uploadInfo.value.isPaused) {
      console.log('上传已暂停')
      break
    }

    try {
      await uploadChunk(
        chunks[i],
        i,
        uploadInfo.value.fileHash,
        uploadInfo.value.currentFile.name,
        chunks.length
      )
    } catch (error) {
      if (error === 'paused') break
      console.error('Upload error:', error)
    }
  }

  // 所有分片上传完成，请求合并
  if (!uploadInfo.value.isPaused && uploadInfo.value.uploadedChunks.size === chunks.length) {
    try {
      console.log('所有分片上传完成，开始合并文件')
      await fetch(
        `http://localhost:9528/api/upload/merge?name=${uploadInfo.value.fileHash}_${uploadInfo.value.currentFile.name}&fileHash=${uploadInfo.value.fileHash}`,
        {
          method: 'GET',
          headers: { Authorization: token }
        }
      )
      // 清理进度记录
      localStorage.removeItem(`upload_${uploadInfo.value.fileHash}`)
      // 设置完成状态
      uploadInfo.value.isCompleted = true
      console.log('文件合并完成')
    } catch (error) {
      console.error('Merge error:', error)
    }
  }
}

// 修改 handleChange 方法，重置完成状态
const handleChange = async ({ file }: any) => {
  uploadInfo.value.fileName = file.file.name
  uploadInfo.value.progress = 0
  uploadInfo.value.isPaused = false
  uploadInfo.value.isCompleted = false // 重置完成状态
  uploadInfo.value.currentFile = file.file

  // 计算文件hash
  uploadInfo.value.fileHash = await calculateHash(file.file)

  // 获取已上传的进度
  uploadInfo.value.uploadedChunks = getUploadProgress(uploadInfo.value.fileHash)

  // 检查文件是否已存在
  const res = await getFileExist()
  if (res) {
    console.log('文件已存在，秒传成功')
    uploadInfo.value.isCompleted = true
    uploadInfo.value.progress = 100
    return
  }
  // 开始上传
  handleUpload()
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
