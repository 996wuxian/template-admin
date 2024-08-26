import axios from 'axios'
import type {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig
} from 'axios'
import { Session } from '@/utils/storage'
import qs from 'qs'
import { $showLoading, $hideLoading, $msg } from '@/config/interaction.config'

export interface response<T> {
  code: number
  data: T
  msg: string
  page: number
  pageSize: number
  totalCount: number
}

interface requestConfig extends AxiosRequestConfig {
  showLoading?: boolean
  showMsg?: boolean
}

interface requestInternalConfig extends InternalAxiosRequestConfig {
  showLoading?: boolean
  showMsg?: boolean
}

interface responseConfig extends AxiosResponse {
  config: requestInternalConfig
}

const responseHandlers: any = {
  '4': (msg: string) => {
    $msg({
      type: 'warning',
      msg
    })
  },
  '5': (msg: string) => {
    $msg({
      type: 'error',
      msg
    })
  },
  403: () => {
    $msg({
      type: 'info',
      msg: '暂无访问该接口权限'
    })
  },
  401: () => {
    Session.clear()
    $msg({
      type: 'info',
      msg: '暂无访问该接口权限'
    })
    setTimeout(() => {
      window.location.href = '/' // 去登录页
    }, 1000)
  },
  default: (msg: string) => {
    $msg({
      type: 'success',
      msg
    })
  }
}

// 配置新建一个 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 50000,
  headers: { 'Content-Type': 'application/json' },
  paramsSerializer: {
    serialize(params) {
      return qs.stringify(params, { allowDots: true })
    }
  },
  withCredentials: true
})

// 添加请求拦截器
service.interceptors.request.use(
  (config: requestInternalConfig) => {
    if (config.showLoading === null || config.showLoading === undefined) config.showLoading = true
    if (config.showLoading) {
      $showLoading()
    }
    if (Session.get('token')) {
      config.headers!['Authorization'] = `Bearer ${Session.get('token')}`
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 添加响应拦截器
service.interceptors.response.use(
  (response: responseConfig) => {
    // 对响应数据做点什么
    $hideLoading()
    const res = response.data
    let showMsg = true
    if (response.config.showMsg === false) showMsg = false

    if (showMsg) {
      const handlerKey = res?.code?.toString().slice(0, 1) || 'default'
      const handler = responseHandlers[handlerKey] || responseHandlers.default
      handler(res.msg)
    }
    return Promise.resolve(res)
  },
  (error) => {
    // 对响应错误做点什么
    $hideLoading()
    const handler = responseHandlers[error.response.status] || responseHandlers.default
    handler()
    return Promise.reject(error)
  }
)

const request = async <T>(config: requestConfig): Promise<response<T>> => {
  return service(config)
}

// 导出 axios 实例
export default request
