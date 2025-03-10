import { createApp, h, ref, Component, nextTick } from 'vue'
import { NModal, NCard, NButton } from 'naive-ui'
import type { ModalProps } from 'naive-ui'

export const dialog = (
  component: Component,
  props: Record<string, any> = {},
  modalProps: Partial<ModalProps & Record<string, any>> = {}
) => {
  const show = ref(false)
  let app: ReturnType<typeof createApp> | null = null

  const destroyDialog = () => {
    show.value = false
    setTimeout(() => {
      app?.unmount()
      div?.parentNode?.removeChild(div)
    }, 300)
  }

  const dialog = () =>
    h(
      'div',
      {},
      h(
        NModal,
        {
          ...modalProps,
          show: show.value,
          onMaskClick: destroyDialog,
          onEsc: destroyDialog,
          autoFocus: false,
          trapFocus: false,
          transformOrigin: 'center'
        },
        {
          default: () =>
            h(
              NCard,
              {
                style: '100%',
                bordered: false,
                size: 'small',
                role: 'dialog',
                'aria-modal': true,
                title: props.title,
                closable: true,
                onClose: destroyDialog
              },
              {
                'header-extra': () => (props.headerExtra ? h('div', {}, props.headerExtra) : null),
                default: () => h(component, props),
                footer: () =>
                  props.footer
                    ? h('div', {}, props.footer)
                    : h(
                        'div',
                        {
                          style: {
                            display: 'flex',
                            width: '100%',
                            justifyContent: 'flex-end',
                            gap: '10px'
                          }
                        },
                        [
                          h(NButton, { onClick: destroyDialog }, { default: () => '取消' }),
                          h(
                            NButton,
                            { type: 'primary', onClick: destroyDialog },
                            { default: () => '确定' }
                          )
                        ]
                      )
              }
            )
        }
      )
    )

  const div = document.createElement('div')
  app = createApp(dialog)
  document.body.appendChild(div)
  app.mount(div)

  nextTick(() => {
    show.value = true
  })

  return {
    close: destroyDialog
  }
}
