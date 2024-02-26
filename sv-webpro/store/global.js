import {
  defineStore
} from 'pinia'
import {
  ref
} from 'vue'

export const useGlobalStore = defineStore('global', () => {
  const globalNum = ref(0)

  return {
    globalNum
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})