<template>
  <!-- 第三方快捷登录 -->
  <view class="quick-login">
    <view class="quick-login-btn account-login" @click="accountLogin">
      <uni-icons type="staff-filled" size="30" color="#ffffff"></uni-icons>
    </view>
    <view class="quick-login-btn sms-login" @click="smstLogin">
      <uni-icons type="email-filled" size="30" color="#ffffff"></uni-icons>
    </view>
    <view class="quick-login-btn phone-login" @click="phoneLogin">
      <uni-icons type="phone-filled" size="30" color="#ffffff"></uni-icons>
    </view>
    <view class="quick-login-btn weixin-login" @click="weixinLogin">
      <uni-icons type="weixin" size="30" color="#ffffff"></uni-icons>
    </view>
  </view>
</template>

<script>
import { mutations } from '@/uni_modules/sv-id-pages/common/store.js'
import config from '@/uni_modules/sv-id-pages/config.js'
const uniIdCo = uniCloud.importObject('uni-id-co', {
  errorOptions: {
    type: 'toast'
  }
})

export default {
  data() {
    return {}
  },
  methods: {
    accountLogin() {
      // 账号密码登录
      this.$emit('change-mode', 'account')
    },
    smstLogin() {
      // 短信验证码登录
      this.$emit('change-mode', 'sms')
    },
    phoneLogin() {
      // 手机号一键登录
      this.$emit('change-mode', 'phone')
    },
    weixinLogin() {
      // 微信登录

      // #ifndef H5
      uni.showLoading({
        title: '登录中，请稍后',
        mask: true
      })
      uni.login({
        provider: type,
        onlyAuthorize: true,
        success: (res) => {
          console.log('==== uni.login success :', res)
          this.loginAction({ code: res.code }, type)
        },
        fail: (err) => {
          console.log('==== uni.login fail', err)
        },
        complete: () => {
          uni.hideLoading()
        }
      })
      // #endif

      // #ifdef H5
      // #ifdef VUE2
      const baseUrl = process.env.BASE_URL
      // #endif
      // #ifdef VUE3
      const baseUrl = import.meta.env.BASE_URL
      // #endif

      let redirectUrl =
        location.protocol +
        '//' +
        location.host +
        baseUrl.replace(/\/$/, '') +
        (window.location.href.includes('#') ? '/#' : '') +
        '/uni_modules/sv-id-pages/pages/login/login-h5?type=weixin'

      console.log('redirectUrl----', redirectUrl)
      let ua = window.navigator.userAgent.toLowerCase()
      if (ua.match(/MicroMessenger/i) == 'micromessenger') {
        // 在微信公众号内
        return window.open(`https://open.weixin.qq.com/connect/oauth2/authorize?
      						appid=${config.appid.weixin.h5}
      						&redirect_uri=${encodeURIComponent(redirectUrl)}
      						&response_type=code
      						&scope=snsapi_userinfo
      						&state=STATE&connect_redirect=1#wechat_redirect`)
      } else {
        // 非微信公众号内
        return (location.href = `https://open.weixin.qq.com/connect/qrconnect?
                  appid=${config.appid.weixin.web}
                  &redirect_uri=${encodeURIComponent(redirectUrl)}
                  &response_type=code
                  &scope=snsapi_login
                  &state=STATE#wechat_redirect`)
      }
      // #endif
    },
    loginAction(params, type) {
      // 联网验证登录
      let action = 'loginBy' + type.trim().replace(type[0], type[0].toUpperCase())
      uniIdCo[action](params)
        .then((result) => {
          uni.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 2000
          })
          mutations.loginSuccess(result)
        })
        .catch((err) => {
          uni.showModal({
            content: err.message,
            confirmText: '知道了',
            showCancel: false
          })
        })
    }
  }
}
</script>

<style lang="scss">
.quick-login {
  width: 70vw;
  height: 120rpx;
  margin-top: 40rpx;
  display: flex;
  justify-content: space-around;
  align-items: center;

  .quick-login-btn {
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
  }
  .quick-login-btn:active {
    opacity: 0.9;
  }
  .account-login {
    background: linear-gradient(135deg, #5ee2ff, #5aa7ee);
  }
  .sms-login {
    background: linear-gradient(135deg, #3ea2ff, #4561ff);
  }
  .phone-login {
    background: linear-gradient(135deg, #ffbc11, #ff2f21);
  }
  .weixin-login {
    background: linear-gradient(135deg, #36ff4d, #29c53c);
  }
}
</style>
