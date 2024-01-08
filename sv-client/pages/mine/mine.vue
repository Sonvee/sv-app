<template>
  <sv-page>
    <sv-nav-bar :options="{ placeholder: false }"></sv-nav-bar>
    <view class="mine">
      <!-- 头部 -->
      <view class="header">
        <image class="header-bg" :src="authInfo?.avatar_file?.url" mode="aspectFill"></image>
        <view class="header-content">
          <view class="flex" @click="onAuth">
            <tn-avatar :url="authInfo?.avatar_file?.url" size="120rpx" shadow>V</tn-avatar>
            <view class="margin-left-sm flex flex-direction justify-around flex-sub">
              <text class="text-xl text-mauve">{{ authInfo?.nickname || '登录/注册' }}</text>
              <text class="text-lg text-blue">{{ authInfo?.nickname || 'Hi, 欢迎 ~' }}</text>
            </view>
            <view class="flex align-center">
              <tn-icon name="right" size="40rpx" />
            </view>
          </view>
          <view class="grid col-4 text-center margin-top">
            <view class="padding" v-for="item in scoreData" :key="item">
              <view class="text-xxl text-red">{{ item.value }}</view>
              <view class="text-lg">{{ item.name }}</view>
            </view>
          </view>
        </view>
      </view>
      <!-- <view class="vip">
        <view class="vip-card card text-yellow">vip</view>
      </view> -->
      <!-- 常用功能 -->
      <view class="feature card">
        <view class="cu-bar">
          <view class="action sub-title">
            <text class="text-xl text-bold text-blue">常用功能</text>
            <text class="text-ABC text-blue">feature</text>
          </view>
        </view>
        <view class="grid col-4 text-center">
          <view class="flex flex-direction align-center" v-for="item in featureMenu" :key="item">
            <image class="cu-avatar lg radius" src="/static/logo.png"></image>
            <view class="text-df margin-top-xs">{{ item.name }}</view>
          </view>
        </view>
      </view>
      <!-- 列表功能 -->
      <view class="cu-list menu sm-border card-menu sv-list-menu">
        <view class="cu-item arrow" v-for="item in listMenu" :key="item" @click="onListMenu(item)">
          <view class="content">
            <text class="text-grey" :class="item.icon"></text>
            <text class="text-grey">{{ item.name }}</text>
          </view>
        </view>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { storageAuth } from '@/utils/pinia-storage'
import { getAuthFromCache } from '@/utils/sys'
import { useSysStore } from '@/store/sys'

onShow(() => {
  handleCache()
})

const navbarHeight = computed(() => {
  const sysConfig = useSysStore().getConfig()
  return sysConfig.navbarHeight + 'px'
})

const authInfo = ref({})

async function handleCache() {
  /**
   * 先进行手动刷新pinia中auth缓存，再获取
   * 因为在单独更新用户头像和昵称等资料时，无法响应式刷新pinia中auth数据
   * 从而造成未能实时刷新更改后的个人资料，故需要手动调用storageAuth进行更新
   */
  storageAuth()
  authInfo.value = await getAuthFromCache()
}

function onAuth() {
  uni.navigateTo({
    url: '/uni_modules/sv-id-pages/pages/userinfo/userinfo'
  })
}

const scoreData = ref([
  {
    name: '积分',
    value: 96
  },
  {
    name: '积分',
    value: 1923
  },
  {
    name: '积分',
    value: 12
  },
  {
    name: '积分',
    value: 346
  }
])

const featureMenu = ref([
  {
    menu_id: '',
    name: '错题本',
    url: '',
    icon: '',
    sort: 0
  },
  {
    menu_id: '',
    name: '模拟考',
    url: '',
    icon: '',
    sort: 0
  },
  {
    menu_id: '',
    name: '我的试卷',
    url: '',
    icon: '',
    sort: 0
  },
  {
    menu_id: '',
    name: '我的题库',
    url: '',
    icon: '',
    sort: 0
  }
])

const listMenu = ref([
  {
    menu_id: '',
    name: '我的二维码',
    url: '',
    icon: 'cuIcon-qrcode',
    sort: 0
  },
  {
    menu_id: '',
    name: '消息通知',
    url: '',
    icon: 'cuIcon-message',
    sort: 0
  },
  {
    menu_id: '',
    name: '问题反馈',
    url: '',
    icon: 'cuIcon-service',
    sort: 0
  },
  {
    menu_id: '',
    name: '设置',
    url: '/pages/mine/setting/setting',
    icon: 'cuIcon-settings',
    sort: 0
  }
])

function onListMenu(item) {
  if (item.url) uni.navigateTo({ url: item.url })
}
</script>

<style lang="scss">
.mine {
  height: 100%;
  position: relative;

  @include useTheme {
    background-color: getTheme('sv-background-color');
    color: getTheme('sv-text-color');
  }

  .header {
    width: 100%;
    position: relative;

    .header-bg {
      width: 100%;
      height: calc(360rpx + v-bind(navbarHeight));
      filter: blur(30rpx);
      opacity: 0.8;
    }

    .header-content {
      position: absolute;
      top: v-bind(navbarHeight);
      left: 0;
      right: 0;
      bottom: 0;
      margin: 30rpx;
    }
  }

  .vip {
    margin: 0 30rpx;
    height: 280rpx;
    position: relative;
    top: -28rpx;
    border-radius: 20rpx;
    background: linear-gradient(135deg, #152331, #000000);

    .vip-card {
      height: 100%;
    }
  }

  .feature {
    margin: 0 30rpx;
    position: relative;
    padding-bottom: 30rpx;
  }

  .sv-list-menu {
    margin: 30rpx;
    .cu-item {
      @include useTheme {
        background-color: getTheme('sv-background-highlight-color');
      }
    }
  }
}
</style>
