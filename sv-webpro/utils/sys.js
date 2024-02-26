import {
  useSysStore
} from "@/store/sys"
import {
  isEmpty
} from "lodash-es"
import { dictList } from "@/service/api/sys"
import {
  storageDicts
} from './pinia-storage'

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