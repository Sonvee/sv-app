<template>
  <view class="sv-id-pages sv-id-unbind">
    <view class="header">
      <image class="security-logo" :src="securityLogo.red" mode=""></image>
      <text class="tips">为了您的账号安全，需要验证您的设备</text>
    </view>
    <view class="divider"></view>
    <uni-list>
      <uni-list-item
        title="解绑微信"
        :rightText="accountInfo.isWeixinBound ? '已绑定' : '未绑定'"
        show-extra-icon
        :extra-icon="weixinIcon"
        link
        @click="onUnBind('weixin')"
      />
      <!-- <uni-list-item
        title="解绑QQ"
        :rightText="accountInfo.isQQBound ? '已绑定' : '未绑定'"
        show-extra-icon
        :extra-icon="qqIcon"
        link
        @click="onUnBind('qq')"
      /> -->
    </uni-list>
    <view class="divider"></view>
    <uni-list>
      <uni-list-item
        title="注销账号"
        show-extra-icon
        :extra-icon="deactiveIcon"
        link
        @click="onDeactive"
      />
    </uni-list>
  </view>
</template>

<script>
import securityRed from '../../../static/security-red.png'
const uniIdCo = uniCloud.importObject('uni-id-co', { customUI: true })

export default {
  data() {
    return {
      securityLogo: {
        red: securityRed
      },
      accountInfo: {},
      weixinIcon: {
        color: '#4cd964',
        size: '22',
        type: 'weixin'
      },
      qqIcon: {
        color: '#007aff',
        size: '22',
        type: 'qq'
      },
      deactiveIcon: {
        color: '#f56c6c',
        size: '22',
        type: 'info-filled'
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
      })
    },
    onUnBind(type) {
      // 解绑操作
      let action = 'unbind' + type.trim().replace(type[0], type[0].toUpperCase())
      uniIdCo[action]()
        .then((res) => {
          console.log('==== unbind res :', res)
          uni.showToast({
            title: '解除绑定成功',
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
    onDeactive() {
      uni.navigateTo({ url: '/uni_modules/sv-id-pages/pages/userinfo/deactivate/deactivate' })
    }
  }
}
</script>

<style lang="scss">
.sv-id-unbind {
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
}

.divider {
  height: 24rpx;
}
</style>