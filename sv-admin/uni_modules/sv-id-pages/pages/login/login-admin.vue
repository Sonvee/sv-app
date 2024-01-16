<template>
  <view class="sv-id-login-admin">
    <view class="intro">
      <view class="header">
        <image class="header-logo" :src="logoSrc" mode="heightFix"></image>
        <view class="header-title">
          <view class="title-text">{{ adminName }}</view>
          <view class="title-text-sub">{{ adminDescription }}</view>
        </view>
      </view>
      <view class="middle">
        <image class="middle-cover" src="../../static/cover.svg" mode="widthFix"></image>
      </view>
    </view>
    <view class="form-main">
      <view class="wave-divider">
        <image class="wave-image" src="../../static/wave.svg"></image>
      </view>
      <view class="circle-big vibrate"></view>
      <view class="circle-small pulsate"></view>

      <view class="form" :class="{ flip: flipFlag }">
        <!-- 登录 -->
        <view class="login-form">
          <view class="form-title neon-flash">{{ adminName }} 欢迎您！</view>
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
                class="sv-uni-captcha"
                ref="captcha"
                v-model="loginFormData.captcha"
                scene="login-by-pwd"
              />
            </uni-forms-item>
          </uni-forms>
          <view class="skip">
            <view @click="skipForget">忘记密码?</view>
            <view v-if="!existAdmin" @click="skipRegisterAdmin">注册管理员账号</view>
          </view>
          <button class="login-btn" type="primary" @click="submitLogin">登录</button>
        </view>
        <!-- 注册 -->
        <view class="register-form">
          <view class="form-title neon-flash">{{ adminName }} 欢迎您！</view>
          <uni-forms ref="registerform" :model="registerFormData" :rules="rules" label-width="0">
            <uni-forms-item name="username">
              <uni-easyinput
                v-model="registerFormData.username"
                placeholder="请输入管理员用户名"
                prefixIcon="person"
              ></uni-easyinput>
            </uni-forms-item>
            <uni-forms-item name="nickname">
              <uni-easyinput
                v-model="registerFormData.nickname"
                placeholder="请输入管理员昵称 (可选)"
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
          </uni-forms>
          <view class="skip">
            <view @click="skipLogin">返回登录</view>
          </view>
          <button class="register-btn" type="warn" @click="submitRegister">注册</button>
        </view>
      </view>
      <!-- 隐私政策 -->
      <view class="agreements">
        <sv-id-pages-agreements ref="agreements"></sv-id-pages-agreements>
      </view>
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
      adminName: 'sv-admin管理系统',
      adminDescription: '开源好用的uniapp云端一体管理后台',
      logoSrc: '/static/logo.png',
      loginFormData: {
        username: '',
        password: '',
        captcha: ''
      },
      registerFormData: {
        username: '',
        nickname: '',
        password: '',
        password2: ''
      },
      rules,
      loginCaptchaFlag: false, // 登录验证码flag防反复重刷，登录失败超过限定次数需要输入验证码
      flipFlag: false, // 卡片翻转
      existAdmin: true
    }
  },
  async onLoad() {
    // 查询是否已经有管理员注册了，如果有，则隐藏注册管理员的入口
    try {
      const db = uniCloud.database()
      let countRes = await db.collection('uni-id-users').where({ role: 'admin' }).count()
      let count = countRes.result.total
      this.existAdmin = count > 0 ? true : false
    } catch (err) {
      this.existAdmin = false
    }
  },
  methods: {
    // 登录表单校验
    submitLogin() {
      if (!this.agree) {
        this.$refs.agreements.popup(this.submitLogin)
        return
      }
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
          // 调用uniIdCo云对象创建超级管理员账号
          uniIdCo
            .registerAdmin(formRes)
            .then((res) => {
              uni.showToast({
                title: '注册成功',
                icon: 'none'
              })
              this.skipLogin()
            })
            .catch((err) => {
              uni.showModal({
                title: '提示',
                content: err.errMsg || `创建失败: ${err.errCode}`,
                showCancel: false
              })
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
    skipRegisterAdmin() {
      this.flipFlag = true
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

.sv-id-login-admin {
  height: 100vh;
  display: flex;
  background: linear-gradient(135deg, #c2ffd8, #465efb);

  .intro {
    flex-grow: 1.5;
    background: linear-gradient(to right, #75f4ff, #d3efff);
    position: relative;
    overflow: hidden;

    .header {
      position: absolute;
      top: 5%;
      left: 5%;
      display: flex;
      height: 52px;
      box-sizing: border-box;

      .header-logo {
        flex-shrink: 0;
        height: inherit;
      }
      .header-title {
        height: inherit;
        margin-left: 12px;
        white-space: nowrap;

        .title-text {
          line-height: 30px;
          font-size: 20px;
          font-weight: 700;
          color: $uni-color-primary;
        }

        .title-text-sub {
          line-height: 22px;
          font-size: 14px;
          color: $uni-color-error;
        }
      }
    }

    .middle {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 70%;

      .middle-cover {
        width: 100%;
      }
    }
  }

  .form-main {
    flex-grow: 1;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .wave-divider {
      width: 10%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      overflow: hidden;

      .wave-image {
        width: 100%;
        height: 100%;
      }
    }

    .circle-big {
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background-color: rgba(33, 55, 255, 0.2);
      position: absolute;
      right: 100px;
      top: 100px;
      filter: blur(20px);
      pointer-events: none;
    }
    .circle-small {
      width: 200px;
      height: 200px;
      border-radius: 50%;
      background-color: rgba(71, 237, 255, 0.2);
      position: absolute;
      left: 100px;
      bottom: 150px;
      filter: blur(10px);
      pointer-events: none;
    }

    .form {
      width: 50%;
      height: 40%;
      background-color: rgba(255, 255, 255, 0.1);
      border: 1px solid #f1f1f166;
      border-radius: 12px;
      box-sizing: border-box;
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
        border-radius: 12px;

        // 隐藏背面
        backface-visibility: hidden;
        -webkit-backface-visibility: hidden;
        // 毛玻璃
        backdrop-filter: blur(4px);
        -webkit-backdrop-filter: blur(4px);

        .form-title {
          font-size: 18px;
          color: #ffffff;
          font-weight: 700;
          margin-bottom: 12px;
          text-align: center;
        }

        .skip {
          font-size: 12px;
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          margin: auto 0 12px 0;
        }

        .login-btn,
        .register-btn {
          width: 100%;
          line-height: unset;
          font-size: 14px;
          padding: 8px 0;
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
}

// 响应式布局
@media screen and (max-width: 1600px) {
  .intro {
    flex-grow: 1.2 !important;
  }
}
@media screen and (max-width: 1400px) {
  .intro {
    flex-grow: 0.8 !important;
  }
}
@media screen and (max-width: 1200px) {
  .intro {
    flex-grow: 0.4 !important;
  }
}
@media screen and (max-width: 1000px) {
  .intro {
    flex-grow: 0 !important;
  }
  .header {
    position: fixed !important;
    top: 8% !important;
    left: 50% !important;
    transform: translateX(-50%) !important;
  }
  .form {
    min-width: 280px;
    min-height: 360px;
  }
}
</style>
