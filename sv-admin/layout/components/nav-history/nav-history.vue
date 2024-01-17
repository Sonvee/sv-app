<template>
  <view class="sv-nav-history">
    <el-tag
      class="sv-el-tag"
      v-for="item in historyList"
      :key="item.value"
      :closable="item.url !== 'pages/index/index'"
      :effect="curtag?.url == item.url ? 'dark' : 'plain'"
      @close="removeTag(item)"
      @click="onTag(item)"
    >
      {{ item.name }}
    </el-tag>
    <el-tag
      class="sv-el-tag"
      v-if="historyList.length > 1"
      :closable="false"
      effect="plain"
      @click="onClearHistory"
    >
      <el-icon><Delete /></el-icon>
    </el-tag>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNavStore } from '@/store/nav.js'
import { Delete } from '@element-plus/icons-vue'

const route = useRoute()

const navStore = useNavStore()

const historyList = ref([])

function handleHistory() {
  historyList.value = navStore.getHistory()
}

function removeTag(item) {
  // 删除选中的记录
  navStore.removeHistory(item)
  if (item.url == curtag.value.url) {
    // 若删除的是当前的记录，则还需返回历史记录最新一级
    const lastHistory = historyList.value[historyList.value.length - 1]
    uni.navigateTo({
      url: '/' + lastHistory.url
    })
  }
}

function onTag(item) {
  if (item.url !== curtag.value.url) {
    uni.navigateTo({
      url: '/' + item.url
    })
  }
}

function onClearHistory() {
  // 清空历史记录
  navStore.clearHistory()
  historyList.value = navStore.getHistory()
}

const curtag = computed(() => {
  if (route.meta?.route) {
    const {
      route: url,
      navigationBar: { titleText: name }
    } = route.meta
    return { name, url }
  }
})

watch(
  () => route.meta,
  (newVal) => {
    const curRoute = {
      url: newVal.route,
      name: newVal.navigationBar?.titleText
    }
    // 监听路由，添加历史记录（只记录url: pages/非error页面）
    // console.log(curRoute);
    if (/^pages\/(?!error)/.test(curRoute.url)) {
      navStore.addHistory(curRoute)
    }
  }
)

defineExpose({
  handleHistory
})
</script>

<style lang="scss">
.sv-nav-history {
  padding: 0 6px;
  display: flex;
  align-items: flex-end;
  column-gap: 4px;
  max-width: 600px;
  overflow-x: auto;
}

@media screen and (max-width: 767px) {
  .sv-nav-history {
    display: none;
  }
}
</style>
