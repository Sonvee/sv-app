import { importToJson, exportToExcel } from '@/uni_modules/sv-excel-json-each/jssdk/parseExcel.js'
import { dayjs } from 'element-plus'
import { appAddList } from '../service/api/sys';

/**
 * 键名转换 - 中->英
 * @param {Object} data 导入表的原始数据
 * @param {Object} keyMap 表mapping
 */
function replaceMapKey(data, keyMap) {
  return data.map(item => {
    return Object.keys(item).reduce((acc, key) => {
      let newKey = Object.entries(keyMap).find(([k, v]) => v === key)
      if (newKey && newKey[0]) {
        acc[newKey[0]] = item[key];
      } else {
        throw new Error(`表中数据表头【${key}】未找到mapping中对应键值`);
      }
      return acc;
    }, {});
  });
}

/**
 * 日志导出
 * @param {Object} data 接口原数据
 */
const logMapping = {
  uid: '用户ID',
  nickname: '用户昵称',
  ip: 'IP地址',
  appid: '登录客户端',
  type: '操作类型',
  state: '状态',
  device_id: '设备唯一标识',
  userAgent: 'userAgent',
  create_date: '操作时间',
}
export function logExport(data) {
  const handleData = data.map((item) => {
    return {
      uid: item.user_id && item.user_id[0]?._id,
      nickname: item.user_id && item.user_id[0]?.nickname,
      ip: item.ip,
      appid: item.appid,
      type: item.type,
      state: item.state ? '成功' : '失败',
      device_id: item.device_id,
      userAgent: item.ua,
      create_date: dayjs(item.create_date).format('YYYY-MM-DD HH:mm:ss'),
    }
  })
  exportToExcel({
    params: {
      data: handleData,
      title: 'logs',
      mapping: logMapping,
      type: 'file',
      // merges: [{ start: [0, 1], end: [0, 4] }]
    },
    autoDownload: true,
  }).then((res) => {
    console.log('onExport ===>', res)
  })
}


/**
 * 应用导出
 */
const appMapping = {
  icon_url: '图标',
  appid: '应用ID',
  name: '应用名称',
  description: '应用描述',
  introduction: '应用简介',
  create_date: '创建时间',
}
export function appExport(data) {
  const handleData = data.map((item) => {
    return {
      icon_url: item.icon_url,
      appid: item.appid,
      name: item.name,
      description: item.description,
      introduction: item.introduction,
      create_date: dayjs(item.create_date).format('YYYY-MM-DD HH:mm:ss'),
    }
  })
  exportToExcel({
    params: {
      data: handleData,
      title: 'app',
      mapping: appMapping,
      type: 'file',
      // merges: [{ start: [0, 1], end: [0, 4] }]
    },
    autoDownload: true,
  }).then((res) => {
    console.log('onExport ===>', res)
  })
}

/**
 * 应用导入
 */
export async function appImport(callback) {
  let sheetList = [{ index: 0 }, { index: 1 }]
  const toJsonRes = await importToJson(sheetList)
  const dataRes = toJsonRes.data.data || []
  // 转换为接口原数据格式
  const handleData = dataRes.map((item) => {
    return {
      icon_url: item['图标'],
      appid: item['应用ID'],
      name: item['应用名称'],
      description: item['应用描述'],
      introduction: item['应用简介'],
      create_date: dayjs(item['创建时间']).valueOf(),
    }
  })
  const importRes = await appAddList({ data: handleData, cover: false })
  if (callback) callback(importRes)
}