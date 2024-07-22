// core.ts
export default {
  f(
    label: string,
    path: string,
    type: string,
    span?: number,
    placeholder?: string,
    showLabel?: boolean,
    buttonText?: string
  ) {
    const obj = {
      label,
      path,
      type,
      span,
      placeholder,
      showLabel: true,
      buttonText,
      required: false,
      message: '',
      trigger: ['blur', 'input'],
      options: [] as Array<{ label: string; value: string | number }>
    }

    const chainable = {
      r(message: string = `${label}不能为空`, trigger: Array<string> = ['blur', 'input']) {
        obj.required = true
        obj.message = message
        obj.trigger = trigger
        return this
      },
      ops(options: Array<{ label: string; value: string | number }>) {
        obj.options = options
        return this
      },
      b() {
        return obj
      }
    }

    return chainable
  }
}
