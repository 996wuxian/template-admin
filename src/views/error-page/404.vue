<script setup lang="ts">
  import { onBeforeMount, reactive } from 'vue'
  import { useRouter } from 'vue-router'
  const router = useRouter()
  import roleImg from '@/assets/img/error_images/404.png'
  import cloudImg from '@/assets/img/error_images/cloud.png'
  const state = reactive({
    jumpTime: 5,
    oops: '抱歉!',
    headline: '当前页面不存在...',
    info: '请检查您输入的网址是否正确，或点击下面的按钮返回首页。',
    btn: '返回首页',
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
      <div class="error-grid">
        <div class="error-grid-item">
          <div class="pic-error">
            <img class="pic-error-parent" :src="roleImg" alt="404" />
            <img class="pic-error-child left" :src="cloudImg" alt="cloud" />
          </div>
        </div>
        <div class="error-grid-item">
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
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
  .error-container {
    width: 100vw;
    height: 100vh;
    position: relative;

    .error-content {
      position: absolute;
      top: 50%;
      left: 50%;
      width: 40vw;
      height: 400px;
      transform: translate(-50%, -50%);

      .error-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 12px;
      }

      .pic-error {
        position: relative;
        width: 100%;
        overflow: hidden;
        float: left;

        &-parent {
          width: 100%;
        }

        &-child {
          position: absolute;

          &.left {
            top: 17px;
            left: 220px;
            width: 80px;
            opacity: 0;
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
        position: relative;
        float: left;
        width: 300px;
        padding: 30px 0;
        overflow: hidden;

        &-oops {
          margin-bottom: 20px;
          font-size: 32px;
          font-weight: bold;
          line-height: 40px;
          color: #333;
          opacity: 0;
          animation-name: slide-up;
          animation-duration: 0.5s;
          animation-fill-mode: forwards;
        }

        &-headline {
          margin-bottom: 10px;
          font-size: 20px;
          font-weight: bold;
          line-height: 24px;
          color: #222;
          opacity: 0;
          animation-name: slide-up;
          animation-duration: 0.5s;
          animation-delay: 0.1s;
          animation-fill-mode: forwards;
        }

        &-info {
          margin-bottom: 30px;
          font-size: 13px;
          line-height: 21px;
          color: #444;
          opacity: 0;
          animation-name: slide-up;
          animation-duration: 0.5s;
          animation-delay: 0.2s;
          animation-fill-mode: forwards;
        }

        &-return-home {
          padding: 0 20px;
          display: block;
          float: left;
          height: 36px;
          font-size: 14px;
          line-height: 36px;
          color: #fff;
          text-align: center;
          background-color: #30a0fa;
          border-radius: 100px;
          opacity: 0;
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
