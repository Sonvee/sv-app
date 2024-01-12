<template>
  <view class="sv-bind-mobile">
    <view class="header">
      <image class="verify-logo" src="../../../static/icons/verification.png" mode=""></image>
      <text class="tips">为了您的账号安全，需要验证您的设备</text>
    </view>
    <view class="verify-form">
      <sv-id-pages-mobile-sms
        codeScene="bind-mobile-by-sms"
        captchaScene="send-sms-code"
        @submit="submitBind"
      ></sv-id-pages-mobile-sms>
    </view>
  </view>
</template>

<script>
import mixin from '@/uni_modules/sv-id-pages/common/login-page.mixin.js'
import { mutations } from '../../../common/store'
const uniIdCo = uniCloud.importObject('uni-id-co', {
  errorOptions: {
    type: 'toast'
  }
})

export default {
  mixins: [mixin],
  data() {
    return {}
  },
  methods: {
    submitBind(formRes) {
      uniIdCo
        .bindMobileBySms(formRes)
        .then((res) => {
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
        .finally(() => {})
    }
  }
}
</script>

<style lang="scss">
.sv-bind-mobile {
  --svid-input-line-height: 35px;

  .header {
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    border-bottom: 1px solid #f2f2f2;

    .verify-logo {
      width: 128px;
      height: 128px;
    }

    .tips {
      margin-top: 20px;
      font-size: 16px;
    }
  }

  .verify-form {
    position: relative;
  }
}
</style>
