<template>
  <view class="sv-id-pages sv-id-login">
    <!-- 背景 -->
    <view class="login-bg">
      <image class="bg-image" :src="bgImage"></image>
    </view>
    <view class="login-main">
      <!-- logo -->
      <view class="logo">
        <image :src="logoSrc" style="width: 100%; height: 100%"></image>
      </view>
      <view class="title focus-in-contract">
        <text class="neon-flash">{{ appName }}</text>
      </view>
      <!-- 登录模块 -->
      <view class="login-mode">
        <sv-id-login-account v-if="loginMode == 'account'"></sv-id-login-account>
        <sv-id-login-sms v-else-if="loginMode == 'sms'"></sv-id-login-sms>
        <sv-id-login-third-party v-else-if="loginMode == 'third'"></sv-id-login-third-party>
      </view>
      <!-- 第三方登录 -->
      <view class="fab-login">
        <sv-id-pages-fab-login @change-mode="changeMode"></sv-id-pages-fab-login>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      appName: 'sv-client App',
      logoSrc: '/static/logo.png', // logo图片地址
      bgImage: 'https://mp-74bfcbac-6ba6-4f39-8513-8831390ff75a.cdn.bspapp.com/static/xiaxue.gif', // 背景图片地址
      loginMode: 'account' // 登录模式：account sms third
    }
  },
  mounted() {},
  methods: {
    changeMode(mode) {
      this.loginMode = mode
    }
  }
}
</script>

<style lang="scss">
@import '../../common/style.scss';

.sv-id-login {
  --svid-text-color: #ffffff;

  height: 100vh;
  /* #ifdef APP */
  touch-action: pan-y;
  /* #endif */

  .login-bg {
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 0;
    display: flex;

    .bg-image {
      flex: 1;
      width: 100%;
      height: 100%;
    }
  }

  .login-main {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .logo {
      width: 200rpx;
      height: 200rpx;
    }

    .title {
      height: 120rpx;
      line-height: 120rpx;
      font-size: 20px;
      color: #ffffff;
    }

    .login-mode {
      width: 100%;
    }

    .fab-login {
      width: 70%;
      height: 120rpx;
      margin-top: 24rpx;
      z-index: 9;
    }
  }
}
</style>
