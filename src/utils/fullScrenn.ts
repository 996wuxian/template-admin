import { ref } from 'vue'

export function useFullscreen() {
  const isFullscreen = ref(false)

  const enterFullscreen = (element?: HTMLElement) => {
    const el = element || document.documentElement
    if (el.requestFullscreen) {
      el.requestFullscreen().then(() => {
        isFullscreen.value = true
      })
    } else if ((el as any).mozRequestFullScreen) {
      ;(el as any).mozRequestFullScreen().then(() => {
        isFullscreen.value = true
      })
    } else if ((el as any).webkitRequestFullscreen) {
      ;(el as any).webkitRequestFullscreen().then(() => {
        isFullscreen.value = true
      })
    } else if ((el as any).msRequestFullscreen) {
      ;(el as any).msRequestFullscreen().then(() => {
        isFullscreen.value = true
      })
    }
  }

  const exitFullscreen = () => {
    if (document.exitFullscreen) {
      document.exitFullscreen().then(() => {
        isFullscreen.value = false
      })
    } else if ((document as any).mozCancelFullScreen) {
      ;(document as any).mozCancelFullScreen().then(() => {
        isFullscreen.value = false
      })
    } else if ((document as any).webkitExitFullscreen) {
      ;(document as any).webkitExitFullscreen().then(() => {
        isFullscreen.value = false
      })
    } else if ((document as any).msExitFullscreen) {
      ;(document as any).msExitFullscreen().then(() => {
        isFullscreen.value = false
      })
    }
  }

  return {
    isFullscreen,
    enterFullscreen,
    exitFullscreen
  }
}
