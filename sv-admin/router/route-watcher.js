import { isEmpty } from 'lodash-es';
import adminConfig from '@/admin.config.js'
import pagesJson from '@/pages.json'

/**
 * 路由鉴权规则：
 * 1. admin拥有所有权限
 * 2. master拥有管理员权限，核心页面不开放，重定向至403
 * 3. user只有普通用户权限，只展示白名单页面，其他页面均重定向至403
 */

// 白名单页面
const WHILE_LIST = [
  '/', // 首页
  adminConfig.index.url, // 首页完整路径
  adminConfig.error.notfound, // 403
  adminConfig.error.forbidden, // 404
  adminConfig.login.url, // 登录页一定要在白名单中，否则会导致登录与403之间无限循环跳转
  '/pages/tool/mine/mine',
  '/pages/tool/cache/cache',
  '/pages/static-page/table-template/table-template',
  '/pages/static-page/icons/icons',
];

// 核心页面
const CORE_LIST = [
  '/pages/system/user/user',
  '/pages/system/role/role',
  '/pages/system/permission/permission',
]

// 只对管理员开放页面
const ADMIN_LIST = [
  '/pages/tool/apidoc/apidoc',
]

/**
 * 全局路由监听者
 * 由于路由守卫无法动态监听地址栏搜索
 * 故使用全局路由监听者用于页面鉴权、页面404重定向等
 * @param {Object} route 当前路由对象
 */
export function routeWatcher(route) {
  // console.log('routeWatcher --->', route);

  // 页面不存在，重定向至404页
  if (route.matched?.length <= 0) {
    uni.redirectTo({
      url: adminConfig.error.notfound,
    })
    return
  }

  // 无需登录的开放页面不用进行后续操作
  const regex = new RegExp(pagesJson.uniIdRouter.needLogin[0]);
  if (!regex.test(route.path)) return

  // 页面鉴权
  const { role, permission } = uniCloud.getCurrentUserInfo()

  if (isEmpty(role) && route.path !== adminConfig.login.url) {
    // 角色丢失，需要重新登录，重定向至登录页
    uni.redirectTo({
      url: adminConfig.login.url
    })
    return
  }

  // 路由鉴权
  if (role.includes('admin')) {
    // admin拥有所有权限
    return

  } else if (role.includes('master')) {
    // master拥有管理员权限，核心页面不开放，重定向至403
    if (CORE_LIST.includes(route.path)) {
      // 重定向至403页
      uni.redirectTo({
        url: adminConfig.error.forbidden
      })
      return
    }

  } else if (role.includes('visitor')) {
    // 游客权限，除ADMIN_LIST外其他页面均开放，但是要配合接口做数据权限限制，只读不写
    if (ADMIN_LIST.includes(route.path)) {
      // 重定向至403页
      uni.redirectTo({
        url: adminConfig.error.forbidden
      })
      return
    }

  } else {
    // 普通用户权限，只展示白名单页面，其他页面均重定向至403
    if (!WHILE_LIST.includes(route.path)) {
      // 重定向至403页
      uni.redirectTo({
        url: adminConfig.error.forbidden
      })
      return
    }

  }
}