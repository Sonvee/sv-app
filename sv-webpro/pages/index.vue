<template>
  <view class="app-index">
    <!-- 头部导航栏 -->
    <sv-nav-bar></sv-nav-bar>
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
    <sv-tab-bar v-if="platform == 'mobile'"></sv-tab-bar>
    <!-- 滑动侧边栏 -->
    <sv-side-bar v-if="platform == 'mobile'" v-model="isShowSideBar"></sv-side-bar>
  </view>
</template>

<script setup>
import { ref, computed, provide } from 'vue'
import { useRouter } from 'vue-router'
import { useSysStore } from '@/store/sys'

const router = useRouter()

const platform = ref(useSysStore().platform)

const isShowSideBar = ref(false)
provide('e-show-side-bar', isShowSideBar)

const keepAlivePages = computed(() => {
  const routes = router.options.routes
  return routes.filter((item) => item.meta?.keepAliveName).map((item) => item.meta.keepAliveName)
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
</style>
