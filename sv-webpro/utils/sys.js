import {
  useSysStore
} from "@/store/sys"
import {
  concat,
  flatMap,
  isEmpty,
  omit
} from "lodash-es"
import {
  dictList,
  menuList
} from "@/service/api/sys"
import {
  storageDicts
} from './pinia-storage'
import webproConfig from "../webpro.config"

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
 * 将标准数组转换为对象
 * @param {Object} arr 标准数组[{key:'a', value:'1'},{key:'b', value:'2'}...]
 * @return 对象{a:'1',b:'2',...}
 */
export function handleMap(arr, keyName = "key", valueName = "value") {
  return Object.fromEntries(arr.map((obj) => [obj[keyName], obj[valueName]]))
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
 * 处理树状列表 - 弃用
 * @param {Object} arr 要处理的数组列表
 * @param {Object} rootkey 节点字段 默认id
 * @param {Object} subkey 分级子节点字段 默认parent
 * 说明：根据子节点的subkey去寻找是否在与之相同rootkey的父级节点下
 */
export function handleTree(arr, rootkey = "id", subkey = "parent") {
  // 先找到所有的根节点（parent为空的项）
  const roots = arr.filter(item => !item[subkey]);
  // 然后通过遍历数组，利用reduce方法构建父子关系
  const tree = roots.reduce((acc, root) => {
    // 递归收集子节点
    const collectChildren = (items, parentId) =>
      items.reduce((children, item) => {
        if (item[subkey] === parentId) {
          const node = {
            ...item
          };
          node.children = collectChildren(arr, item[rootkey]);
          children.push(node);
        }
        return children;
      }, []);
    root.children = collectChildren(arr, root[rootkey]);
    acc.push(root);
    return acc;
  }, []);
  return tree;
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
    tree,
    dbname: 'sv-web-menus'
  })
  const list = menuRes?.data || []
  // 处理，将相关元参数放入meta中
  const handelList = handleMenuToRoute(list)
  console.log('==== handelList :', handelList);
  const staticMenu = webproConfig.staticRoutes
  const result = handelList.concat(tree ? staticMenu : flattenTree(staticMenu))
  return result
}

// 树状菜单扁平化
function flattenTree(tree) {
  return flatMap(tree, function(node) {
    return concat(omit(node, 'children'), flattenTree(node.children));
  });
}

/**
 * 将菜单表转换为路由表
 * @param {Array} menuData
 */
function handleMenuToRoute(menuData) {
  return menuData.map(menu => {
    const transformedMenu = {
      _id: menu._id,
      path: menu.url,
      name: menu.name,
      component: () => import(`${menu.url}.vue`), // 这里假设component需要根据path或者其他规则动态设置，或者保持为空字符串
      children: menu.children && menu.children.length > 0 ? handleMenuToRoute(menu.children) : [],
      meta: {}
    };
    // 将指定属性之外的所有属性放入meta对象中
    Object.keys(menu).forEach(key => {
      if (['_id', 'path', 'url', 'name', 'component', 'children'].indexOf(key) === -1) {
        transformedMenu.meta[key] = menu[key];
      }
    });
    return transformedMenu;
  });
}

/**
 * 处理navbar页面
 * @param {Object} routes 路由
 */
export function handleNavbar(routes) {
  // navbar页面必须在根节点，不能在children子节点中，否则将不会显示
  return routes.filter(item => !isEmpty(item.meta.navbar))
}

/**
 * 处理tabbar页面
 * @param {Object} routes 路由
 */
export function handleTabbar(routes) {
  // tabbar页面必须在根节点，不能在children子节点中，否则将不会显示
  return routes.filter(item => !isEmpty(item.meta.tabbar))
}