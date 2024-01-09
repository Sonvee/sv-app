<template>
  <view class="sv-page" :data-theme="theme">
    <view class="page-container">
      <sv-nav-bar v-if="showNavBar"></sv-nav-bar>
      <slot></slot>
      <sv-tab-bar v-if="showTabBar"></sv-tab-bar>
    </view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { useSysStore } from '@/store/sys'

const props = defineProps({
  showNavBar: {
    type: Boolean,
    default: true
  },
  showTabBar: {
    type: Boolean,
    default: true
  }
})

// 获取状态栏高度
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'

// 重要：绑定pinia中持久化响应式主题变量
const theme = computed(() => {
  return useSysStore().getThemes()
})
</script>

<style lang="scss">
.sv-page {
  --page-height: calc(100vh - env(safe-area-inset-bottom) - #{v-bind(statusBarHeight)});
  --page-main-height: calc(var(--page-height) - 44px - 50px);
  --page-notab-height: calc(var(--page-height) - 44px);
  --page-nonav-height: calc(var(--page-height) - 50px);

  .page-container {
    background-color: inherit;
  }
}
</style>
