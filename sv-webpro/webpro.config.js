export default {
  login: {
    url: '/uni_modules/sv-id-pages/pages/login/login-web' // 登录页面路径
  },
  index: {
    url: '/pages/index' // 入口页
  },
  home: {
    url: '/pages/home/home' // 主页
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
  // 静态路由
  staticRoutes: [
    // {
    //   path: '/pages/home/home',
    //   name: '首页',
    //   meta: {
    //     tab: {
    //       index: 0,
    //       icon: 'sv-icons-github',
    //       activeIcon: 'sv-icons-github',
    //       color: '#66ccff',
    //       activeColor: '#007aff'
    //     },
    //     nav: {
    //       id: 'nav-id-home',
    //       index: 0,
    //       icon: 'sv-icons-github',
    //       activeIcon: 'sv-icons-github',
    //       color: '#66ccff',
    //       activeColor: '#007aff',
    //       parent: '',
    //     },
    //     keepAliveName: 'home'
    //   },
    //   children: [],
    //   component: () => import('@/pages/home/home.vue'),
    // },
    // {
    //   path: '/pages/about/about',
    //   name: '关于',
    //   meta: {
    //     keepAliveName: 'about'
    //   },
    //   component: () => import('@/pages/about/about.vue'),
    // },
    // {
    //   path: '/pages/mine/mine',
    //   name: '我的',
    //   meta: {
    //     tab: {
    //       index: 1,
    //       icon: 'sv-icons-gitee',
    //       activeIcon: 'sv-icons-gitee',
    //       color: '#66ccff',
    //       activeColor: '#007aff'
    //     },
    //     nav: {
    //       id: 'nav-id-mine',
    //       index: 1,
    //       icon: 'sv-icons-gitee',
    //       activeIcon: 'sv-icons-gitee',
    //       color: '#66ccff',
    //       activeColor: '#007aff',
    //       parent: '',
    //     },
    //     keepAliveName: 'mine'
    //   },
    //   component: () => import('@/pages/mine/mine.vue'),
    // }
  ],
  adminUrl: {
    url: 'tatic-mp-74bfcbac-6ba6-4f39-8513-8831390ff75a.next.bspapp.com/admin/'
  },
  docUrl: {
    url: 'https://gitee.com/Sonve/sv-app'
  }
}