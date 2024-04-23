<template>
  <sv-page>
    <view class="about">
      <view class="about-header flex-col-vhc">
        <image :src="config.logo_url" style="width: 180rpx; height: 180rpx"></image>
        <view class="text-bold text-xl margin-top-xl">{{ config.name }}</view>
        <view class="text-lg margin-top-sm text-italic text-grey">
          version {{ config.version }}
        </view>
      </view>
      <!-- 其他服务 -->
      <view class="about-list cu-list menu sm-border">
        <!-- 图标 + 标题、arrow 带箭头 -->
        <view
          class="cu-item arrow"
          v-for="item in aboutMenu"
          :key="item.path"
          @click="onAbout(item)"
        >
          <view class="content">
            <text class="text-cyan" :class="item.icon"></text>
            <text class="text-cyan">{{ item.name }}</text>
          </view>
        </view>
      </view>
      <!-- 条款 备案 版权 -->
      <view class="about-footer padding flex-col-vhc">
        <view class="text-sm text-center">
          <text
            class="about-document"
            v-for="item in documents"
            :key="item.name"
            @click="onDocument(item)"
          >
            {{ item.name }}
          </text>
        </view>
        <view class="about-copyright text-sm text-gray text-center">
          <view>客服电话: xxx-xxxx-xxxx</view>
          <view>ICP备案号: xxx-xxxxxxxx-xxxxx</view>
          <view>SV 版权所有</view>
          <view>Copyright © 2024-2026 SV. All Rights Reserved.</view>
        </view>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import config from '@/uni_modules/sv-configs/config/index.js'

const aboutMenu = [
  { name: '功能介绍', icon: 'cuIcon-question', path: '' },
  { name: '版本更新', icon: 'cuIcon-pullup', path: '' },
  { name: '联系我们', icon: 'cuIcon-friend', path: '' }
]

function onAbout(item) {
  if (item.path) {
    uni.navigateTo({
      url: item.path
    })
  } else {
    uni.showToast({
      title: '敬请期待',
      icon: 'none'
    })
  }
}

const documents = [
  { name: '版权声明', path: '' },
  { name: '用户协议', path: '/uni_modules/sv-id-pages/pages/agreements/service' },
  { name: '隐私条款', path: '/uni_modules/sv-id-pages/pages/agreements/privacy' }
]

function onDocument(item) {
  if (item.path) {
    uni.navigateTo({
      url: item.path
    })
  } else {
    uni.showToast({
      title: '敬请期待',
      icon: 'none'
    })
  }
}
</script>

<style lang="scss">
.about {
  height: var(--page-notab-height);
  position: relative;

  .about-header {
    padding-top: 120rpx;
  }

  .about-list {
    margin: 60rpx 30rpx;
  }

  .about-footer {
    width: 100%;
    position: absolute;
    bottom: 0;
    line-height: 1.5;

    .about-document {
      color: #66ccff;

      &:active {
        color: $uni-color-primary;
      }

      &::after {
        content: '丨';
        color: #66ccff;
      }

      &:last-child::after {
        display: none;
      }
    }
  }
}
</style>
