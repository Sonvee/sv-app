<template>
  <!-- 登录方式 -->
  <view class="quick-login">
    <view
      class="quick-login-btn account-login"
      v-if="config.loginWay.account"
      @click="accountLogin"
    >
      <uni-icons type="staff-filled" size="30" color="#ffffff"></uni-icons>
    </view>
    <view class="quick-login-btn sms-login" v-if="config.loginWay.sms" @click="smsLogin">
      <uni-icons type="email-filled" size="30" color="#ffffff"></uni-icons>
    </view>
    <!-- #ifdef APP -->
    <view class="quick-login-btn phone-login" v-if="config.loginWay.univerify" @click="phoneLogin">
      <uni-icons type="phone-filled" size="30" color="#ffffff"></uni-icons>
    </view>
    <!-- #endif -->
    <view class="quick-login-btn third-login" v-if="config.loginWay.third" @click="thirdLogin">
      <uni-icons type="more-filled" size="30" color="#ffffff"></uni-icons>
    </view>
  </view>
</template>

<script>
import config from '@/uni_modules/sv-id-pages/config.js'
import { mutations } from '@/uni_modules/sv-id-pages/common/store.js'
const uniIdCo = uniCloud.importObject('uni-id-co', {
  errorOptions: {
    type: 'toast'
  }
})

export default {
  data() {
    return {
      config,
      univerifyStyle: {
        // 一键登录弹出窗的样式配置参数
        fullScreen: true, // 是否全屏显示，true表示全屏模式，false表示非全屏模式，默认值为false。
        backgroundColor: '#ffffff', // 授权页面背景颜色，默认值：#ffffff
        buttons: {
          // 自定义登录按钮
          iconWidth: '45px', // 图标宽度（高度等比例缩放） 默认值：45px
          list: []
        },
        privacyTerms: {
          defaultCheckBoxState: false, // 条款勾选框初始状态 默认值： true
          textColor: '#BBBBBB', // 文字颜色 默认值：#BBBBBB
          termsColor: '#5496E3', //  协议文字颜色 默认值： #5496E3
          prefix: '我已阅读并同意', // 条款前的文案 默认值：“我已阅读并同意”
          suffix: '并使用本机号码登录', // 条款后的文案 默认值：“并使用本机号码登录”
          privacyItems: []
        }
      }
    }
  },
  methods: {
    accountLogin() {
      // 账号密码登录
      this.$emit('change-mode', 'account')
    },
    smsLogin() {
      // 短信验证码登录
      this.$emit('change-mode', 'sms')
    },
    phoneLogin() {
      // 手机号一键登录 - 只支持APP端
      // #ifdef APP
      uni.showLoading({
        title: '加载中',
        mask: true
      })
      const univerifyManager = uni.getUniverifyManager()
      // 调用一键登录弹框
      return univerifyManager.login({
        univerifyStyle: this.univerifyStyle,
        success: (res) => {
          uni.hideLoading()
          this.loginAction(res.authResult, 'univerify')
        },
        fail(err) {
          uni.hideLoading()
          /**
           * 下列报错不进行提示：
           * 30002 用户点击了其他登录方式
           * 30003 用户关闭验证界面
           * 30006 一键登录失败
           * 30008 用户点击了自定义按钮
           * 更多报错信息详见：https://uniapp.dcloud.net.cn/univerify.html#错误码
           */
          const notosat = ['30002', '30003', '30006', '30008']
          if (notosat.includes(err.code + '')) return
          // 从err.errMsg取出"login:fail "之后的字符
          const message = err.errMsg.substring(11)
          uni.showToast({
            title: message,
            icon: 'none'
          })
        }
      })
      // #endif
    },
    thirdLogin() {
      // 第三方快捷登录
      this.$emit('change-mode', 'third')
    },
    loginAction(params, type) {
      // 联网验证登录
      let action = 'loginBy' + type.trim().replace(type[0], type[0].toUpperCase())
      uniIdCo[action](params)
        .then((res) => {
          uni.showToast({
            title: '登录成功',
            icon: 'none'
          })
          mutations.loginSuccess(res)
        })
        .catch((err) => {
          uni.showModal({
            content: err.message,
            confirmText: '知道了',
            showCancel: false
          })
        })
        .finally(() => {
          if (type == 'univerify') {
            uni.closeAuthView()
          }
          uni.hideLoading()
        })
    }
  }
}
</script>

<style lang="scss">
.quick-login {
  width: 100%;
  height: 100%;
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
  .third-login {
    background: linear-gradient(135deg, #00ffd5, #009e81);
  }
}
</style>
