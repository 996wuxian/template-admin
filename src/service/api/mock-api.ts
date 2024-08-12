import request from '@/service/request'

const module = '/api/user/'

export function Login(data: any, showLoading: boolean = false, showMsg: boolean = false) {
  return request<any>({
    method: 'post',
    url: `${module}login`,
    data,
    showLoading
  })
}

export function UserList(showLoading: boolean = false, showMsg: boolean = false) {
  return request<any>({
    method: 'get',
    url: `${module}userList`,
    showLoading,
    showMsg
  })
}
export function MenuList(showLoading: boolean = false, showMsg: boolean = false) {
  return request<any>({
    method: 'get',
    url: `${module}menuList`,
    showLoading,
    showMsg
  })
}
