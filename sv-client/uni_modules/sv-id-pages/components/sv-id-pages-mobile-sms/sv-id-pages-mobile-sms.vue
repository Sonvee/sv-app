<template>
  <view class="sv-id-mobile-sms">
    <uni-forms ref="formRef" :model="formData" :rules="rules" label-width="0">
      <uni-forms-item name="mobile">
        <uni-easyinput
          v-model="formData.mobile"
          type="number"
          placeholder="请输入手机号码"
          prefixIcon="phone"
          maxlength="11"
        ></uni-easyinput>
      </uni-forms-item>
      <uni-forms-item name="captcha">
        <uni-captcha
          class="captcha-style"
          ref="captcha"
          v-model="formData.captcha"
          :scene="captchaScene"
        />
      </uni-forms-item>
      <uni-forms-item name="code">
        <uni-easyinput
          v-model="formData.code"
          placeholder="请输入短信验证码"
          maxlength="6"
          type="number"
        >
          <template #right>
            <view class="smscode-text" @click="getSmsCode">{{ smsCodeText }}</view>
          </template>
        </uni-easyinput>
      </uni-forms-item>
    </uni-forms>
    <button class="login-btn" type="primary" @click="submit">{{ submitText }}</button>
  </view>
</template>

<script>
import mixin from '@/uni_modules/sv-id-pages/common/login-page.mixin.js'
import rules from '@/uni_modules/sv-id-pages/common/validator.js'
const uniIdCo = uniCloud.importObject('uni-id-co', {
  errorOptions: {
    type: 'toast'
  }
})

export default {
  mixins: [mixin],
  props: {
    codeScene: {
      type: String,
      default: 'login-by-sms' // [login-by-sms|reset-pwd-by-sms|bind-mobile-by-sms]
    },
    captchaScene: {
      type: String,
      default: 'send-sms-code' // [send-sms-code|bind-mobile-by-sms]
    }
  },
  data() {
    return {
      formData: {
        mobile: uni.getStorageSync('uni-id-pages-userInfo')?.mobile || '',
        captcha: '',
        code: ''
      },
      rules,
      reverseNumber: 0,
      reverseTimer: null
    }
  },
  computed: {
    smsCodeText() {
      if (this.reverseNumber == 0) return '获取短信验证码'
      return '重新发送' + '(' + this.reverseNumber + 's)'
    },
    submitText() {
      let text = ''
      switch (this.codeScene) {
        case 'login-by-sms':
          text = '登录'
          break
        case 'reset-pwd-by-sms':
          text = '重置密码'
          break
        case 'bind-mobile-by-sms':
          text = '绑定手机'
          break
      }
      return text
    }
  },
  mounted() {
    // 表单验证规则（uni-id-pages同步）
    this.$refs.formRef.setRules(this.rules)
  },
  methods: {
    submit() {
      this.$refs.formRef
        .validate()
        .then((formRes) => {
          this.$emit('submit', formRes)
        })
        .catch((formErr) => {
          console.log('==== 表单校验失败 :', formErr)
        })
    },
    // 获取短信验证码
    getSmsCode() {
      if (this.reverseNumber > 0) return
      // 先校验手机号和图形验证码
      if (!/^1\d{10}$/.test(this.formData.mobile)) {
        return uni.showToast({
          title: '手机号格式错误',
          icon: 'none'
        })
      }
      if (this.formData.captcha.length != 4) {
        return uni.showToast({
          title: '请先输入图形验证码',
          icon: 'none'
        })
      }
      // 请求验证码
      uniIdCo
        .sendSmsCode({
          mobile: this.formData.mobile,
          captcha: this.formData.captcha,
          scene: this.codeScene // [login-by-sms|reset-pwd-by-sms|bind-mobile]
        })
        .then((res) => {
          uni.showToast({
            title: '短信验证码发送成功',
            icon: 'none'
          })
          console.log('==== res :', res)
          // 倒计时
          this.reverseNumber = 60
          this.countdown()
        })
        .catch((err) => {
          if (err.code == 'uni-id-invalid-sms-template-id') {
            this.formData.code = '123456'
            uni.showToast({
              title: '已启动测试模式,详情【控制台信息】',
              icon: 'none'
            })
            console.warn(err.message)
            // 倒计时
            this.reverseNumber = 60
            this.countdown()
          } else {
            // this.$refs.captcha.getImageCaptcha()
            // this.captcha = ''
            uni.showToast({
              title: err.message,
              icon: 'none'
            })
          }
        })
    },
    // 倒计时节流60秒
    countdown() {
      if (this.reverseNumber == 0) {
        clearTimeout(this.reverseTimer)
        this.reverseTimer = null
        return
      }
      this.reverseNumber--
      this.reverseTimer = setTimeout(() => {
        this.countdown()
      }, 1000)
    }
  }
}
</script>

<style lang="scss">
.sv-id-mobile-sms {
  --svid-input-line-height: 35px;

  height: 100%;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 12px;
  border-radius: 24rpx;

  // 毛玻璃
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);

  .captcha-style {
    ::v-deep .captcha-img-box {
      background-color: transparent;
      height: var(--svid-input-line-height) !important;

      .captcha-img {
        height: var(--svid-input-line-height) !important;
        border: 1px dashed #{$uni-border-color};
      }
      .loding {
        height: var(--svid-input-line-height) !important;
        line-height: var(--svid-input-line-height);
      }
    }
    ::v-deep .captcha {
      height: var(--svid-input-line-height) !important;
      border-radius: 8rpx;
    }
  }

  .smscode-text {
    color: $uni-color-primary;
    font-size: 12px;
    margin-right: 12rpx;
    cursor: pointer;
  }
  .smscode-text:active {
    opacity: 0.8;
  }

  .login-btn {
    margin-top: auto;
    width: 100%;
    line-height: unset;
    font-size: 14px;
    padding: 16rpx 0;
  }
}
</style>
