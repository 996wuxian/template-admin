// 数组转树形结构
export const arrayToTree = <T extends Record<string, any>>(
  list: T[],
  id: keyof T = 'id',
  parentId: keyof T = 'parentId',
  children: keyof T = 'children'
) => {
  const treeList: T[] = []
  const map: Record<string, T> = {}

  list.forEach((item) => {
    if (!item[children]) item[children] = [] as any
    map[item[id]] = item
  })
  list.forEach((item) => {
    const parent = map[item[parentId]]
    if (parent) parent[children].push(item)
    else treeList.push(item)
  })
  return treeList
}

// 树形转数组结构
export const treeToArray = <T extends Record<string, any>>(
  tree: T[],
  children = 'children',
  callback?: (item?: T, parentNode?: T, level?: number) => T,
  level = 1,
  parentNode?: T,
  temp: T[] = []
) => {
  tree.forEach((item) => {
    if (callback) item = callback(item, parentNode, level) ?? item
    if (item[children] && (item[children] as T[]).length > 0)
      temp.push(...treeToArray<T>(item[children] as T[], children, callback, level + 1, item))
    delete temp[temp.push(item) - 1][children]
  })
  return temp
}

// 过滤树形节点
export const treeFilter = <T extends Record<string, any>>(
  tree: T[],
  callback: (item: T, level?: number) => boolean,
  children: keyof T = 'children',
  temp: T[] = [],
  level = 1
): T[] => {
  tree.forEach((item, index) => {
    if (!callback(item, level)) return
    const length = temp.push(item)
    if (tree[index][children]?.length > 0) {
      temp[length - 1][children] = treeFilter<T>(
        tree[index][children] as T[],
        callback,
        children,
        [],
        level + 1
      ) as T[keyof T]
    }
  })
  return temp
}

// 查找指定树形节点
export const treeFind = <T extends Record<string, any>>(
  tree: T[],
  callback: (item: T, level?: number) => boolean,
  children = 'children',
  level = 1
) => {
  for (const item of tree) {
    if (callback(item, level)) return item
    let result: T
    if (item[children]?.length > 0) {
      result = treeFind<T>(item[children], callback, children, level + 1) as any
      if (result) return result
    }
  }
}

// 休眠
export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

// 数字转中文
export const numToChinese = (num: number) => {
  const chineseNum = ['零', '一', '二', '三', '四', '五', '六', '七', '八', '九']
  const chineseUnit = ['', '十', '百', '千', '万', '亿']
  const str = num.toString()
  let result = ''
  for (let i = 0; i < str.length; i++) {
    const n = str[i]
    const unit = chineseUnit[str.length - 1 - i]
    if (n === '0') {
      if (result.endsWith('零')) {
        continue
      } else {
        if (unit !== '十' && i !== str.length - 1 && str[i + 1] !== '0') {
          result += '零'
        }
      }
    } else {
      result += chineseNum[n] + unit
    }
  }
  return result
}

// 获取样式
export const getStyle = () => {
  let str = ''
  const styles = document.querySelectorAll('style,link')
  for (let i = 0; i < styles.length; i++) {
    str += styles[i].outerHTML
  }
  return str
}

// 选择文件
export const selectFile = async (multiple = false, accept = ''): Promise<File[]> => {
  return new Promise((resolve) => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = accept
    input.multiple = multiple
    input.click()
    input.onchange = function (this: any) {
      resolve([...this.files])
      input.remove()
    }
    input.oncancel = function () {
      input.remove()
      resolve([])
    }
  })
}

// 下载文件
export const downloadFile = (url: string, filename = '') => {
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  link.click()
  link.remove()
}
