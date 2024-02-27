<template>
  <view class="sv-nav-bar">
    <view v-if="sysStore.platform == 'mobile'" class="mobile-navbar">
      <text
        class="text-xl padding-sm"
        :class="[isShowSideBar ? 'uni-icons-settings' : 'uni-icons-list']"
        @click="toggleSideBar"
      ></text>
      <view class="sv-text-streamer text-xl text-bold">标题</view>
      <text
        class="text-xl padding-sm"
        :class="[sysStore.themes == 'light' ? 'sv-icons-sun' : 'sv-icons-moon']"
        @click="toggleTheme"
      ></text>
    </view>
    <view v-else class="pc-navbar">
      <view v-for="item in navbar" :key="item.path" @click="onNav(item)">
        {{ item.name }}
      </view>
    </view>
  </view>
  <!-- 占位 -->
  <view class="header-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { inject, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSysStore } from '@/store/sys'
import { changeTheme } from '@/utils/sys'

const router = useRouter()
const route = useRoute()
const sysStore = useSysStore()
const isShowSideBar = inject('e-show-side-bar')

const props = defineProps({
  placeholder: {
    type: Boolean,
    default: false
  }
})

function toggleSideBar() {
  isShowSideBar.value = !isShowSideBar.value
}

function toggleTheme() {
  const curTheme = sysStore.getThemes() == 'light' ? 'dark' : 'light'
  changeTheme(curTheme)
}

const navbar = computed(() => {
  const routes = router.options.routes
  const navRoutes = routes
    .filter((item) => item.meta?.nav)
    .sort((a, b) => a.meta.nav.index - b.meta.nav.index)
  const navs = navRoutes.map((item) => {
    return {
      name: item.name,
      path: item.path,
      ...item.meta.nav
    }
  })
  return navs
})

function onNav(item) {
  if (item.path) router.push(item.path)
}
</script>

<style lang="scss">
.sv-nav-bar {
  width: 100%;
  height: $sv-nav-bar-height;
  position: fixed;
  top: 0;
  z-index: 999;

  @include useTheme {
    border-bottom: 1px solid #{getTheme('sv-border-color')};
    background-image: radial-gradient(transparent 1px, #{getTheme('sv-bg-color')} 4px);
    background-color: #{getTheme('sv-bg-color') + '66'};
  }
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px);

  .mobile-navbar {
    height: 100%;
    display: flex;
    align-items: center;
    padding: 0 10px;
    justify-content: space-between;
  }
}

.header-placeholder {
  height: $sv-nav-bar-height;
}
</style>
