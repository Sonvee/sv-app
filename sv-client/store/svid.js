import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSvidStore = defineStore('svid', () => {
  // 当前登录用户
  const auth = ref({})

  function setAuth(user) {
    auth.value = user
  }

  function getAuth() {
    return auth.value
  }

  function clearAuth() {
    auth.value = {}
  }

  return {
    auth,
    setAuth,
    getAuth,
    clearAuth,
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})