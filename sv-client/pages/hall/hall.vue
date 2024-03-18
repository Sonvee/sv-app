<template>
  <sv-page showTabBar>
    <view class="hall sv-uv-vtabs">
      <uv-vtabs
        :list="list"
        :hdHeight="vtabHeight.hdHeight"
        :height="vtabHeight.height"
        chain
        keyName="name"
        @change="change"
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
    name: '简介',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21]
  },
  {
    name: '特点',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
  },
  {
    name: '更新日志',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17]
  },
  {
    name: '注意事项',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19]
  },
  {
    name: '补充说明',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  }
])

function change(index) {
  console.log('选项改变：', index)
}
</script>

<style lang="scss">
.hall {
  height: var(--page-main-height);
}
</style>
