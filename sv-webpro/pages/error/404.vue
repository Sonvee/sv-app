<template>
  <view class="page not-found-page">
    <view data-glitch="404 Not Found" class="sv-glitch-text text-404">404 Not Found</view>
    <view class="btns">
      <view data-glitch="GO BACK" class="sv-glitch-btn" @click="goback">GO BACK</view>
      <view data-glitch="GO HOME" class="sv-glitch-btn btn-home" @click="gohome">GO HOME</view>
    </view>
  </view>
</template>

<script setup>
function goback() {
}

function gohome() {
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

  .btns {
    display: flex;
    column-gap: 80rpx;
    margin-top: 48rpx;
  }

  .btn-home {
    box-shadow: 6px 0px 0px #ff5e59 !important;
    background: linear-gradient(45deg, transparent 5%, #007aff 5%) !important;
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
