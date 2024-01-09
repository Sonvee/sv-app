<template>
  <view class="sv-nav-bar">
    <uv-navbar
      fixed
      :bgColor="bgColor"
      :placeholder="placeholder"
      :border="false"
      :title="pageTitle ?? routeTitle"
      @leftClick="leftClick"
    ></uv-navbar>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { pageRouteTable } from '@/router/page-router'

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

function handleCurPageRoute() {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  return page.route
}

const routeTitle = computed(() => {
  const pageRoute = handleCurPageRoute()
  // 根据当前页面路由表查页面标题
  const findPage = pageRouteTable.find((item) => item.url == pageRoute)
  return findPage.name
})

function leftClick(e) {
  console.log('==== leftClick e :', e)
}
</script>

<style lang="scss"></style>
