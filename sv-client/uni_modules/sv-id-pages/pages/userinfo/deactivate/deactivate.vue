<!-- 注销（销毁）账号 -->
<template>
  <view class="sv-id-pages sv-id-deactivate">
    <text class="words" decode>
      <h4>一、注销是不可逆操作，注销后</h4>
      1. 账号将无法登录、无法找回。
      <br />
      2. 账号所有信息都会清除(个人身份信息、粉丝数等；发布的作品、评论、点赞等；交易信息等)。
      <br />
      3. 你的朋友将无法通过本应用账号联系你，请自行备份相关信息和数据。
      <br />
      <h4>二、重要提示</h4>
      1. 封禁账号(永久封禁、社交封禁、直播权限封禁)不能申请注销。
      <br />
      2. 注销后，你的身份证、三方账号(微信、QQ、微博、支付宝)、手机号等绑定关系将解除，
      解除后可以绑定到其他账号。
      <br />
      3. 注销后，手机号可以注册新的账号，
      新账号不会存在之前账号的任何信息(作品、粉丝、评论、个人信息等)。
      <br />
      4. 注销本应用账号前，需尽快处理账号下的资金问题。
      <br />
      5. 视具体账号情况而定，注销最多需要7天。
    </text>
    <view class="button-group">
      <button @click="nextStep" class="next" type="default">下一步</button>
      <button @click="cancel" type="warn">取消</button>
    </view>
    <uni-popup ref="alertDialog" type="dialog">
      <uni-popup-dialog
        type="warn"
        title="系统提示"
        content="您是否已经仔细阅读注销提示，知晓可能带来的后果，并确认要注销？"
        cancelText="关闭"
        :confirmText="confirmText"
        before-close
        @confirm="dialogConfirm"
        @close="dialogClose"
      ></uni-popup-dialog>
    </uni-popup>
  </view>
</template>

<script>
export default {
  data() {
    return {
      countdown: 10, // 倒计时默认10秒
      downTimer: null
    }
  },
  computed: {
    confirmText() {
      return this.countdown == 0 ? '确认注销' : `我已知晓 (${this.countdown})`
    }
  },
  onLoad() {},
  methods: {
    cancel() {
      uni.navigateBack()
    },
    nextStep() {
      this.$refs.alertDialog.open()
      this.startCountdown()
    },
    startCountdown() {
      // 不重复创建计时器
      if (this.downTimer) {
        this.clearCountdown()
        return
      }
      // 倒计时
      this.downTimer = setInterval(() => {
        this.countdown--
        if (this.countdown == 0) {
          this.clearCountdown()
        }
      }, 1000)
    },
    clearCountdown() {
      clearInterval(this.downTimer)
      this.downTimer = null
    },
    dialogConfirm() {
      if (this.countdown > 0) return
      const uniIdco = uniCloud.importObject('uni-id-co')
      uniIdco.closeAccount().then((e) => {
        uni.showToast({
          title: '注销成功',
          duration: 3000
        })
        uni.removeStorageSync('uni_id_token')
        uni.setStorageSync('uni_id_token_expired', 0)
        uni.navigateTo({
          url: '/uni_modules/sv-id-pages/pages/login/login'
        })
      })
    },
    dialogClose() {
      this.$refs.alertDialog.close()
      this.clearCountdown()
      this.countdown = 10
    }
  }
}
</script>

<style>
.sv-id-deactivate {
  display: flex;
  flex-direction: column;
  font-size: 28rpx;
}

.words {
  padding: 0 26rpx;
  line-height: 46rpx;
  margin-top: 20rpx;
  margin-bottom: 80px;
}

.button-group button {
  border-radius: 100px;
  border: none;
  width: 300rpx;
  height: 42px;
  line-height: 42px;
  font-size: 32rpx;
}

.button-group button:after {
  border: none;
}

.button-group button.next {
  color: #e64340;
  border: solid 1px #e64340;
}
.button-group {
  display: flex;
  flex-direction: row;
  position: fixed;
  height: 50px;
  bottom: 10px;
  width: 750rpx;
  justify-content: center;
  align-items: center;
  padding-top: 10px;
  max-width: 690px;
}

@media screen and (min-width: 690px) {
  .sv-id-deactivate {
    max-width: 690px;
    margin-left: calc(50% - 345px);
  }
}
</style>
