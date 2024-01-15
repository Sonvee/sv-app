import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSysStore = defineStore('sys', () => {
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
  const config = ref({})

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