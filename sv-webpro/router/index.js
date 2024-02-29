import {
  createRouter,
  createWebHashHistory
} from 'vue-router'
import svidConfig from '@/uni_modules/sv-id-pages/config.js'
import webproConfig from '@/webpro.config'
import {
  getMenu
} from '@/utils/sys'
import {
  useSysStore
} from '../store/sys'

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
 *      id: '', // id唯一，建议统一为: nav-id-页面vue文件名
 *      index: 0, // navbar顺序 必填 若为子节点，则按子节点顺序
 *      icon: '', // navbar页面默认图标iconfont 必填
 *      activeIcon: '', // navbar页面激活图标iconfont 必填
 *      color: '#66ccff', // 字体默认颜色
 *      activeColor: '#007aff', // 字体激活颜色
 *      parent: '', // 父级菜单id，为空则为根节点
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
  ...webproConfig.staticRoutes,
  ...svidConfig.routes
]

// 创建路由
const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// 创建动态路由
let registerRouteFresh = true
router.beforeEach(async (to, from, next) => {
  // 如果首次或者刷新界面，next(...to, replace: true)会循环遍历路由，如果to找不到对应的路由那么他会再执行一次beforeEach((to, from, next))直到找到对应的路由，我们的问题在于页面刷新以后异步获取数据，直接执行next()感觉路由添加了但是在next()之后执行的，所以我们没法导航到相应的界面。这里使用变量registerRouteFresh变量做记录，直到找到相应的路由以后，把值设置为false然后走else执行next(),整个流程就走完了，路由也就添加完了。
  if (registerRouteFresh) {
    let res = await getMenu()
    res.forEach((item, index) => {
      router.addRoute(item)
    })
    console.log('==== getRoutes :', router.getRoutes());
    useSysStore().setSysRoutes(router.getRoutes())
    next({
      ...to,
      replace: true
    })
    registerRouteFresh = false
  } else {
    next()
  }
})

export default router