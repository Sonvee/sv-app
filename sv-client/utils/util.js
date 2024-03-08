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