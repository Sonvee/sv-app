<template>
  <view class="sv-nav-history">
    <el-scrollbar ref="scrollbarRef" @wheel.prevent="handleScroll">
      <view class="sv-nav-tags">
        <el-tag
          class="sv-el-tag"
          v-for="item in historyList"
          :key="item.value"
          :closable="item.url !== 'pages/index/index'"
          :effect="curtag?.url == item.url ? 'dark' : 'plain'"
          @close="removeTag(item)"
          @click="onTag(item)"
        >
          <view style="cursor: pointer">
            {{ item.name }}
          </view>
        </el-tag>
        <view class="history-clear" v-if="historyList.length > 1">
          <el-dropdown size="small" @command="onDelHistory" placement="bottom-start">
            <el-button type="success" link>
              <template #icon>
                <view class="sv-icons-clear"></view>
              </template>
            </el-button>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item :icon="Close" command="del_cur">关闭当前</el-dropdown-item>
                <el-dropdown-item :icon="Right" command="del_right">关闭右侧</el-dropdown-item>
                <el-dropdown-item :icon="Back" command="del_left">关闭左侧</el-dropdown-item>
                <el-dropdown-item :icon="Remove" command="del_other">关闭其他</el-dropdown-item>
                <el-dropdown-item :icon="Delete" command="del_all">关闭所有</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </view>
      </view>
    </el-scrollbar>
  </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useNavStore } from '@/store/nav.js'
import { Delete, Close, Right, Back, Remove } from '@element-plus/icons-vue'

const route = useRoute()

const navStore = useNavStore()

// 横向滚动
const scrollbarRef = ref()
function handleScroll(e) {
  const wheelDelta = e.wheelDelta || -e.deltaY * 40
  scrollbarRef.value.setScrollLeft(scrollbarRef.value.wrapRef.scrollLeft - wheelDelta)
}

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

function onDelHistory(cmd) {
  switch (cmd) {
    case 'del_cur':
      removeTag(curtag.value)
      break
    case 'del_right':
      navStore.clearRightHistory(curtag.value)
      break
    case 'del_left':
      navStore.clearLeftHistory(curtag.value)
      break
    case 'del_other':
      navStore.clearOtherHistory(curtag.value)
      break
    case 'del_all':
      navStore.clearHistory()
      break
  }
  historyList.value = navStore.getHistory()
}

const curtag = computed(() => {
  if (route.meta?.route) {
    const {
      route: url,
      navigationBar: { titleText: name }
    } = route.meta
    return { url, name }
  }
})

watch(
  () => route.meta,
  (newVal) => {
    const curRoute = {
      url: newVal.route,
      name: newVal.navigationBar?.titleText
    }
    // 监听路由，添加历史记录（排除error、login、web页面）
    if (/^(?!.*(?:pages\/error|sv-id-pages\/pages\/login|pages\/web)).*pages\/.*/.test(curRoute.url)) {
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
  width: calc(100vw - #{$sv-side-bar-width} - 480px);
  padding: 0 6px;
  cursor: e-resize;

  :deep(.el-scrollbar__bar.is-horizontal) {
    display: none !important; // 隐藏横向滚动条
  }

  .sv-nav-tags {
    display: flex;
    column-gap: 6px;
  }

  .history-clear {
    padding: 0 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    position: sticky;
    right: 0;
    color: $uni-color-error;
    cursor: pointer;

    @include useTheme {
      background-color: getTheme('sv-bg-color');
    }

    &:active {
      color: $uni-color-danger;
    }
  }
}

// 移动端隐藏历史记录栏
@media screen and (max-width: 854px) {
  .sv-nav-history {
    display: none;
  }
}
</style>
