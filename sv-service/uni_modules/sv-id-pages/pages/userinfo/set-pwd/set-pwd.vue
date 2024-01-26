<template>
  <view class="sv-id-pages sv-id-set-pwd">
    <view class="header">
      <image class="security-logo" :src="securityLogo.orange" mode=""></image>
      <text class="tips">为了您的账号安全，需要验证您的设备</text>
    </view>
    <view class="form">
      <sv-id-pages-mobile-sms
        :formExtra="formData"
        :codeScene="codeScene"
        captchaScene="send-sms-code"
        @submit="submitSet"
      >
        <uni-forms-item name="password">
          <uni-easyinput
            v-model="formData.password"
            placeholder="请输入密码"
            prefixIcon="locked"
            type="password"
          ></uni-easyinput>
        </uni-forms-item>
        <uni-forms-item name="password2">
          <uni-easyinput
            v-model="formData.password2"
            placeholder="请确认密码"
            prefixIcon="locked-filled"
            type="password"
          ></uni-easyinput>
        </uni-forms-item>
      </sv-id-pages-mobile-sms>
    </view>
  </view>
</template>

<script>
import securityOrange from '../../../static/security-orange.png'
import { mutations } from '../../../common/store'
import valid from '../../../common/password.js'
const uniIdCo = uniCloud.importObject('uni-id-co', { customUI: true })

export default {
  data() {
    return {
      securityLogo: {
        orange: securityOrange
      },
      formData: {
        password: '',
        password2: ''
      },
      codeScene: 'set-pwd-by-sms',
      loginType: ''
    }
  },
  onLoad(e) {
    this.loginType = e.loginType
    this.codeScene = this.loginType == 'resetPwdBySms' ? 'reset-pwd-by-sms' : 'set-pwd-by-sms'
  },
  methods: {
    submitSet(formRes) {
      const { mobile, password, password2, code, captcha } = formRes
      // 微信小程序中要再做一次密码校验
      let validRes = valid.validPwd(password)
      if (validRes !== true) {
        uni.showToast({
          title: validRes,
          icon: 'none'
        })
        return
      }
      if (password !== password2) {
        uni.showToast({
          title: '两次输入密码不一致',
          icon: 'none'
        })
        return
      }
      if (this.loginType == 'resetPwdBySms') {
        this.codeScene = 'reset-pwd-by-sms'
        this.resetPwdBySms({ mobile, password, code, captcha })
      } else {
        this.setPwd({ password, code, captcha })
      }
    },
    /**
     * 设置密码
     * @param {Object} params { password, code, captcha }
     */
    setPwd(params) {
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      // 内部会自动判token
      uniIdCo
        .setPwd(params)
        .then(() => {
          uni.hideLoading()
          uni.showToast({
            title: '密码设置成功',
            icon: 'success',
            success: () => {
              setTimeout(() => {
                mutations.logout()
              }, 2000)
            }
          })
        })
        .catch((err) => {
          uni.hideLoading()
          uni.showModal({
            content: err.message,
            showCancel: false
          })
        })
    },
    /**
     * 通过短信验证码重置密码
     * @param {Object} params { mobile, code, password, captcha }
     */
    resetPwdBySms(params) {
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      uniIdCo
        .resetPwdBySms(params)
        .then(() => {
          uni.hideLoading()
          uni.showToast({
            title: '密码重置成功',
            icon: 'success',
            success: () => {
              setTimeout(() => {
                mutations.logout()
              }, 2000)
            }
          })
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
.sv-id-set-pwd {
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
