// mock.js
// http://mockjs.com/examples.html#DPD
import Mock from 'mockjs'
const Random = Mock.Random

// login
Mock.mock('/api/user/login', 'post', function () {
  return {
    msg: '登录成功',
    code: 200,
    data: {
      userInfo: {
        userName: 'wuxian',
        roleId: 1,
        roleName: '超级管理员'
      },
      token: '123123'
    }
  }
})
// user
Mock.mock('/api/user/userList', 'get', {
  msg: '',
  code: 200,
  'data|200': [
    // 生成 200 条数据
    {
      'id|+1': 1, // id 从 1 开始递增
      userName: '@word(4, 6)', // 生成 4 到 6 个字母组成的用户名
      'sex|1': ['0', '1'],
      nickName: '@word(5, 8)', // 生成 5 到 8 个字母组成的昵称
      phone: /^1[385][1-9]\d{8}$/, // 生成随机手机号
      email: '@email', // 生成随机邮箱
      'status|1': ['0', '1'],
      'role|1-3': function () {
        return Mock.mock('@shuffle(["1", "2", "3"])').slice(0, Mock.mock('@integer(1, 3)'))
      }
    }
  ]
})
// role
Mock.mock('/api/user/menuList', 'get', {
  msg: '',
  code: 200,
  data: [
    {
      id: 1,
      parentId: 0,
      title: '首页',
      icon: 'i-solar-home-smile-bold',
      name: 'home',
      url: '/home',
      status: '1',
      hide: '1',
      sort: 1,
      menuType: '1'
    },
    {
      id: 2,
      parentId: 0,
      title: '系统管理',
      icon: 'i-solar-settings-minimalistic-bold-duotone',
      name: 'System',
      url: '/system',
      status: '1',
      hide: '1',
      sort: 2,
      menuType: '0'
    },
    {
      id: 3,
      parentId: 2,
      title: '用户管理',
      icon: 'i-solar-settings-minimalistic-bold-duotone',
      name: 'User',
      url: '/user',
      status: '1',
      hide: '1',
      sort: 3,
      menuType: '1'
    },
    {
      id: 4,
      parentId: 2,
      title: '角色管理',
      icon: 'i-solar-settings-minimalistic-bold-duotone',
      name: 'Role',
      url: '/role',
      status: '1',
      hide: '1',
      sort: 4,
      menuType: '1'
    },
    {
      id: 5,
      parentId: 2,
      title: '菜单管理',
      icon: 'i-solar-settings-minimalistic-bold-duotone',
      name: 'Menu',
      url: '/menu',
      status: '1',
      hide: '1',
      sort: 5,
      menuType: '1'
    }
  ]
})
