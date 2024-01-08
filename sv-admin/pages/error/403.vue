<template>
  <view class="page-container forbidden-page">
    <view data-glitch="403 Forbidden" class="glitch-text" style="font-size: 60px">403 Forbidden</view>
    <view data-glitch="GO BACK" class="glitch-btn" style="margin-top: 12px" @click="goback">GO BACK</view>
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
}
</style>
