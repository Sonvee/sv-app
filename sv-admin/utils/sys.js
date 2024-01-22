import adminConfig from '@/admin.config.js'
import { appList, dictList, menuList } from '@/service/api/sys.js'
import { cloneDeep, concat, flatMap, isEmpty, omit } from 'lodash-es'
import { useSysStore } from '@/store/sys'
import { storageDicts, } from './pinia-storage'
import { permissionList, roleList } from '@/service/api/svid'
import { useSvidStore } from '@/store/svid'

/**
 * 客户端获取菜单数据，并处理树状结构 - 弃用 议直接在客户端生成树状数据
 * @tutorial https://uniapp.dcloud.net.cn/uniCloud/jql.html#gettree
 * @param {Object} params 分页或筛选参数
 */
export async function buildMenu(params) {
  const menuRes = await menuList(params)
  const list = menuRes?.data || []
  const staticMenu = adminConfig.sideBar.staticMenu
  const flat = list.concat(staticMenu)
  return {
    dynamic: list,
    origin: flat,
    tree: buildTree(cloneDeep(flat)),
  }
}

/**
 * 服务端获取树状菜单数据
 * @tutorial https://uniapp.dcloud.net.cn/uniCloud/jql.html#gettree
 * @param {boolean} tree 生成树形菜单数据，默认为true
 */
export async function getMenu(tree = true) {
  // 获取当前用户权限
  const {
    role,
    permission
  } = uniCloud.getCurrentUserInfo()
  // 遍历角色，取出权限数组合并去重
  const menuRes = await menuList({
    role,
    permission,
    tree
  })
  const list = menuRes?.data || []
  const staticMenu = adminConfig.sideBar.staticMenu
  const result = list.concat(tree ? staticMenu : flattenTree(staticMenu))
  return result
}

/**
 * 获取所有菜单子节点（扁平化子节点）
 */
export async function getMenuNode() {
  // 获取当前用户权限
  const {
    role,
    permission
  } = uniCloud.getCurrentUserInfo()
  // 遍历角色，取出权限数组合并去重
  const menuRes = await menuList({
    role,
    permission
  })
  const list = menuRes?.data || []
  const staticMenu = adminConfig.sideBar.staticMenu
  const result = list.concat(staticMenu)
  return flattenTreeNode(result)
}

// 菜单树状数据构建 - 建议直接在服务端生成树状数据
function buildTree(items, parent_id = '') {
  let tree = []
  for (let i = 0; i < items.length; i++) {
    if (items[i].parent_id === parent_id) {
      let children = buildTree(items, items[i].menu_id)
      if (children.length > 0) {
        items[i].children = children
      }
      tree.push(items[i])
    }
  }
  return tree
}

// 树状菜单扁平化
function flattenTree(tree) {
  return flatMap(tree, function(node) {
    return concat(omit(node, 'children'), flattenTree(node.children));
  });
}

// 树状子菜单扁平化
function flattenTreeNode(tree) {
  return flatMap(tree, (item) => {
    if (item.children && item.children.length > 0) {
      return flattenTreeNode(item.children);
    } else {
      return [item];
    }
  });
}

/**
 * 点击菜单或url处理跳转路径
 * @param {Object} url 要跳转的路径
 */
export function clickMenuItem(url) {
  // url容错处理
  if (!url) {
    url = adminConfig.error.notfound
  }
  // 外链
  if (url.indexOf('http') === 0) {
    return window.open(url)
  }
  // url 开头可用有 / ，也可没有
  if (url[0] !== '/' && url.indexOf('http') !== 0) {
    url = '/' + url
  }
  if (url === '/') {
    url = adminConfig.index.url
  }
  uni.redirectTo({
    url: url,
    fail: () => {
      uni.showModal({
        title: '提示',
        content: '页面 ' + url + ' 跳转失败',
        showCancel: false
      })
    }
  })
}

/**
 * 菜单url根据menu_id检索 - 弃用
 * @param {Object} data 树状菜单
 * @param {Object} id 菜单的menu_id
 */
export function findUrlByMenuId(data, id) {
  let result = [];
  data.forEach(function(item) {
    if (item.menu_id === id) {
      result.push(item.url);
    } else if (item.children && item.children.length > 0) {
      let childResult = findUrlByMenuId(item.children, id);
      if (childResult) {
        result.push(childResult);
      }
    }
  });
  return result.length > 0 ? result[0] : null;
}

/**
 * 本地字典提取 - 结合新版服务器缓存字典使用
 * @param {string} dict_id 字典id
 * @param {boolean} mapType 字典类型 true时转换为键值对，false时为数组形式，默认false
 */
function findDictById(dict_id, mapType = false) {
  let result
  const sysStore = useSysStore()
  let localDicts = sysStore.getDicts()
  let findDict = localDicts.find(item => item.dict_id === dict_id)
  if (isEmpty(findDict?.dict)) {
    // 自动从服务器缓存字典
    storageDicts()
    return
  }
  if (mapType) {
    result = handleMap(findDict.dict)
  } else {
    result = findDict.dict
  }
  return result
}

/**
 * 字典提取新版 - 结合本地与服务器缓存
 * @param {string} dict_id 字典id
 * @param {boolean} mapType 字典类型 true时转换为键值对，false时为数组形式，默认false
 */
export async function getDictById(dict_id, mapType = false) {
  let result = findDictById(dict_id, mapType)
  if (isEmpty(result)) {
    const dictRes = await dictList({
      name: dict_id
    })
    const dict = dictRes?.data && dictRes?.data[0].dict || []
    if (mapType) {
      result = handleMap(dict)
    } else {
      result = dict
    }
  }
  return result
}

/**
 * 获取角色缓存数据 - 本地与服务端结合版
 */
export async function getRoleFromCache() {
  // 默认从本地缓存中取
  const svidStore = useSvidStore()
  let result = svidStore.getRoles()
  if (isEmpty(result)) {
    // 缓存丢失，从服务器获取
    const res = await roleList()
    result = res.data || []
    // 存入本地缓存，下次直接读取，节约服务器资源
    svidStore.setRoles(res.data)
  }
  return result
}

/**
 * 获取权限缓存数据 - 本地与服务端结合版
 */
export async function getPermissionFromCache() {
  // 默认从本地缓存中取
  const svidStore = useSvidStore()
  let result = svidStore.getPermissions()
  if (isEmpty(result)) {
    // 缓存丢失，从服务器获取
    const res = await permissionList()
    result = res.data || []
    // 存入本地缓存，下次直接读取，节约服务器资源
    svidStore.setPermissions(res.data)
  }
  return result
}

/**
 * 获取App列表缓存数据 - 本地与服务端结合版
 */
export async function getAppFromCache() {
  // 默认从本地缓存中取
  const sysStore = useSysStore()
  let result = sysStore.getApps()
  if (isEmpty(result)) {
    // 缓存丢失，从服务器获取
    const res = await appList()
    result = res.data || []
    // 存入本地缓存，下次直接读取，节约服务器资源
    sysStore.setApps(res.data)
  }
  return result
}

/**
 * 将标准数组转换为对象
 * @param {Object} arr 标准数组[{key:'a', value:'1'},{key:'b', value:'2'}...]
 * @return 对象{a:'1',b:'2',...}
 */
function handleMap(arr) {
  // return arr.reduce((acc, cur) => {
  //   acc[cur.key] = cur.value
  //   return acc
  // }, {})
  return Object.fromEntries(arr.map((obj) => [obj.key, obj.value]))
}

/**
 * 主题皮肤切换
 * 1. 给html根标签标记自定义属性 data-theme = light / dark 等
 * 2. 使用scss变量切换对应的整套主题
 * @param {Object} theme 主题名 light / dark
 */
export function changeTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  // 将主题缓存
  const sysStore = useSysStore()
  sysStore.setThemes(theme)
}


/**
 * token失效失败等，401跳转重新登录 - 【废弃】uni-id中已自带跳转登录，无效手动处理
 * @param {object} data 接口返回的路由鉴权结果
 */
export function inUnauthorized(data) {
  // 获取当前页面路由
  let pages = getCurrentPages(); // 获取所有页面栈的实例数组
  let currentPage = pages[pages.length - 1]; // 获取最后一个页面的实例
  let currentRoute = '/' + currentPage.route; // 获取当前页面的路由
  // console.log('获取当前页面路由', currentRoute); // 打印当前页面的路由 无"/"前缀
  // 当前页面不是登录页时才跳转至登录页，防止重复跳转
  if (adminConfig.index.url !== currentRoute) {
    uni.showToast({
      icon: "error",
      title: data.message || '请重新登录'
    })
    getApp().$svIdPagesStore.mutations.logout()
  }
}