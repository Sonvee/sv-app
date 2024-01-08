<template>
  <sv-page>
    <view class="index">
      <view class="index-box"></view>
    </view>
  </sv-page>
</template>

<script setup>
import { onReachBottom, onPullDownRefresh } from '@dcloudio/uni-app'

onPullDownRefresh(() => {
  setTimeout(() => {
    console.log('==== onPullDownRefresh :')
    uni.stopPullDownRefresh()
  }, 1600)
})
onReachBottom(() => {
  console.log('==== onReachBottom :')
})
</script>

<style lang="scss">
.index {
  height: 100%;

  .index-box {
    height: 1000px;
    border: 10px solid #66ccff;
  }
}
</style>
