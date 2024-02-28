export default {
  login: {
    url: '/uni_modules/sv-id-pages/pages/login/login-web' // 登录页面路径
  },
  index: {
    url: '/pages/index' // 入口页
  },
  error: {
    notfound: '/pages/error/404', // 404 Not Found
    forbidden: '/pages/error/403', // 403 Forbidden
  },
  navBar: { // 顶部导航
    themes: [{
      text: '白昼',
      value: 'light'
    }, {
      text: '暗夜',
      value: 'dark'
    }],
  },
  noBar: [
    '/uni_modules/sv-id-pages/pages/login/login-web', // 登录
    '/uni_modules/sv-id-pages/pages/agreements/service', // 用户服务协议
    '/uni_modules/sv-id-pages/pages/agreements/privacy', // 隐私政策条款
  ],
  adminUrl: {
    url: 'tatic-mp-74bfcbac-6ba6-4f39-8513-8831390ff75a.next.bspapp.com/admin/'
  }
}