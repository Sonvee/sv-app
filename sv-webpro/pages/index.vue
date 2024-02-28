<template>
  <view class="app-index">
    <!-- 头部导航栏 -->
    <sv-nav-bar v-if="!noBar"></sv-nav-bar>
    <!-- 主体内容 -->
    <view class="app-body" :class="{ 'show-side-bar': isShowSideBar }">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <keep-alive :include="keepAlivePages">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </view>
    <!-- 底部导航栏 -->
    <sv-tab-bar v-if="sysStore.platform == 'mobile' && !noBar"></sv-tab-bar>
    <!-- 滑动侧边栏 -->
    <sv-side-bar
      v-if="sysStore.platform == 'mobile' && !noBar"
      v-model="isShowSideBar"
    ></sv-side-bar>
  </view>
</template>

<script setup>
import { ref, computed, provide, getCurrentInstance, onMounted, nextTick } from 'vue'
import { onLoad, onUnload } from '@dcloudio/uni-app'
import { useRouter, useRoute } from 'vue-router'
import { useSysStore } from '@/store/sys'
import webproConfig from '@/webpro.config'

const router = useRouter()
const route = useRoute()
const sysStore = useSysStore()
const { proxy } = getCurrentInstance()

const noBar = computed(() => {
  return webproConfig.noBar.includes(route.path)
})

const isShowSideBar = ref(false)
provide('e-show-side-bar', isShowSideBar)

const keepAlivePages = computed(() => {
  const routes = router.options.routes
  return routes.filter((item) => item.meta?.keepAliveName).map((item) => item.meta.keepAliveName)
})

// 媒体查询监听窗口尺寸变化
const mediaQueryOb = ref(null)

onLoad(() => {
  // 开启媒体查询
  if (!mediaQueryOb.value) {
    mediaQueryOb.value = uni.createMediaQueryObserver(proxy)
    mediaQueryOb.value.observe(
      {
        minWidth: 0, // 页面最小宽度 0px
        maxWidth: 600 // 页面宽度最大 600px
      },
      (matches) => {
        console.log('==== 媒体查询 matches :', matches)
        // 页面宽度在 0 ~ 600px 之间为 mobile，否则为 pc
        sysStore.setPlatform(matches ? 'mobile' : 'pc')
      }
    )
  }
})

onUnload(() => {
  // 关闭媒体查询
  mediaQueryOb.value?.disconnect()
  mediaQueryOb.value = null
  console.log('==== 关闭媒体查询 ====')
})
</script>

<style lang="scss">
.app-index {
  width: 100%;
  height: 100%;

  .app-body {
    width: 100%;
    height: 100%;
  }
}

.app-loding {
  width: 100%;
  height: 100%;
}
</style>
