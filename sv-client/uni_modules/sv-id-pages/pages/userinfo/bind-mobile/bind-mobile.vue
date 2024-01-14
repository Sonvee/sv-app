<template>
  <view class="sv-id-bind-mobile">
    <view class="header">
      <image class="security-logo" :src="securityLogo.blue" mode=""></image>
      <text class="tips">为了您的账号安全，需要验证您的设备</text>
    </view>
    <view class="form">
      <sv-id-pages-mobile-sms
        codeScene="bind-mobile-by-sms"
        captchaScene="send-sms-code"
        @submit="submitBind"
      ></sv-id-pages-mobile-sms>
    </view>
  </view>
</template>

<script>
import securityBlue from '../../../static/security-blue.png'
import { mutations } from '@/uni_modules/sv-id-pages/common/store'
const uniIdCo = uniCloud.importObject('uni-id-co', {
  errorOptions: {
    type: 'toast'
  }
})

export default {
  data() {
    return {
      securityLogo: {
        blue: securityBlue
      }
    }
  },
  methods: {
    submitBind(formRes) {
      uniIdCo
        .bindMobileBySms(formRes)
        .then(() => {
          uni.showToast({
            title: '绑定成功',
            icon: 'success',
            duration: 2000
          })
          mutations.setUserInfo(formRes)
          setTimeout(() => {
            uni.navigateBack()
          }, 2000)
        })
        .catch((err) => {
          uni.showToast({
            title: err.message,
            icon: 'none'
          })
        })
    }
  }
}
</script>

<style lang="scss">
.sv-id-bind-mobile {
  .header {
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;
    box-sizing: border-box;

    .security-logo {
      width: 128px;
      height: 128px;
    }

    .tips {
      margin-top: 20px;
      font-size: 16px;
    }
  }

  .form {
    height: 100%;
    display: flex;
    flex-direction: column;
    box-sizing: border-box;
    padding: 24rpx;
    border-radius: 24rpx;
  }
}
</style>
