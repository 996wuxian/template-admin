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

// 预定义常用选项
export const COMMON_OPTIONS = {
  gender: [
    { label: '不限', value: '0' },
    { label: '男', value: '1' },
    { label: '女', value: '2' },
  ],
  status: [
    { label: '启用', value: '1' },
    { label: '禁用', value: '0' },
  ],
  yesNo: [
    { label: '是', value: '1' },
    { label: '否', value: '0' },
  ],
}

export const f = (
  label: string,
  path: string,
  type: string,
  span: number = 24,
  placeholder: string = '',
  showLabel: boolean = true,
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
    disabled: false,
  }

  const chainable = {
    r(
      message: string = `${label}不能为空`,
      trigger: Array<string> = ['blur', 'input'],
      rType: string = '',
    ) {
      obj.required = true
      obj.message = message
      obj.trigger = trigger
      obj.rType = rType
      return this
    },
    ops(options: Array<{ label: string; value: string | number; children?: any }> | string) {
      // 支持预定义选项的字符串键
      if (typeof options === 'string') {
        obj.options = COMMON_OPTIONS[options as keyof typeof COMMON_OPTIONS] || []
      } else {
        obj.options = options
      }
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
    // 移除 b() 方法，直接返回配置对象
    valueOf() {
      return obj
    },
    // 支持隐式转换
    [Symbol.toPrimitive]() {
      return obj
    },
  }

  // 让对象可以直接被当作配置使用
  return new Proxy(chainable, {
    get(target, prop) {
      if (prop in target) {
        return target[prop as keyof typeof target]
      }
      return obj[prop as keyof FieldConfig]
    },
  })
}
