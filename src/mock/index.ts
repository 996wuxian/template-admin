// mock.js
// http://mockjs.com/examples.html#DPD
import Mock from 'mockjs'
const Random = Mock.Random

// login
Mock.mock('/api/user/login', 'post', function (e: any) {
  const { userName } = JSON.parse(e.body)
  let userInfo = {} as any
  if (userName === 'user') {
    userInfo = {
      userName,
      roleId: 3,
      roleName: '普通用户'
    }
  }
  if (userName === 'admin') {
    userInfo = {
      userName,
      roleId: 2,
      roleName: '管理员'
    }
  }
  if (userName === 'sadmin') {
    userInfo = {
      userName,
      roleId: 1,
      roleName: '超级管理员'
    }
  }

  return {
    msg: '登录成功',
    code: 200,
    data: {
      userInfo: userInfo,
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
      path: '/',
      name: 'Root',
      url: 'Layout',
      status: '1',
      hide: true,
      sort: 1,
      menuType: '0',
      roles: ['1', '2', '3']
    },
    {
      id: 2,
      parentId: 1,
      title: '首页',
      icon: 'i-solar-home-smile-bold',
      path: '/home',
      name: 'Home',
      url: '/home/index.vue',
      status: '1',
      hide: false,
      sort: 2,
      menuType: '1',
      roles: ['1', '2', '3']
    },
    {
      id: 3,
      parentId: 0,
      title: '系统管理',
      icon: 'i-solar-settings-minimalistic-bold-duotone',
      path: '/system',
      name: 'System',
      url: 'Layout',
      status: '1',
      hide: false,
      sort: 3,
      menuType: '0',
      roles: ['1', '2']
    },
    {
      id: 4,
      parentId: 3,
      title: '用户管理',
      icon: 'i-solar-user-bold-duotone',
      path: '/system/user',
      name: 'User',
      url: '/user/index.vue',
      status: '1',
      hide: false,
      sort: 4,
      menuType: '1',
      roles: ['1', '2']
    },
    {
      id: 5,
      parentId: 3,
      title: '角色管理',
      icon: 'i-solar-user-plus-bold-duotone',
      path: '/system/role',
      name: 'Role',
      url: '/role/index.vue',
      status: '1',
      hide: false,
      sort: 5,
      menuType: '1',
      roles: ['1', '2']
    },
    {
      id: 6,
      parentId: 3,
      title: '菜单管理',
      icon: 'i-solar-widget-4-bold-duotone',
      path: '/system/menu',
      name: 'Menu',
      url: '/menu/index.vue',
      status: '1',
      hide: false,
      sort: 6,
      menuType: '1',
      roles: ['1', '2']
    },
    {
      id: 7,
      parentId: 0,
      title: '切换权限',
      icon: 'i-solar-square-transfer-horizontal-bold',
      path: '/change-role-page',
      name: 'ChangeRolePage',
      url: 'Layout',
      status: '1',
      hide: true,
      sort: 7,
      menuType: '0',
      roles: ['1', '2', '3']
    },
    {
      id: 8,
      parentId: 7,
      title: '切换权限',
      icon: 'i-solar-square-transfer-horizontal-bold',
      path: '/change-role',
      name: 'ChangeRole',
      url: '/change-role/index.vue',
      status: '1',
      hide: false,
      sort: 8,
      menuType: '1',
      roles: ['1', '2', '3']
    },
    {
      id: 9,
      parentId: 0,
      title: '超级管理员可见',
      icon: 'i-solar-settings-minimalistic-bold-duotone',
      path: '/text-sadmin-page',
      name: 'TextAadmin',
      url: 'Layout',
      status: '1',
      hide: true,
      sort: 9,
      menuType: '0',
      roles: ['1']
    },
    {
      id: 10,
      parentId: 9,
      title: '超级管理员可见',
      icon: 'i-solar-settings-minimalistic-bold-duotone',
      path: '/text-sadmin',
      name: 'TextAadmin',
      url: '/text-sadmin/index.vue',
      status: '1',
      hide: false,
      sort: 10,
      menuType: '1',
      roles: ['1']
    }
  ]
})
