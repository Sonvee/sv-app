import { dayjs } from "element-plus";
import pagesJson from '@/pages.json'

/**
 * 时间日期格式化
 */
export function timeFormat(time, format = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(time).format(format)
}

/**
 * 文件手动上传
 */
export async function uploadFile(file, root = 'cloudstorage') {
  const up = await uniCloud.uploadFile({
    filePath: file.path || file.url,
    // cloudPath可由 想要存储的文件夹/文件名 拼接，若不拼文件夹名则默认存储在cloudstorage文件夹中
    // file.name同名会导致报错 policy_does_not_allow_file_overwrite
    cloudPath: `${root}/${file.name}`,
    cloudPathAsRealPath: true
  })
  return up
}

/**
 * 合并对象，只合并原有对象中存在的参数，用法同Object.assign()
 * @param {Object} target 原对象
 * @param {Object} source 要合并覆盖的对象
 */
export function assignOverride(target, source) {
  for (var key in source) {
    if (source.hasOwnProperty(key) && target.hasOwnProperty(key)) {
      target[key] = source[key];
    }
  }
  return target;
}

/**
 * 获取当前是早上、上午、中午、下午、傍晚、晚上、凌晨
 * @param {boolean} isHello 是否开启招呼语
 */
export function getNowTimeName(isHello = false) {
  let result = ''
  let hello = ''
  const hour = dayjs().hour()

  if (hour > 5 && hour <= 8) {
    result = '早上'
    hello = '早上好'
  } else if (hour > 8 && hour <= 11) {
    result = '上午'
    hello = '上午好'
  } else if (hour > 11 && hour <= 13) {
    result = '中午'
    hello = '中午好'
  } else if (hour > 13 && hour <= 17) {
    result = '下午'
    hello = '下午好'
  } else if (hour > 17 && hour <= 18) {
    result = '傍晚'
    hello = '傍晚啦'
  } else if (hour > 18 && hour <= 23) {
    result = '晚上'
    hello = '晚上好'
  } else {
    result = '凌晨'
    hello = '凌晨啦'
  }

  return isHello ? hello : result
}

/**
 * 判断是否是json字符串
 * @param {Object} str 要检查的字符串
 */
export function isJsonString(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

/**
 * 将输入的字符串对象处理成正常对象
 * @param {Object} str 要处理的字符串对象
 * 需要将键名用正则进行""包裹除了，否则会报错
 */
export function parseStringToObject(str) {
  // 修正键名格式
  var fixedString = str.replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":')
  // 转换为对象
  var obj = JSON.parse(fixedString)
  return obj
}

// pages.json路由表匹配
function generateRouteTable(json) {
  var routeTable = [];
  json.pages.forEach(page => {
    routeTable.push({
      url: page.path,
      name: page.style.navigationBarTitleText
    });
  });
  json.subPackages.forEach(subPackage => {
    subPackage.pages.forEach(page => {
      routeTable.push({
        url: `${subPackage.root}/${page.path}`,
        name: page.style.navigationBarTitleText
      });
    });
  });
  return routeTable;
}
export const pageRouteTable = generateRouteTable(pagesJson)