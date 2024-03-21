import {
  importToJson,
  exportToExcel
} from '@/uni_modules/sv-excel-json-each/js_sdk/parseExcel.js'
import {
  dayjs
} from 'element-plus'
import {
  appAddList,
  appList
} from '@/service/api/sys';
import {
  logList
} from '@/service/api/svid';
import {
  cdkeyList
} from '@/service/api/vip';









// ================== 前置工具方法 ==================

/**
 * Excel模板下载
 * @param {string} type 模板类型
 */
export function fileTemplate(type) {
  switch (type) {
    case 'app':
      appTemplate()
      break
  }
}

/**
 * Excel文件导入
 * @param {string} type 文件类型
 * @param {boolean} cover 是否覆盖 默认否
 * @param {Function} callback 回调函数 参数：请求apiAddList返回结果res
 */
export function fileImport(type, cover = false, callback) {
  switch (type) {
    case 'app':
      appImport(cover, (res) => {
        if (callback) callback(res)
      })
      break
  }
}

/**
 * Excel文件导出
 * @param {string} type 文件类型
 * @param {boolean} all 导出当页还是全部 默认当页
 * @param {Object} params 导出接口参数，用于请求数据
 */
export function fileExport(type, all = false, params, callback) {
  let param = {
    ...params
  }
  if (all) param.pagesize = -1
  switch (type) {
    case 'logs':
      logExport(param)
      break
    case 'app':
      appExport(param)
      break
    case 'cdkey':
      cdkeyExport(param)
      break
  }
  if (callback) callback()
}


/**
 * 键名转换 - 中->英 - 暂时弃用
 * @param {Object} data 导入表的原始数据
 * @param {Object} keyMap mapping映射表
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










// ================== 导出 ==================

/**
 * 日志导出
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

async function logExport(params) {
  const dataRes = await logList(params)
  const handleData = dataRes.data?.map((item) => {
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
    // console.log('onExport ===>', res)
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

async function appExport(params) {
  const dataRes = await appList(params)
  const handleData = dataRes.data?.map((item) => {
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
    // console.log('onExport ===>', res)
  })
}


/**
 * 激活码导出
 */
const cdkeyMapping = {
  cdkey: '激活码(CDKEY)',
  bind_plan_name: '绑定套餐名称',
  valid_day: '绑定套餐有效期(天)',
  valid_date: '激活码有效期至',
}

async function cdkeyExport(params) {
  const dataRes = await cdkeyList(params)
  const handleData = dataRes.data?.map((item) => {
    return {
      cdkey: item.cdkey,
      bind_plan_name: item.bind_plan[0].plan_name,
      valid_day: {
        v: item.bind_plan[0].valid_day,
        t: "s",
        s: {
          alignment: {
            horizontal: "left", // 数字列会默认右对齐
          }
        }
      },
      valid_date: {
        v: dayjs(item.valid_date).format('YYYY-MM-DD HH:mm:ss'),
        t: "s",
        s: {
          font: {
            color: {
              rgb: "FF0000" // 有效期列文字标红
            }
          }
        }
      },
    }
  })
  exportToExcel({
    params: {
      data: handleData,
      title: 'cdkey',
      mapping: cdkeyMapping,
      type: 'file',
    },
    autoDownload: true,
  }).then((res) => {
    // console.log('onExport ===>', res)
  })
}










// ================== 导入 ==================

/**
 * 应用导入
 */
async function appImport(cover, callback) {
  let sheetList = [{
    index: 0
  }, {
    index: 1
  }]
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
  console.table(toJsonRes.data);
  console.table(handleData);
  const importRes = await appAddList({
    data: handleData,
    cover
  })
  if (callback) callback(importRes)
}










// ================== 模版 ==================

/**
 * 应用模板
 */
async function appTemplate() {
  exportToExcel({
    params: {
      data: [{
        icon_url: 'https://....',
        appid: '__UNI__80B7BFB',
        name: '应用名称样例',
        description: '应用描述样例',
        introduction: '应用简介样例',
        create_date: '2024-01-22 13:35:00',
      }], // 若空数据数组，需要有个空对象
      title: 'app',
      mapping: appMapping,
      type: 'file',
    },
    autoDownload: true,
  }).then((res) => {
    // console.log('onExport ===>', res)
  })
}