<script setup lang="ts">
import { onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import roleImg from '@/assets/img/error_images/404.png'
import cloudImg from '@/assets/img/error_images/cloud.png'
const state = reactive({
  jumpTime: 5,
  oops: '抱歉!',
  headline: '当前页面不存在...',
  info: '请检查您输入的网址是否正确，或点击下面的按钮返回首页。',
  btn: '返回首页'
})

let timer: any

const timeChange = () => {
  timer = setInterval(() => {
    if (state.jumpTime) {
      state.jumpTime--
    } else {
      router.push('/')
      clearInterval(timer)
    }
  }, 1000)
}

onBeforeMount(() => {
  timeChange()
})
</script>

<template>
  <div class="error-container">
    <div class="error-content">
      <n-grid x-gap="12" :cols="2">
        <n-gi>
          <div class="pic-error">
            <n-image class="pic-error-parent" :src="roleImg" preview-disabled />
            <n-image class="pic-error-child left" :src="cloudImg" preview-disabled />
          </div>
        </n-gi>
        <n-gi>
          <div class="bullshit">
            <div class="bullshit-oops">{{ state.oops }}</div>
            <div class="bullshit-headline">{{ state.headline }}</div>
            <div class="bullshit-info">{{ state.info }}</div>
            <router-link v-slot="{ navigate }" custom to="/">
              <a class="bullshit-return-home" @click="navigate">
                {{ state.jumpTime }}s&nbsp;{{ state.btn }}
              </a>
            </router-link>
          </div>
        </n-gi>
      </n-grid>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.error-container {
  @apply w-100vw h-100vh relative;

  .error-content {
    @apply absolute top-50% left-50% w-40vw h-400px;
    transform: translate(-50%, -50%);

    .pic-error {
      @apply relative w-100% overflow-hidden float-left;

      &-parent {
        @apply w-100%;
      }

      &-child {
        @apply absolute;

        &.left {
          @apply top-17px left-220px w-80px opacity-0;
          animation-name: cloud-left;
          animation-duration: 2s;
          animation-timing-function: linear;
          animation-delay: 1s;
          animation-fill-mode: forwards;
        }

        @keyframes cloud-left {
          0% {
            top: 17px;
            left: 220px;
            opacity: 0;
          }

          20% {
            top: 33px;
            left: 188px;
            opacity: 1;
          }

          80% {
            top: 81px;
            left: 92px;
            opacity: 1;
          }

          100% {
            top: 97px;
            left: 60px;
            opacity: 0;
          }
        }
      }
    }

    .bullshit {
      @apply relative float-left w-300px py-30px overflow-hidden;

      &-oops {
        @apply m-b-20px text-32px font-bold line-height-40px text-[#333] opacity-0;
        animation-name: slide-up;
        animation-duration: 0.5s;
        animation-fill-mode: forwards;
      }

      &-headline {
        @apply m-b-10px text-20px font-bold line-height-24px text-[#222] opacity-0;
        animation-name: slide-up;
        animation-duration: 0.5s;
        animation-delay: 0.1s;
        animation-fill-mode: forwards;
      }

      &-info {
        @apply m-b-30px text-13px line-height-21px text-[#444] opacity-0;
        animation-name: slide-up;
        animation-duration: 0.5s;
        animation-delay: 0.2s;
        animation-fill-mode: forwards;
      }

      &-return-home {
        @apply px-20px block float-left h-36px text-14px line-height-36px text-[#fff] text-align-center bg-[#30a0fa] b-rd-100px opacity-0;
        cursor: pointer;
        animation-name: slide-up;
        animation-duration: 0.5s;
        animation-delay: 0.3s;
        animation-fill-mode: forwards;
      }

      @keyframes slide-up {
        0% {
          opacity: 0;
          transform: translateY(60px);
        }

        100% {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
  }
}
</style>
