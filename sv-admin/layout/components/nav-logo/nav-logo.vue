<template>
  <view class="logo" @click="onLogo">
    <image class="logo-image" :src="config.logo_url" mode="heightFix"></image>
    <text class="logo-text text-line-2">{{ config.name }}</text>
  </view>
</template>

<script setup>
import config from '@/configs/index.js'

function onLogo() {
  uni.navigateTo({
    url: '/pages/index/index'
  })
}
</script>

<style lang="scss">
.logo {
  // width: $sv-side-bar-width;
  width: var(--window-left);
  height: $sv-nav-bar-height;
  padding: 0 calc(var(--window-left) / 10);
  box-sizing: border-box;
  display: flex;
  align-items: center;
  cursor: pointer;
  flex-shrink: 0;

  @include useTheme {
    color: getTheme('sv-text-color');
    border-bottom: 1px solid #{getTheme('sv-border-color')};
  }

  &:hover {
    @include useTheme {
      background-color: getTheme('sv-mask-hl-color');
    }
  }

  .logo-image {
    height: 60%;
  }

  .logo-text {
    max-width: 130px;
    font-size: 14px;
    font-weight: 700;
    padding-left: 12px;
  }
}
</style>
