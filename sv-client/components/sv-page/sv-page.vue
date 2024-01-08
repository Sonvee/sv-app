<template>
  <view class="sv-page" :data-theme="theme">
    <view class="page-container">
      <sv-nav-bar v-if="isNavBar"></sv-nav-bar>
      <slot></slot>
      <sv-tab-bar v-if="isTabBar"></sv-tab-bar>
    </view>
  </view>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useSysStore } from '@/store/sys'
import { getTabBarList } from '@/router/page-router'

const sysStore = useSysStore()
// 重要：绑定pinia中持久化响应式主题变量
const theme = ref(sysStore.getThemes())

/**
 * 改变主题
 * @param {Object} e 要改变的主题标识 目前可选： light / dark
 */
function changeTheme(e) {
  if (e) sysStore.setThemes(e) // 若传参更改主题时进行更新
  theme.value = sysStore.getThemes()
}

const pages = getCurrentPages()
const page = pages[pages.length - 1]
const pageRoute = '/' + page.route

// 显示tabbar的页面
const tabBarMap = getTabBarList().absTabbar
const isTabBar = computed(() => {
  return tabBarMap.some((item) => item == pageRoute)
})

// 不显示navbar的页面
const noNavBarMap = ['/pages/mine/mine', '/pages/mine/test/test']
const isNavBar = computed(() => {
  return !noNavBarMap.some((item) => item == pageRoute)
})

watchEffect(() => {
  // 重要：响应式监听pinia中themes，动态改变主题
  changeTheme(sysStore.getThemes())
})
</script>

<style lang="scss">
.sv-page {
  height: 100%;
}

.page-container {
  min-height: 100%;

  @include useTheme {
    background-color: getTheme('sv-background-color');
    color: getTheme('sv-text-color');
  }
}
</style>
