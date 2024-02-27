import {
  createRouter,
  createWebHashHistory
} from 'vue-router'

/**
 * 路由规则 - 约束规范：
 * 1. tab属性用于表示路由是否属于tabbar页面
 *    {
 *      index: 0, // tabbar顺序 必填
 *      icon: '', // tabbar页面默认图标iconfont 必填
 *      activeIcon: '', // tabbar页面激活图标iconfont 必填
 *      color: '#66ccff', // 字体默认颜色
 *      activeColor: '#007aff' // 字体激活颜色
 *    }
 * 2. nav属性用于表示路由是否属于navbar页面
 *    {
 *      index: 0, // navbar顺序 必填
 *      icon: '', // navbar页面默认图标iconfont 必填
 *      activeIcon: '', // navbar页面激活图标iconfont 必填
 *      color: '#66ccff', // 字体默认颜色
 *      activeColor: '#007aff' // 字体激活颜色
 *    }
 * 3. keepAliveName属性用于表示keep-alive缓存页面，要求和页面vue文件名一致且唯一，因此定义页面时禁止重名
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
      tab: {
        index: 0,
        icon: 'sv-icons-github',
        activeIcon: 'sv-icons-github',
        color: '#66ccff',
        activeColor: '#007aff'
      },
      nav: {
        index: 0,
        icon: 'sv-icons-github',
        activeIcon: 'sv-icons-github',
        color: '#66ccff',
        activeColor: '#007aff'
      },
      keepAliveName: 'home'
    },
    component: () => import('@/pages/home/home.vue'),
  },
  {
    path: '/pages/about/about',
    name: '关于',
    meta: {
      nav: {
        index: 2,
        icon: 'sv-icons-github',
        activeIcon: 'sv-icons-github',
        color: '#66ccff',
        activeColor: '#007aff'
      },
      keepAliveName: 'about'
    },
    component: () => import('@/pages/about/about.vue'),
  },
  {
    path: '/pages/mine/mine',
    name: '我的',
    meta: {
      tab: {
        index: 1,
        icon: 'sv-icons-gitee',
        activeIcon: 'sv-icons-gitee',
        color: '#66ccff',
        activeColor: '#007aff'
      },
      nav: {
        index: 1,
        icon: 'sv-icons-gitee',
        activeIcon: 'sv-icons-gitee',
        color: '#66ccff',
        activeColor: '#007aff'
      },
      keepAliveName: 'mine'
    },
    component: () => import('@/pages/mine/mine.vue'),
  }
]

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router