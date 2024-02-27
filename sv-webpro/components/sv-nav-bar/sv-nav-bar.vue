<template>
  <view class="sv-nav-bar">
    <text
      class="text-xl padding-sm"
      :class="[isShowSideBar ? 'uni-icons-settings' : 'uni-icons-list']"
      @click="toggleSideBar"
    ></text>
    <view class="sv-text-streamer text-xl text-bold">夏夜追凉丶的博客</view>
    <text
      class="text-xl padding-sm"
      :class="[sysStore.themes == 'light' ? 'sv-icons-sun' : 'sv-icons-moon']"
      @click="toggleTheme"
    ></text>
  </view>
  <!-- 占位 -->
  <view class="header-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { inject } from 'vue'
import { useSysStore } from '@/store/sys'
import { changeTheme } from '@/utils/sys'

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
</script>

<style lang="scss">
.sv-nav-bar {
  width: 100%;
  height: $sv-nav-bar-height;
  position: fixed;
  top: 0;
  z-index: 999;

  display: flex;
  align-items: center;
  padding: 0 10px;
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
