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
  </n-card>
</template>

<script setup lang="ts">
const chunkSize = 10 * 1024
const token = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHQiOnsiaWQiOjEsInVzZXJOYW1lIjoiYWRtaW4iLCJlbWFpbCI6bnVsbCwicGhvbmUiOm51bGwsInN0YXRlIjowLCJjcmVhdGVkQXQiOiIyMDI0LTEwLTE4VDAxOjUxOjQ0LjE1NloiLCJ1cGRhdGVkQXQiOiIyMDI0LTEwLTE4VDAxOjUxOjQ0LjE1NloiLCJyb2xlcyI6W3siaWQiOjEsIm5hbWUiOiLnrqHnkIblkZgiLCJjcmVhdGVUaW1lIjoiMjAyNC0xMC0xOFQwMTo1MTo0NC4xNDlaIiwidXBkYXRlVGltZSI6IjIwMjQtMTAtMThUMDE6NTE6NDQuMTQ5WiJ9XX0sImlkIjoid3V4aWFuIiwiaWF0IjoxNzI5NDcxOTAzLCJleHAiOjE3Mjk0ODk5MDN9.2t0Rhl9fPDwDsPmspXgyAg3gxngCY_AKaDWVjmYql-o`
const handleChange = async ({ file }: any) => {
  console.log('🚀 ~ handleChange ~ file:', file)
  const chunk = []
  let startPos = 0
  while (startPos < file.file.size) {
    chunk.push(file.file.slice(startPos, startPos + chunkSize))
    startPos += chunkSize
  }

  const randomStr = Math.random().toString().slice(2, 8)

  const task: any[] = []

  chunk.map(async (chunk, index) => {
    const data = new FormData()
    data.set('name', `${randomStr}_${file.name}-${index}`)
    data.append('files', chunk)
    task.push(
      fetch('http://localhost:9528/api/upload/uploadFile', {
        method: 'POST',
        body: data,
        headers: {
          Authorization: token
        }
      })
    )
  })
  await Promise.all(task)
  fetch(`http://localhost:9528/api/upload/merge?name=${randomStr}_${file.name}`, {
    method: 'GET',
    headers: {
      Authorization: token
    }
  })
}
</script>

<style scoped></style>
