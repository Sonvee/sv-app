import { useSysStore } from "@/store/sys"
import { useSvidStore } from "@/store/svid"
import { isEmpty } from "lodash"
import { storageAuth, storageDicts } from "./pinia-storage"
import { dictList } from "@/service/api/sys"

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
 * 获取账号缓存数据 - 本地与服务端结合版
 */
export async function getAuthFromCache() {
  // 默认从本地缓存中取
  const svidStore = useSvidStore()
  let result = svidStore.getAuth()
  if (isEmpty(result)) {
    // 缓存丢失，从服务器获取
    await storageAuth()
    result = svidStore.getAuth()
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