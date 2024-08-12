interface FieldConfig {
  label: string
  path: string
  type: string
  span?: number
  placeholder?: string
  showLabel?: boolean
  buttonText?: string
  required?: boolean
  message?: string
  trigger?: Array<string>
  options?: Array<{ label: string; value: string | number }>
  multiple?: boolean
  disabled?: boolean
  rType?: string
  arrays?: Array<{ label: string; value: string | number }>
}

export const f = (
  label: string,
  path: string,
  type: string,
  span: number = 24,
  placeholder: string = '',
  showLabel: boolean = true
) => {
  const obj: FieldConfig = {
    label,
    path,
    type,
    span,
    placeholder,
    showLabel,
    required: false,
    message: '',
    trigger: ['blur', 'input'],
    options: [],
    multiple: false,
    rType: '',
    arrays: [],
    disabled: false
  }

  const chainable = {
    r(
      message: string = `${label}不能为空`,
      trigger: Array<string> = ['blur', 'input'],
      rType: string = ''
    ) {
      obj.required = true
      obj.message = message
      obj.trigger = trigger
      obj.rType = rType
      return this
    },
    ops(options: Array<{ label: string; value: string | number; children?: any }>) {
      obj.options = options
      return this
    },
    ary(arrays: Array<{ label: string; value: string | number; children?: any }>) {
      obj.arrays = arrays
      return this
    },
    mult() {
      obj.multiple = true
      return this
    },
    d() {
      obj.disabled = true
      return this
    },
    b() {
      return obj
    }
  }

  return chainable
}
