interface ColumnConfig {
  type?: string
  title: string
  key?: string
  titleAlign: string
  align?: string
  render?: (row: any) => any
  fixed?: string
  width?: number
}

export const t = (title: string, key?: string, align?: string) => {
  const obj: ColumnConfig = {
    title,
    key,
    titleAlign: 'center',
    align: align || 'center'
  }

  const chainable = {
    c() {
      obj.type = 'selection'
      return this
    },
    f(position: string, width: number) {
      obj.fixed = position
      obj.width = width
      return this
    },
    r(fn: (row: any) => any) {
      obj.render = fn
      return this
    },
    b() {
      return obj
    }
  }

  return chainable
}
