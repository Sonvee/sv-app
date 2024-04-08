<template>
  <sv-page showTabBar>
    <view class="hall sv-uv-vtabs">
      <uv-vtabs
        :list="list"
        :hdHeight="vtabHeight.hdHeight"
        :height="vtabHeight.height"
        chain
        keyName="name"
        @change="changeSideTab"
      >
        <uv-vtabs-item v-for="(item, index) in list" :key="index" :index="index">
          <view class="padding-lr padding-top">{{ item.name }}</view>
          <view class="padding sv-grid grid-col-4 grid-gap-lg">
            <view class="grid-item bg-cyan" v-for="it in item.content" :key="it">
              <view class="">{{ it }}</view>
            </view>
          </view>
        </uv-vtabs-item>
      </uv-vtabs>
    </view>
  </sv-page>
</template>

<script setup>
import { computed, ref } from 'vue'

const vtabHeight = computed(() => {
  const { statusBarHeight, screenHeight, safeAreaInsets } = uni.getSystemInfoSync()
  return {
    height: screenHeight - statusBarHeight - safeAreaInsets.bottom - 44 - 50,
    hdHeight: statusBarHeight + 44
  }
})

const list = ref([
  {
    name: '标题一',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
  },
  {
    name: '标题二',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    name: '标题三',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
  },
  {
    name: '标题四',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  },
  {
    name: '标题五',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  }
])

function changeSideTab(index) {
  console.log('侧栏选项改变：', index)
}
</script>

<style lang="scss">
.hall {
  height: var(--page-main-height);
}
</style>
