// mock.js
// http://mockjs.com/examples.html#DPD
import Mock from 'mockjs'
const Random = Mock.Random
import qs from 'qs'
Mock.mock(/\/api\/random/, function (options: any) {
  var str = options.url.slice(options.url.indexOf('?') + 1)
  var elem = qs.parse(str)
  return Mock.mock({
    status: 0,
    ename: elem.name,
    'list|10': [
      {
        'id|+1': 1234, //id 从1234累加
        name: '@cname', //随机中文姓名
        'age|1-200': 1, //1-200间的随机整数
        'price|200-500.2-5': 1, //200-500间 随机2-5位小数
        'star|1-5': '★', //随机1-5个★
        'chart|2': 'hello', //字符串重复两次
        'love|1': true, //随机布尔值
        'arr|1': ['a', 'b', 'c', 'd'], //随机数组中的一项
        obj: {
          'h|150-165': 1,
          'weight|85-120': 1,
          'money|1000-9999': 1
        },
        tel: /1\d{10}/, //可接收正则
        pic: function () {
          //随机演示图片
          return Mock.Random.dataImage('200x100', this.name)
        },
        date: '@date(yyyy/MM/dd)', //随机日期
        time: '@time', //Mock.Random.time()//随机时间
        pdate: '@datetime()', //随机日期和时间
        now: '@now()', //当前日期和时间
        das: '@cparagraph(1, 3)', //随机一段话
        keyword: '@cword(3, 5)', //随机2-5个子
        email: /[\w\d]{8,12}\@(126|163|qq)\.(com|cn|org)/, //正则 邮箱格式
        ip: '@ip()', //随机ip
        address: '@county(true)' //随机省市区
      }
    ]
  })
})

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
Mock.mock('/api/user/list', 'get', {
  msg: '获取用户列表成功',
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
