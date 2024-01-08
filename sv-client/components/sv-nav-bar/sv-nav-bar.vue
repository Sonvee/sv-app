<template>
  <view class="sv-tn-navbar">
    <tn-navbar
      :fixed="navOpt.fixed"
      :frosted="navOpt.frosted"
      :placeholder="navOpt.placeholder"
      :index-url="navOpt.indexUrl"
      :bottom-shadow="navOpt.bottomShadow"
      :center="navOpt.center"
      :z-index="navOpt.zIndex"
      :before-back="beforeBack"
      :before-home="beforeHome"
      @init-finish="initFinish"
    >
      {{ title || pageTitle }}
    </tn-navbar>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import clientConfig from '@/client.config'
import { getTabBarList, pageRouteTable } from '@/router/page-router'
import { useSysStore } from '@/store/sys'

const props = defineProps({
  options: {
    type: Object,
    default: () => {}
  },
  title: {
    type: String,
    default: ''
  }
})

function handleCurPageRoute() {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  return page.route
}

const pageTitle = computed(() => {
  const pageRoute = handleCurPageRoute()
  // 根据当前页面路由表查页面标题
  const findPage = pageRouteTable.find((item) => item.url == pageRoute)
  return findPage.name
})

// 配色方案跟随主题，此处不进行设置
const defaultOpt = {
  fixed: true,
  placeholder: true,
  frosted: true,
  border: false,
  bottomShadow: true,
  center: true,
  zIndex: 996,
  indexUrl: clientConfig.index.url
}

const navOpt = computed(() => {
  return Object.assign({ ...defaultOpt }, props.options)
})

const sysStore = useSysStore()

function beforeBack() {
  // 已在tabbar页面时拦截返回
  const isTabbar = getTabBarList().relTabbar.includes(handleCurPageRoute())
  if (isTabbar) return false

  return new Promise((resolve) => {
    resolve(true)
  })
}

function beforeHome() {
  // 已在首页时则拦截返回首页
  const isHome = '/' + handleCurPageRoute() == navOpt.value.indexUrl
  if (isHome) return false

  // 更新pinia中curTabbarRoute状态
  sysStore.setConfig({
    curTabbarRoute: navOpt.value.indexUrl
  })
  return new Promise((resolve) => {
    resolve(true)
  })
}

function initFinish(e) {
  const { height, statusHeight } = e
  // height即为navbar高度+状态栏高度
  // 即只求tabbar的高度则为height-statusHeight
  sysStore.setConfig({
    navbarHeight: height
  })
}
</script>

<style lang="scss"></style>
