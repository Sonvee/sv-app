<template>
  <view class="sv-id-pages-sms">
    <!-- 表单 -->
    <view class="form">
      <!-- 登录 -->
      <sv-id-pages-mobile-sms
        style="height: 100%"
        codeScene="login-by-sms"
        captchaScene="send-sms-code"
        @submit="submitLogin"
      ></sv-id-pages-mobile-sms>
    </view>
    <!-- 隐私政策 -->
    <view class="agreements">
      <sv-id-pages-agreements ref="agreements"></sv-id-pages-agreements>
    </view>
  </view>
</template>

<script>
import mixin from '@/uni_modules/sv-id-pages/common/login-page.mixin.js'
const uniIdCo = uniCloud.importObject('uni-id-co', {
  errorOptions: {
    type: 'toast'
  }
})

export default {
  mixins: [mixin],
  data() {
    return {
      form: {}
    }
  },
  methods: {
    // 登录表单校验
    submitLogin(formRes) {
      if (formRes) this.form = formRes
      if (!this.agree) {
        this.$refs.agreements.popup(this.submitLogin)
        return
      }
      // 调用uniIdCo云对象进行登录
      uni.showLoading({
        title: '登录中',
        mask: true
      })
      uniIdCo
        .loginBySms(this.form)
        .then((res) => {
          uni.hideLoading()
          this.loginSuccess(res)
        })
        .catch((err) => {
          uni.hideLoading()
          uni.showModal({
            content: err.message,
            showCancel: false
          })
        })
    }
  }
}
</script>

<style lang="scss">
@import '../../common/style.scss';

.sv-id-pages-sms {
  width: 100%;
  display: flex;
  justify-content: center;

  .form {
    width: 70%;
    height: 780rpx;
    border: 1px solid #{$uni-border-color};
    border-radius: 24rpx;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.1);
    position: relative;
    display: flex;
    flex-direction: column;
    padding: 24rpx;

    // 毛玻璃
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }
}
</style>
