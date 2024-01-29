import { defineStore } from 'pinia'
import { ref, shallowRef } from 'vue'

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
    const historyIndex = historyList.value.findIndex(item => item.url === history.url)
    historyList.value.splice(historyIndex, 1)
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

  function clearLeftHistory(history) {
    const historyIndex = historyList.value.findIndex(item => item.url === history.url)
    historyList.value.splice(1, historyIndex - 1)
  }

  function clearOtherHistory(history) {
    const historyIndex = historyList.value.findIndex(item => item.url === history.url)
    // 如果目标元素存在且不在第一个位置
    if (historyIndex > 0) {
      // 删除从目标元素的下一个元素到数组末尾的所有元素
      historyList.value.splice(historyIndex + 1, historyList.value.length - historyIndex - 1);
      // 如果目标元素不是第一个，则还需要删除第一个元素之后到目标元素之间的所有元素
      if (historyIndex > 1) {
        historyList.value.splice(1, historyIndex - 1);
      }
    } else if (historyIndex === 0) {
      // 如果目标元素是第一个元素，则只删除它后面的元素
      historyList.value.splice(1, historyList.value.length - 1);
    }
  }

  function clearRightHistory(history) {
    const historyIndex = historyList.value.findIndex(item => item.url === history.url)
    historyList.value.splice(historyIndex + 1, historyList.value.length - historyIndex - 1);
  }

  return {
    historyList,
    addHistory,
    removeHistory,
    getHistory,
    clearHistory,
    clearOtherHistory,
    clearLeftHistory,
    clearRightHistory
  }
}, {
  unistorage: true // 开启后对 state 的数据读写都将持久化
})