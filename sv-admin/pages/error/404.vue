<template>
  <view class="page-container not-found-page">
    <view data-glitch="404 Not Found" class="glitch-text" style="font-size: 60px">404 Not Found</view>
    <view data-glitch="GO BACK" class="glitch-btn" style="margin-top: 12px" @click="goback">GO BACK</view>
  </view>
</template>

<script setup>
function goback() {
  uni.navigateBack()
}
</script>

<style lang="scss">
.not-found-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
</style>
