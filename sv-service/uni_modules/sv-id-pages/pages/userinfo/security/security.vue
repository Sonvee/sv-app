<template>
  <view class="sv-id-pages sv-id-security">
    <view class="header">
      <view class="security-score">
        <image class="security-logo" :src="securityLogo[securityStatus.color]" mode=""></image>
        <view class="score-text">
          <view class="score-num">{{ scoreNum }}</view>
          <view>安全评分</view>
        </view>
      </view>
      <text class="tips" :style="{ color: securityStatus.color }">
        账号安全情况{{ securityStatus.text }}
      </text>
    </view>
    <view class="sv-uni-list">
      <uni-list>
        <uni-list-item
          title="绑定手机"
          :rightText="mobileNumber || '去绑定'"
          show-extra-icon
          :extra-icon="accountInfo.isMobileBound ? correctIcon : warningIcon"
          link
          @click="onBindMobile"
        />
        <uni-list-item
          title="绑定微信"
          :rightText="accountInfo.isWeixinBound ? '已绑定' : '去绑定'"
          show-extra-icon
          :extra-icon="accountInfo.isWeixinBound ? correctIcon : warningIcon"
          link
          @click="onBindThird('weixin')"
        />
        <uni-list-item
          title="修改密码"
          show-extra-icon
          :extra-icon="accountInfo.isPasswordSet ? correctIcon : warningIcon"
          link
          @click="onChangePwd"
        />
      </uni-list>
    </view>
    <view class="sv-uni-list" style="margin-top: 24rpx">
      <uni-list>
        <uni-list-item
          title="解绑注销"
          show-extra-icon
          :extra-icon="dangerIcon"
          link
          @click="onUnbind"
        />
      </uni-list>
    </view>
  </view>
</template>

<script>
import securityBlue from '../../../static/security-blue.png'
import securityRed from '../../../static/security-red.png'
import securityGreen from '../../../static/security-green.png'
import securityOrange from '../../../static/security-orange.png'
import { store } from '../../../common/store'
const uniIdCo = uniCloud.importObject('uni-id-co', { customUI: true })

export default {
  data() {
    return {
      securityLogo: {
        blue: securityBlue,
        red: securityRed,
        green: securityGreen,
        orange: securityOrange
      },
      scoreNum: 0,
      accountInfo: {},
      correctIcon: {
        color: '#4cd964',
        size: '22',
        type: 'checkbox-filled'
      },
      warningIcon: {
        color: '#f0ad4e',
        size: '22',
        type: 'info-filled'
      },
      dangerIcon: {
        color: '#f56c6c',
        size: '22',
        type: 'info-filled'
      }
    }
  },
  computed: {
    mobileNumber() {
      // 手机号中间四位用*代替
      return store.userInfo?.mobile?.replace(/(\d{3})\d{4}(\d{4})/, '$1****$2')
    },
    securityStatus() {
      // 25分较差 50分中等 75分良好 100分极佳 默认良好
      let text = '良好'
      let color = 'blue'
      switch (this.scoreNum) {
        case 25:
          text = '较差'
          color = 'red'
          break
        case 50:
          text = '中等'
          color = 'orange'
          break
        case 75:
          text = '良好'
          color = 'blue'
          break
        case 100:
          text = '极佳'
          color = 'green'
          break
      }
      return {
        text,
        color
      }
    }
  },
  created() {
    this.getAccountInfo()
  },
  methods: {
    getAccountInfo() {
      uniIdCo.getAccountInfo().then((res) => {
        this.accountInfo = res
        const { isMobileBound, isPasswordSet, isUsernameSet, isWeixinBound, isQQBound } = res
        // 每项20分, 第三方只能算一项
        this.scoreNum =
          (isMobileBound + isPasswordSet + isUsernameSet) * 25 +
          (isWeixinBound || isQQBound ? 25 : 0)
      })
    },
    onBindMobile() {
      uni.navigateTo({
        url: '/uni_modules/sv-id-pages/pages/userinfo/bind-mobile/bind-mobile'
      })
    },
    onBindThird(e) {
      if (e == 'weixin' && this.accountInfo.isWeixinBound) {
        uni.showModal({
          title: '系统提示',
          content: '已绑定微信，切换绑定需要先解绑微信',
          confirmText: '去解绑',
          success: ({ confirm }) => {
            if (confirm) {
              uni.navigateTo({ url: '/uni_modules/sv-id-pages/pages/userinfo/unbind/unbind' })
            }
          }
        })
        return
      }
      if (e == 'qq' && this.accountInfo.isQQBound) {
        uni.showModal({
          title: '系统提示',
          content: '已绑定QQ，切换绑定需要先解绑QQ',
          confirmText: '去解绑',
          success: ({ confirm }) => {
            if (confirm) {
              uni.navigateTo({ url: '/uni_modules/sv-id-pages/pages/userinfo/unbind/unbind' })
            }
          }
        })
        return
      }
      // #ifndef H5
      uni.login({
        provider: e,
        onlyAuthorize: true,
        success: (res) => {
          this.bindAction({ code: res.code }, e)
        },
        fail: (err) => {
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
        title: 'H5端暂不提供第三方绑定，请在移动端上操作',
        icon: 'none'
      })
      // #endif
    },
    bindAction(params, type) {
      // 联网验证登录
      let action = 'bind' + type.trim().replace(type[0], type[0].toUpperCase())
      uniIdCo[action](params)
        .then((res) => {
          uni.showToast({
            title: '绑定成功',
            icon: 'none'
          })
          this.getAccountInfo()
        })
        .catch((err) => {
          uni.showModal({
            content: err.message,
            confirmText: '知道了',
            showCancel: false
          })
        })
    },
    onChangePwd() {
      uni.navigateTo({
        url: '/uni_modules/sv-id-pages/pages/userinfo/change-pwd/change-pwd'
      })
    },
    onUnbind() {
      uni.navigateTo({
        url: '/uni_modules/sv-id-pages/pages/userinfo/unbind/unbind'
      })
    }
  }
}
</script>

<style lang="scss">
.sv-id-security {
  .header {
    height: 240px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-sizing: border-box;

    .security-score {
      position: relative;

      .security-logo {
        width: 140px;
        height: 140px;
      }

      .score-text {
        width: 100%;
        position: absolute;
        top: 24%;
        text-align: center;
        font-weight: 700;
        color: #ffffff;

        .score-num {
          font-size: 50px;
          line-height: 1;
        }
      }
    }

    .tips {
      margin-top: 20px;
      font-size: 16px;
    }
  }
}
</style>
