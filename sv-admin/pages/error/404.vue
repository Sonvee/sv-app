<template>
  <view class="page-container not-found-page">
    <view data-glitch="404 Not Found" class="glitch-text text-404">404 Not Found</view>
    <view data-glitch="GO BACK" class="glitch-btn btn-back" @click="goback">GO BACK</view>
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

  .text-404 {
    font-size: 60rpx;
  }

  .btn-back {
    margin-top: 48rpx;
  }
}

// 响应式布局
@media screen and (min-width: 960px) {
  .text-404 {
    font-size: 120rpx !important;
  }
  .btn-back {
    margin-top: 48rpx !important;
  }
}
</style>
