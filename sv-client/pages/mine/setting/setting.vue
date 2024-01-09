<template>
  <sv-page>
    <view class="setting">
      <view class="tg">切换主题</view>
      <button size="mini" @click="onTheme('light')">白昼</button>
      <button size="mini" @click="onTheme('dark')">暗夜</button>
    </view>
  </sv-page>
</template>

<script setup>
import { useSysStore } from '@/store/sys'

function onTheme(theme) {
  useSysStore().setThemes(theme)
}
</script>

<style lang="scss">
.setting {
  height: var(--page-main-height);

  @include useTheme {
    background-color: getTheme(sv-bg-color);

    .tg {
      color: getTheme(sv-text-color);
    }
  }
}
</style>
