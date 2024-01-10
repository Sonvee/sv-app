<template>
  <view class="sv-id-pages-account">
    <!-- 表单 -->
    <view class="form" :class="{ flip: flipFlag }">
      <!-- 登录 -->
      <view class="login-form">
        <uni-forms ref="loginform" :model="loginFormData" :rules="rules" label-width="0">
          <uni-forms-item name="username">
            <uni-easyinput
              v-model="loginFormData.username"
              placeholder="请输入用户名"
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
            <uni-captcha
              class="captcha-style"
              ref="captcha"
              v-model="loginFormData.captcha"
              scene="login-by-pwd"
            />
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
              placeholder="请输入用户昵称"
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
            <uni-captcha
              class="captcha-style"
              ref="captcha"
              v-model="registerFormData.captcha"
              scene="register"
            />
          </uni-forms-item>
        </uni-forms>
        <view class="skip">
          <view @click="skipLogin">返回登录</view>
        </view>
        <button class="register-btn" type="warn" @click="submitRegister">注册</button>
      </view>
    </view>
  </view>
</template>

<script>
import rules from '@/uni_modules/sv-id-pages/common/validator.js'
const uniIdCo = uniCloud.importObject('uni-id-co', {
  errorOptions: {
    type: 'toast'
  }
})
export default {
  data() {
    return {
      loginFormData: {
        username: '',
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
      this.$refs.loginform
        .validate()
        .then((formRes) => {
          // 调用uniIdCo云对象进行登录
          uniIdCo
            .login(formRes)
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
      uni.showToast({
        title: '请联系管理员找回密码',
        icon: 'none'
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
$uni-input-line-height: 35px;

.sv-id-pages-account {
  width: 100%;
  display: flex;
  justify-content: center;

  .form {
    width: 70%;
    height: 780rpx;
    border: 1px solid #aaaaaa66;
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

      .captcha-style {
        ::v-deep .captcha-img-box {
          background-color: transparent;
          height: $uni-input-line-height !important;

          .captcha-img {
            height: $uni-input-line-height !important;
            border: 1px dashed #777777;
          }
          .loding {
            height: $uni-input-line-height !important;
            line-height: $uni-input-line-height;
          }
        }
        ::v-deep .captcha {
          height: $uni-input-line-height !important;
          border-radius: 8rpx;
        }
      }

      .skip {
        font-size: 12px;
        color: #cccccc;
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

  .flip {
    transform: rotateY(180deg);
  }
}
</style>
