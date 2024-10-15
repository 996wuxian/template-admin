// 自动重启

import viteRestart from 'vite-plugin-restart'
export const setupViteRestart = () =>
  viteRestart({
    restart: ['*.config.[jt]s', '**/config/*.[jt]s', '*.config.cjs']
  })
