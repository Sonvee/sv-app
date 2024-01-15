<template>
  <sv-page showTabBar>
    <view class="index">index</view>
  </sv-page>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'

onLoad(() => {
  // #ifdef APP
  /**
   * 隐藏内置tabbar
   * 官方bug：安卓真机上报错：hideTabBar:fail not TabBar page
   * 解决方法：1. 将tabBar中height设置成1px（实测设置成0或0px无效）
   *          2. 可加短暂的适当的延时器，但是大概率会存在留白闪烁问题
   *          3. 在app首页的onLoad中进行hideTabBar，注意在onLaunch中无效（推荐）
   */
  uni.hideTabBar()
  // #endif
})
</script>

<style lang="scss">
.index {
  height: var(--page-height);
  border: 10px solid #3a5afb;
  box-sizing: border-box;
}
</style>
