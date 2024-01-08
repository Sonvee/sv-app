import {
  defineStore
} from 'pinia'
import {
  ref
} from 'vue'

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

  // 角色
  const roles = ref([])

  function setRoles(role) {
    roles.value = role
  }

  function getRoles() {
    return roles.value
  }
  
  function clearRoles() {
    roles.value = []
  }

  // 权限
  const permissions = ref([])

  function setPermissions(permission) {
    permissions.value = permission
  }

  function getPermissions() {
    return permissions.value
  }
  
  function clearPermissions() {
    permissions.value = []
  }

  return {
    auth,
    setAuth,
    getAuth,
    clearAuth,

    roles,
    setRoles,
    getRoles,
    clearRoles,

    permissions,
    setPermissions,
    getPermissions,
    clearPermissions,
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})