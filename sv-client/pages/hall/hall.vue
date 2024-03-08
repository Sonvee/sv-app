<template>
  <sv-page showTabBar>
    <view class="hall">
      <uv-vtabs
        class="sv-uv-vtabs"
        :list="list"
        keyName="name"
        hdHeight="88rpx"
        :height="vtabsHeight"
        chain
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

const vtabsHeight = computed(() => {
  const { statusBarHeight, windowHeight } = uni.getSystemInfoSync()
  return windowHeight - statusBarHeight - 44 - 50
})

const list = ref([
  {
    name: 'uv-ui简介',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13]
  },
  {
    name: 'uv-ui特点',
    content: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  },
  {
    name: '更新日志',
    content: [1, 2, 3, 4, 5, 6, 7]
  }
])

function change(index) {
  console.log('选项改变：', index)
}
</script>

<style lang="scss">
.hall {
  height: var(--page-main-height);

  .header {
    height: 100rpx;
    border: 1px solid #cccccc;
  }
}
</style>
