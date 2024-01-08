import {
  defineStore
} from 'pinia'
import {
  ref
} from 'vue'

export const useSysStore = defineStore('sys', () => {
  // 主题
  const themes = ref('light')

  function setThemes(theme) {
    themes.value = theme
  }

  function getThemes() {
    return themes.value
  }

  // 应用
  const apps = ref([])

  function setApps(app) {
    apps.value = app
  }

  function getApps() {
    return apps.value
  }

  function clearApps() {
    apps.value = []
  }

  // 字典
  const dicts = ref([])

  function setDicts(dict) {
    dicts.value = dict
  }

  function getDicts() {
    return dicts.value
  }

  function clearDicts() {
    dicts.value = []
  }

  return {
    themes,
    setThemes,
    getThemes,

    apps,
    setApps,
    getApps,
    clearApps,

    dicts,
    setDicts,
    getDicts,
    clearDicts
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})