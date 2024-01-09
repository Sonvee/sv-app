<template>
  <view class="sv-nav-bar">
    <uv-navbar
      fixed
      leftIcon=""
      :bgColor="bgColor"
      :placeholder="placeholder"
      :border="false"
      :title="pageTitle ?? routeTitle"
      titleStyle="color:unset"
    >
      <template #left>
        <uv-icon
          v-if="!isTabbar"
          color="unset"
          name="arrow-left"
          size="20"
          @click="onBack"
        ></uv-icon>
      </template>
    </uv-navbar>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import { getTabBarList, pageRouteTable } from '@/router/page-router'

const props = defineProps({
  // 自定义页面标题 - 不设默认值
  pageTitle: {
    type: String
  },
  placeholder: {
    type: Boolean,
    default: true
  },
  bgColor: {
    type: String,
    default: 'transparent'
  }
})

const pageRoute = computed(() => {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  return page.route
})

const isTabbar = computed(() => {
  const tabRouteList = getTabBarList().relTabbar
  return tabRouteList.includes(pageRoute.value)
})

const routeTitle = computed(() => {
  // 根据当前页面路由表查页面标题
  const findPage = pageRouteTable.find((item) => item.url == pageRoute.value)
  return findPage.name
})

function onBack() {
  if (!isTabbar.value) {
    uni.navigateBack()
  }
}
</script>

<style lang="scss"></style>
