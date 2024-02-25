<template>
  <view class="sv-id-mobile-sms">
    <view class="sv-id-mobile-sms-form">
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
          <view class="sv-uni-captcha">
            <uni-captcha ref="captcha" v-model="formData.captcha" :scene="captchaScene" />
          </view>
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
        <!-- 其他表单内容自行添加 -->
        <slot></slot>
      </uni-forms>
    </view>
    <view class="control-btn">
      <button class="submit-btn" type="primary" @click="submit">{{ submitText }}</button>
    </view>
  </view>
</template>

<script>
import rules from '@/uni_modules/sv-id-pages/common/validator.js'
const uniIdCo = uniCloud.importObject('uni-id-co', { customUI: true })

export default {
  props: {
    codeScene: {
      type: String,
      default: 'login-by-sms' // [login-by-sms|reset-pwd-by-sms|bind-mobile-by-sms|set-pwd-by-sms]
    },
    captchaScene: {
      type: String,
      default: 'send-sms-code' // [send-sms-code|bind-mobile-by-sms|set-pwd-by-sms]
    },
    // 表单自定义扩展项
    formExtra: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      formData: {
        mobile: '',
        captcha: '',
        code: ''
      },
      rules,
      reverseNumber: 0,
      reverseTimer: null
    }
  },
  watch: {
    formExtra: {
      deep: true,
      handler(newVal) {
        this.formData = Object.assign({ ...this.formData }, newVal)
      }
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
        case 'set-pwd-by-sms':
          text = '设置密码'
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
        .then(() => {
          this.$emit('submit', this.formData)
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
      uni.showLoading({
        title: '发送中',
        mask: true
      })
      // 请求验证码
      uniIdCo
        .sendSmsCode({
          mobile: this.formData.mobile,
          captcha: this.formData.captcha,
          scene: this.codeScene // [login-by-sms|reset-pwd-by-sms|bind-mobile]
        })
        .then(() => {
          uni.hideLoading()
          uni.showToast({
            title: '短信验证码发送成功',
            icon: 'none'
          })
          // 倒计时
          this.reverseNumber = 60
          this.countdown()
        })
        .catch((err) => {
          uni.hideLoading()
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
@import '../../common/style.scss';
.sv-id-mobile-sms {
  height: 100%;
  display: flex;
  flex-direction: column;

  .sv-id-mobile-sms-form {
    flex: 1;

    .smscode-text {
      color: $uni-color-primary;
      font-size: 12px;
      margin-right: 12rpx;
      cursor: pointer;
    }
    .smscode-text:active {
      opacity: 0.8;
    }
  }

  .control-btn {
    display: flex;

    .submit-btn {
      width: 100%;
      line-height: unset;
      font-size: 14px;
      padding: 16rpx 0;
    }
  }
}
</style>
