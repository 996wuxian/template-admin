import { ref, reactive, h, render } from 'vue'
import CustomLoading from '@/components/common/loading.vue'

export default function useLoading() {
  const loadingContainer = ref(document.createElement('div'))

  const state = reactive({
    show: false,
    text: '加载中...'
  })

  const show = (text?: string) => {
    state.show = true
    if (text) state.text = text
    if (!loadingContainer.value.parentNode) {
      document.body.appendChild(loadingContainer.value)
    }
    render(h(CustomLoading, { show: state.show, text: state.text }), loadingContainer.value)
  }

  const hide = () => {
    state.show = false
    state.text = '加载中...'
    render(null, loadingContainer.value)
  }

  return { show, hide }
}
