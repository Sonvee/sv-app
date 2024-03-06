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
import { computed, ref, watch } from 'vue'
import { useSysStore } from '@/store/sys'

const props = defineProps({
  // 显示头部导航栏 默认显示
  showNavBar: {
    type: Boolean,
    default: true
  },
  // 显示底部导航栏 默认隐藏 只建议tabbar页面显示
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

watch(
  theme,
  (newTheme) => {
    // 切换主题时需要设置状态栏颜色
    uni.setNavigationBarColor({
      frontColor: newTheme == 'light' ? '#000000' : '#ffffff',
      backgroundColor: '#ffffff'
    })
  },
  { immediate: true }
)

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
  // 页面视窗高度（顶部状态栏和底部安全距离除外）
  --page-height: calc(100vh - env(safe-area-inset-bottom) - #{v-bind(statusBarHeight)});
  // 页面内容主高度（页面视窗高度 - navbar - tabbar）
  --page-main-height: calc(var(--page-height) - 44px - 50px);
  // 页面内容无tabbar高度（页面视窗高度 - tabbar）
  --page-notab-height: calc(var(--page-height) - 44px);
  // 页面内容无navbar高度（页面视窗高度 - navbar）
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
