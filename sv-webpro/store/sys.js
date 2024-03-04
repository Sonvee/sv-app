import {
  defineStore
} from 'pinia'
import {
  ref
} from 'vue'

export const useSysStore = defineStore('sys', () => {
  // 平台
  const platform = ref('pc')

  function setPlatform(plat) {
    platform.value = plat
  }

  function getPlatform() {
    return platform.value
  }

  // 主题
  const themes = ref('light')

  function setThemes(theme) {
    themes.value = theme
  }

  function getThemes() {
    return themes.value
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
    platform,
    setPlatform,
    getPlatform,

    themes,
    setThemes,
    getThemes,

    dicts,
    setDicts,
    getDicts,
    clearDicts
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})