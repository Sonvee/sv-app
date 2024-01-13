<template>
  <view class="sv-id-pages-account">
    <!-- 表单 -->
    <view class="form" :class="{ flip: flipFlag }">
      <!-- 登录 -->
      <view class="login-form">
        <uni-forms ref="loginform" :model="loginFormData" :rules="rules" label-width="0">
          <uni-forms-item name="usernameAndMobile">
            <uni-easyinput
              v-model="loginFormData.usernameAndMobile"
              placeholder="请输入用户名/手机号"
              prefixIcon="person"
            ></uni-easyinput>
          </uni-forms-item>
          <uni-forms-item name="password">
            <uni-easyinput
              v-model="loginFormData.password"
              placeholder="请输入密码"
              prefixIcon="locked"
              type="password"
            ></uni-easyinput>
          </uni-forms-item>
          <uni-forms-item name="captcha" v-if="loginCaptchaFlag">
            <view class="sv-uni-captcha">
              <uni-captcha ref="captcha" v-model="loginFormData.captcha" scene="login-by-pwd" />
            </view>
          </uni-forms-item>
        </uni-forms>
        <view class="skip">
          <view @click="skipForget">忘记密码?</view>
          <view @click="skipRegister">注册账号</view>
        </view>
        <button class="login-btn" type="primary" @click="submitLogin">登录</button>
      </view>
      <!-- 注册 -->
      <view class="register-form">
        <uni-forms ref="registerform" :model="registerFormData" :rules="rules" label-width="0">
          <uni-forms-item name="username">
            <uni-easyinput
              v-model="registerFormData.username"
              placeholder="请输入用户名"
              prefixIcon="person"
            ></uni-easyinput>
          </uni-forms-item>
          <uni-forms-item name="nickname">
            <uni-easyinput
              v-model="registerFormData.nickname"
              placeholder="请输入用户昵称 (可选)"
              prefixIcon="person-filled"
            ></uni-easyinput>
          </uni-forms-item>
          <uni-forms-item name="password">
            <uni-easyinput
              v-model="registerFormData.password"
              placeholder="请输入密码"
              prefixIcon="locked"
              type="password"
            ></uni-easyinput>
          </uni-forms-item>
          <uni-forms-item name="password2">
            <uni-easyinput
              v-model="registerFormData.password2"
              placeholder="请确认密码"
              prefixIcon="locked-filled"
              type="password"
            ></uni-easyinput>
          </uni-forms-item>
          <uni-forms-item name="captcha" v-if="registerCaptchaFlag">
            <view class="sv-uni-captcha">
              <uni-captcha ref="captcha" v-model="registerFormData.captcha" scene="register" />
            </view>
          </uni-forms-item>
        </uni-forms>
        <view class="skip">
          <view @click="skipLogin">返回登录</view>
        </view>
        <button class="register-btn" type="warn" @click="submitRegister">注册并登录</button>
      </view>
    </view>
    <!-- 隐私政策 -->
    <view class="agreements">
      <sv-id-pages-agreements ref="agreements"></sv-id-pages-agreements>
    </view>
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
  data() {
    return {
      loginFormData: {
        usernameAndMobile: '',
        password: '',
        captcha: ''
      },
      registerFormData: {
        username: '',
        nickname: '',
        password: '',
        password2: '',
        captcha: ''
      },
      rules,
      loginCaptchaFlag: false, // 登录验证码flag防反复重刷，登录失败超过限定次数需要输入验证码
      registerCaptchaFlag: false, // 注册验证码flag防反复重刷
      flipFlag: false // 卡片翻转
    }
  },
  mounted() {
    // 表单验证规则（uni-id-pages同步）
    this.$refs.loginform.setRules(this.rules)
  },
  methods: {
    // 登录表单校验
    submitLogin() {
      if (!this.agree) {
        this.$refs.agreements.popup(this.submitLogin)
        return
      }
      // 判断用用户id登录还是手机号登录
      let phoneReg = /^1\d{10}$/
      const { password, captcha } = this.loginFormData
      let loginObj = { password, captcha }
      if (phoneReg.test(this.loginFormData.usernameAndMobile)) {
        loginObj.mobile = this.loginFormData.usernameAndMobile
      } else {
        loginObj.username = this.loginFormData.usernameAndMobile
      }
      this.$refs.loginform
        .validate()
        .then(() => {
          // 调用uniIdCo云对象进行登录
          uniIdCo
            .login(loginObj)
            .then((res) => {
              this.loginSuccess(res)
            })
            .catch((err) => {
              //登录失败，自动重新获取验证码
              if (err.errCode == 'uni-id-captcha-required') {
                this.loginCaptchaFlag = true
              } else if (this.loginCaptchaFlag) {
                //登录失败，自动重新获取验证码
                this.$refs.captcha.getImageCaptcha()
              }
            })
        })
        .catch((formErr) => {
          console.log('==== 表单校验失败 :', formErr)
        })
    },
    // 注册表单校验
    submitRegister() {
      if (!this.agree) {
        this.$refs.agreements.popup(this.submitRegister)
        return
      }
      this.$refs.registerform
        .validate()
        .then((formRes) => {
          // 调用uniIdCo云对象进行注册
          uniIdCo
            .registerUser(formRes)
            .then((res) => {
              this.loginSuccess(res)
            })
            .catch((err) => {
              // 注册错误，直接刷新验证码
              this.$refs.captcha.getImageCaptcha()
            })
        })
        .catch((formErr) => {
          console.log('==== 表单校验失败 :', formErr)
        })
    },
    // 忘记密码
    skipForget() {
      uni.navigateTo({
        url: '/uni_modules/sv-id-pages/pages/userinfo/set-pwd/set-pwd?loginType=resetPwdBySms'
      })
    },
    // 跳转注册
    skipRegister() {
      this.flipFlag = true
      this.registerCaptchaFlag = true
    },
    // 跳转登录
    skipLogin() {
      this.flipFlag = false
    }
  }
}
</script>

<style lang="scss">
@import '../../common/style.scss';

.sv-id-pages-account {
  width: 100%;
  display: flex;
  justify-content: center;

  .form {
    width: 70%;
    height: 780rpx;
    margin: 0 auto;
    border: 1px solid #{$uni-border-color};
    border-radius: 24rpx;
    box-sizing: border-box;
    background-color: rgba(255, 255, 255, 0.1);
    position: relative;
    transition: transform 0.8s;
    transform-style: preserve-3d;

    .login-form,
    .register-form {
      display: flex;
      flex-direction: column;
      box-sizing: border-box;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 12px;
      border-radius: 24rpx;

      // 隐藏背面
      backface-visibility: hidden;
      -webkit-backface-visibility: hidden;
      // 毛玻璃
      backdrop-filter: blur(4px);
      -webkit-backdrop-filter: blur(4px);

      .skip {
        font-size: 12px;
        color: var(--svid-text-color);
        display: flex;
        justify-content: space-between;
        margin: auto 0 24rpx 0;
      }

      .login-btn,
      .register-btn {
        width: 100%;
        line-height: unset;
        font-size: 14px;
        padding: 16rpx 0;
      }
    }

    .login-form {
    }
    .register-form {
      transform: rotateY(180deg);
    }
  }

  .agreements {
    position: fixed;
    bottom: 24rpx;
    width: 100%;
    display: flex;
    justify-content: center;
  }

  .flip {
    transform: rotateY(180deg);
  }
}
</style>
