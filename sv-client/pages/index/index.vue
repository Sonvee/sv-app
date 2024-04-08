<template>
  <sv-page showTabBar>
    <view class="index flex-col-vhc">首页</view>
  </sv-page>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'

onLoad(() => {
  // #ifdef APP
  uni.hideTabBar()
  // #endif
})
</script>

<style lang="scss">
.index {
  width: 100%;
  min-height: var(--page-main-height);
}
</style>
