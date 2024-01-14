<template>
  <view class="sv-id-pages-sms">
    <!-- 表单 -->
    <view class="form">
      <!-- 登录 -->
      <view class="login-form">
        <button class="login-btn quick-weixin" @click="submitLogin('weixin')">
          <uni-icons type="weixin" size="16" color="#ffffff"></uni-icons>
          <text decode>&nbsp;微信一键登录</text>
        </button>
        <button class="login-btn quick-qq" @click="submitLogin('QQ')">
          <uni-icons type="qq" size="16" color="#ffffff"></uni-icons>
          <text decode>&nbsp;QQ一键登录</text>
        </button>
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
import { mutations } from '../../common/store'
const uniIdCo = uniCloud.importObject('uni-id-co', { customUI: true })

export default {
  mixins: [mixin],
  data() {
    return {
      provider: 'weixin'
    }
  },
  methods: {
    // 登录表单校验
    submitLogin(e) {
      if (e) this.provider = e
      if (!this.agree) {
        this.$refs.agreements.popup(this.submitLogin)
        return
      }
      // 第三方登录
      // #ifndef H5
      uni.showLoading({
        title: '登录中',
        mask: true
      })
      uni.login({
        provider: this.provider,
        onlyAuthorize: true,
        success: (res) => {
          this.loginAction({ code: res.code }, this.provider)
        },
        fail: (err) => {
          uni.hideLoading()
          /**
           * 下列报错不进行提示：
           * -2 用户取消
           * -100 用户拒绝
           */
          const notosat = ['-2', '-100']
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

      // #ifdef H5
      uni.showToast({
        title: '当前设备不支持此登录, 请切换其他登录方式吧~',
        icon: 'none'
      })
      // #endif
    },
    loginAction(params, type) {
      // 联网验证登录
      let action = 'loginBy' + type.trim().replace(type[0], type[0].toUpperCase())
      uniIdCo[action](params)
        .then((res) => {
          uni.hideLoading()
          uni.showToast({
            title: '登录成功',
            icon: 'none',
            duration: 1000,
            success: () => {
              setTimeout(() => {
                mutations.loginSuccess(res)
              }, 1000)
            }
          })
        })
        .catch((err) => {
          uni.hideLoading()
          uni.showModal({
            content: err.message,
            confirmText: '知道了',
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

    .login-form {
      height: inherit;
      display: flex;
      flex-direction: column;
      justify-content: center;
      padding: 12px;
      box-sizing: border-box;

      .login-btn {
        margin: 24rpx 0;
        line-height: unset;
        font-size: 14px;
        padding: 16rpx 0;
        color: #ffffff;
        border-radius: 40rpx;
        display: flex;
        align-items: center;
        justify-content: center;

        &:after {
          border: unset;
        }
      }
      .login-btn:active {
        opacity: 0.8;
      }

      .quick-weixin {
        background: linear-gradient(135deg, #36ff4d, #29c53c);
      }
      .quick-qq {
        background: linear-gradient(135deg, #00c8ff, #0263ff);
      }
    }
  }
}
</style>
