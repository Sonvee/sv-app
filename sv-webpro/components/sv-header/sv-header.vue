<template>
  <view class="sv-header">
    <view class="sv-text-streamer text-xl text-bold">夏夜追凉丶的博客</view>
  </view>
  <!-- 占位 -->
  <view class="header-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSysStore } from '@/store/sys'
import { changeTheme } from '@/utils/sys'

const router = useRouter()
const route = useRoute()
const sysStore = useSysStore()

const props = defineProps({
  placeholder: {
    type: Boolean,
    default: false
  }
})

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
.sv-header {
  width: 100%;
  height: $sv-nav-bar-height;
  position: fixed;
  top: 0;
  z-index: 999;

  display: flex;
  align-items: center;
  padding: 0 100px;
  justify-content: space-between;

  @include useTheme {
    border-bottom: 1px solid #{getTheme('sv-border-color')};
    background-image: radial-gradient(transparent 1px, #{getTheme('sv-bg-color')} 4px);
    background-color: #{getTheme('sv-bg-color') + 'aa'};
  }
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px);
}

.header-placeholder {
  height: $sv-nav-bar-height;
}
</style>
