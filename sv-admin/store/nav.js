import {
  defineStore
} from 'pinia'
import {
  ref
} from 'vue'

export const useNavStore = defineStore('nav', () => {
  // 导航栏历史
  const historyList = ref([{
    url: 'pages/index/index',
    name: '首页',
  }])

  function addHistory(history) {
    const has = historyList.value.some((item) => item.url === history.url)
    if (!has) {
      historyList.value.push(history)
    }
  }

  function removeHistory(history) {
    historyList.value.splice(historyList.value.indexOf(history), 1)
  }

  function getHistory() {
    return historyList.value
  }

  function clearHistory() {
    historyList.value = [{
      url: 'pages/index/index',
      name: '首页',
    }]
  }

  return {
    historyList,
    addHistory,
    removeHistory,
    getHistory,
    clearHistory
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})