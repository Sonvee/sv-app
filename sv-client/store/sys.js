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

  // 系统配置
  const config = ref({
    navbarHeight: '',
    curTabbarRoute: '',
  })

  function setConfig(option) {
    Object.assign(config.value, option)
  }

  function getConfig() {
    return config.value
  }

  function deleteConfig(option) {
    delete config.value[option]
  }

  function clearConfig() {
    config.value = {}
  }


  return {
    themes,
    setThemes,
    getThemes,

    dicts,
    setDicts,
    getDicts,
    clearDicts,

    config,
    setConfig,
    getConfig,
    deleteConfig,
    clearConfig
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})