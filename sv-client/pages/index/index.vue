<template>
  <sv-page showTabBar>
    <view class="index">
      <view class="padding-tb">
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
      <!-- 搜索 -->
      <view class="padding">
        <uv-input v-model="searchVal" prefixIcon="search" placeholder="搜点什么" clearable>
          <template #suffix>
            <text class="cuIcon-scan text-xl" @click="onScan"></text>
          </template>
        </uv-input>
      </view>
      <!-- 菜单 -->
      <view class="sv-grid grid-col-5 padding-sm">
        <view
          class="grid-item-lg flex-col align-center justify-evenly"
          v-for="item in menuCard"
          :key="item.lable"
        >
          <text class="text-sl" :class="item.value"></text>
          <text class="text-sm">{{ item.lable }}</text>
        </view>
      </view>
      <!-- 卡片 -->
      <view class="sv-grid grid-col-2 grid-gap-xl padding-lg">
        <view
          class="grid-item-lg radius-xl sv-gradual-whitepeach shadow-warp flex-col justify-evenly padding-left relative"
        >
          <view class="text-lg text-bold text-black">精品课题</view>
          <view class="text-sm text-cyan">1对1在线辅导</view>
          <text class="cuIcon-activity text-xsl text-black abs-t-r"></text>
        </view>
        <view
          class="grid-item-lg radius-xl sv-gradual-skyblue shadow-warp flex-col justify-evenly padding-left relative"
        >
          <view class="text-lg text-bold text-black">词语锦囊</view>
          <view class="text-sm text-cyan">腹有诗书气自华</view>
          <text class="cuIcon-activity text-xsl text-black abs-t-r"></text>
        </view>
      </view>
      <!-- 推荐课程 -->
      <view class="cu-bar margin-top-sm">
        <view class="action sub-title">
          <text class="text-lg text-bold text-blue">推荐课程</text>
          <text class="text-df text-ABC text-blue">course</text>
        </view>
        <view class="text-gray margin-right">
          <text class="text-sm">更多</text>
          <text class="cuIcon-right"></text>
        </view>
      </view>
      <view class="card-list padding">
        <view class="list-item sv-gradual-sunset shadow-warp padding">123</view>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import { onLoad } from '@dcloudio/uni-app'
import { ref } from 'vue'
import { onScan } from '@/utils/util'

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

const searchVal = ref('')

const menuCard = ref([
  {
    lable: '菜单甲',
    value: 'cuIcon-comment'
  },
  {
    lable: '菜单乙',
    value: 'cuIcon-comment'
  },
  {
    lable: '菜单丙',
    value: 'cuIcon-comment'
  },
  {
    lable: '菜单丁',
    value: 'cuIcon-comment'
  },
  {
    lable: '菜单戊',
    value: 'cuIcon-comment'
  }
])
</script>

<style lang="scss">
.index {
  width: 100%;
  min-height: var(--page-main-height);

  @include useLightTheme {
    background: linear-gradient(160deg, #e7ffdb, #ffffff, #ffffff, #f8f8f8);
  }

  .abs-t-r {
    position: absolute;
    top: -40rpx;
    right: -40rpx;
  }

  .card-list {
    .list-item {
      height: 200rpx;
      border-radius: 24rpx;
    }
  }
}
</style>
