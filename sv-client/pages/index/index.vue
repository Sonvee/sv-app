<template>
  <sv-page showTabBar>
    <view class="index">
      <view class="margin-tb">
        <uv-swiper
          :list="list"
          autoplay
          circular
          showTitle
          keyName="image"
          :title-style="{ color: 'red', textAlign: 'center' }"
          previousMargin="30"
          nextMargin="30"
          radius="5"
          bgColor="transparent"
        ></uv-swiper>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'

onLoad(() => {
  // #ifdef APP
  uni.hideTabBar()
  // #endif
})

const list = [
  {
    image: 'https://cdn.uviewui.com/uview/swiper/swiper2.png',
    title: '丙辰中秋，欢饮达旦，大醉，作此篇，兼怀子由'
  },
  {
    image: 'https://cdn.uviewui.com/uview/swiper/swiper1.png',
    title: '明月几时有？把酒问青天'
  },
  {
    image: 'https://cdn.uviewui.com/uview/swiper/swiper3.png',
    title: '不知天上宫阙，今夕是何年'
  }
]
</script>

<style lang="scss">
.index {
}
</style>
