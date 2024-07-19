// loading.js
import { createDiscreteApi } from 'naive-ui'
const { loadingBar, message } = createDiscreteApi(['loadingBar', 'message'])
export function $showLoading() {
  loadingBar.start()
}
export function $hideLoading() {
  loadingBar.finish()
}

type msgType = {
  type: 'success' | 'error' | 'warning' | 'info'
  msg: string
}

// message.js
export function $msg({ type, msg }: msgType) {
  if (type === 'success') {
    message.success(msg)
  } else if (type === 'error') {
    message.error(msg)
  } else if (type === 'warning') {
    message.warning(msg)
  } else if (type === 'info') {
    message.info(msg)
  }
}
