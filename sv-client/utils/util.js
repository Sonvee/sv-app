import {
  dayjs
} from "dayjs";
import {
  mutations,
  store
} from '@/uni_modules/sv-id-pages/common/store'

/**
 * 时间日期格式化
 */
export function timeFormat(time, format = "YYYY-MM-DD HH:mm:ss") {
  return dayjs(time).format(format)
}

export function onScan() {
  // #ifndef H5
  uni.scanCode({
    onlyFromCamera: false,
    success: (res) => {
      console.log('==== res :', res)
    },
    fail: (err) => {
      console.log('==== err :', err)
    }
  })
  // #endif
  // #ifdef H5
  uni.showToast({
    title: 'H5端不支持扫码',
    icon: 'none'
  })
  // #endif
}

export function judgeLogin() {
  if (store.hasLogin) return true
  uni.showModal({
    title: '系统提示',
    content: '好像还没有登录哦~',
    showCancel: true,
    cancelText: '就不!',
    confirmText: '去登录',
    success: (e) => {
      if (e.confirm) {
        mutations.logout()
      }
    }
  })
}

/**
 * 节流 - 需要使用闭包来进行隔离
 * @param {Object} toast 提示内容
 * @param {Object} time 节流时长（毫秒）默认2000
 */
let throttleMoment = null
export function useThrottle(toast = '点击太快啦', time = 2000) {
  return function() {
    const now = Date.now()
    if (throttleMoment === null || now - throttleMoment >= time) {
      throttleMoment = Date.now()
      return true
    }
    uni.showToast({
      title: toast,
      icon: 'none',
    })
    return false
  }
}