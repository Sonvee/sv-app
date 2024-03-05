import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

/**
 * 路由规则 - 约束规范：
 * 1. bar属性用于表示路由是否属于tabbar/navbar页面
 *    {
 *      tab: true, // tabbar是否开启
 *      nav: true, // navbar是否开启
 *      tabIndex: 0, // tabbar顺序
 *      navIndex: 0, // navbar顺序
 *      icon: '', // tabbar/navbar页面默认图标iconfont
 *      activeIcon: '', // tabbar/navbar页面激活图标iconfont
 *      color: '#66ccff', // 字体默认颜色
 *      activeColor: '#007aff' // 字体激活颜色
 *    }
 * 2. keepAliveName属性用于表示keep-alive缓存页面，要求和页面vue文件名一致且唯一，因此定义页面时禁止重名
 */
const routes = [{
    // 路由重定向
    path: '/',
    redirect: '/pages/home/home'
  },
  {
    // 路由重定向
    path: '/index',
    redirect: '/pages/home/home'
  },
  {
    path: '/pages/home/home',
    name: '首页',
    meta: {
      permission: [],
      enable: true,
      keepAliveName: "home",
      bar: {
        tab: true,
        nav: true,
        tabIndex: 0,
        navIndex: 0,
        icon: 'sv-icons-github',
        activeIcon: 'sv-icons-github',
        color: '#66ccff',
        activeColor: '#007aff'
      },
    },
    component: () => import('@/pages/home/home.vue'),
  },
  {
    path: '/pages/mine',
    children: [{
        path: 'mine',
        name: '我的',
        meta: {
          permission: [],
          enable: true,
          keepAliveName: "mine",
          bar: {
            tab: true,
            nav: true,
            tabIndex: 1,
            navIndex: 1,
            icon: 'sv-icons-gitee',
            activeIcon: 'sv-icons-gitee',
            color: '#66ccff',
            activeColor: '#007aff'
          },
        },
        component: () => import('@/pages/mine/mine.vue'),
      },
      {
        path: 'setting',
        name: '设置',
        meta: {
          permission: [],
          enable: true,
          keepAliveName: "setting",
          bar: {
            tab: true,
            nav: true,
            tabIndex: 2,
            navIndex: 2,
            icon: 'sv-icons-gitee',
            activeIcon: 'sv-icons-gitee',
            color: '#66ccff',
            activeColor: '#007aff'
          },
        },
        component: () => import('@/pages/mine/setting.vue'),
      },
    ]
  },
  {
    path: '/uni_modules/sv-id-pages/pages/login/login-web',
    name: '登录',
    component: () => import('@/uni_modules/sv-id-pages/pages/login/login-web.vue')
  },
  {
    path: '/uni_modules/sv-id-pages/pages/agreements/service',
    name: '用户服务协议',
    component: () => import('@/uni_modules/sv-id-pages/pages/agreements/service.vue')
  },
  {
    path: '/uni_modules/sv-id-pages/pages/agreements/privacy',
    name: '隐私政策条款',
    component: () => import('@/uni_modules/sv-id-pages/pages/agreements/privacy.vue')
  }
]

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router