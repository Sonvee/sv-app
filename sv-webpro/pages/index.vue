<template>
  <view class="app-index">
    <sv-nav-bar v-if="platform == 'pc'"></sv-nav-bar>
    <view class="app-body">
      <sv-side-bar v-if="platform == 'mobile'"></sv-side-bar>
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <keep-alive :include="keepAlivePages">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </view>
    <sv-tab-bar v-if="platform == 'mobile'"></sv-tab-bar>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSysStore } from '@/store/sys'

const router = useRouter()

const keepAlivePages = computed(() => {
  const routes = router.options.routes
  return routes.filter((item) => item.meta?.keepAliveName).map((item) => item.meta.keepAliveName)
})

const platform = ref(useSysStore().platform)
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
