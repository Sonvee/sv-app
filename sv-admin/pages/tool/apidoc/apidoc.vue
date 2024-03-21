<template>
  <view class="page-container">
    <!-- web-view会默认占据page整个视窗，若只考虑h5，使用iframe效果好一些 -->
    <!-- <web-view :src="apidocLink"></web-view> -->
    <iframe :src="apidocLink" frameborder="0" width="100%" height="100%"></iframe>
  </view>
</template>

<script setup>
const apidocLink = 'https://console-docs.apipost.cn/preview/2a25d55c121db329/c4261d5f35e8f66a'
</script>

<style lang="scss">
</style>
