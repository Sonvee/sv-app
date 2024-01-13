import { useSvidStore } from '@/store/svid.js'
import { useSysStore } from '@/store/sys'
import { dictList } from '@/service/api/sys'
import { mutations, store } from '@/uni_modules/sv-id-pages/common/store.js'
import { isEmpty } from 'lodash'

/**
 * 刷新获取最新用户信息 - 本地+云端
 * @param {boolean} online 是否联网获取最新用户信息，默认false
 */
export async function storageAuth(online = false) {
  const svidStore = useSvidStore()
  if (online) await mutations.setCompleteInfo()
  const auth = store.userInfo
  if (store.hasLogin && isEmpty(auth)) {
    // 若已经到了，且本地缓存被清理，则重新请求接口获取最新用户信息
    storageAuth(true)
    return
  }
  svidStore.setAuth(auth)
}

export async function storageDicts() {
  const sysStore = useSysStore()
  const dictRes = await dictList()
  sysStore.setDicts(dictRes.data)
}