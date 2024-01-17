<template>
  <view class="page-container forbidden-page">
    <view data-glitch="403 Forbidden" class="glitch-text text-403">403 Forbidden</view>
    <view data-glitch="GO BACK" class="glitch-btn btn-back" @click="goback">GO BACK</view>
  </view>
</template>

<script setup>
function goback() {
  uni.navigateBack()
}
</script>

<style lang="scss">
.forbidden-page {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .text-403 {
    font-size: 60rpx;
  }

  .btn-back {
    margin-top: 48rpx;
  }
}

// 响应式布局
@media screen and (min-width: 960px) {
  .text-403 {
    font-size: 120rpx !important;
  }
  .btn-back {
    margin-top: 48rpx !important;
  }
}
</style>
