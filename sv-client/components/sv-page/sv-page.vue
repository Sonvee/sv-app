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
import { computed, ref } from 'vue'
import { useSysStore } from '@/store/sys'

const props = defineProps({
  showNavBar: {
    type: Boolean,
    default: true
  },
  showTabBar: {
    type: Boolean,
    default: false
  }
})

// 获取状态栏高度
const statusBarHeight = uni.getSystemInfoSync().statusBarHeight + 'px'

// 重要：绑定pinia中持久化响应式主题变量
const theme = computed(() => {
  return useSysStore().getThemes()
})
const themeBgColor = computed(() => {
  let color = ''
  if (theme.value == 'light') {
    color = '#f8f8f8'
  } else {
    color = '#202020'
  }
  return color
})
</script>

<style lang="scss">
.sv-page {
  --page-height: calc(100vh - env(safe-area-inset-bottom) - #{v-bind(statusBarHeight)});
  --page-main-height: calc(var(--page-height) - 44px - 50px);
  --page-notab-height: calc(var(--page-height) - 44px);
  --page-nonav-height: calc(var(--page-height) - 50px);

  min-height: 100vh;
  background-color: v-bind(themeBgColor);
}

.page-container {
  @include useTheme {
    background-color: getTheme(sv-bg-color);
    color: getTheme(sv-text-color);
  }
}
</style>
