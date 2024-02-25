<template>
  <view class="sv-id-pages sv-id-change-pwd">
    <view class="header">
      <image class="security-logo" :src="securityLogo.orange" mode=""></image>
      <text class="tips">为了您的账号安全，需要验证密码</text>
    </view>
    <view class="pwd-form">
      <uni-forms ref="formRef" :value="formData" :rules="rules" :label-width="80">
        <uni-forms-item name="oldPassword" label="旧密码" required>
          <uni-easyinput
            v-model="formData.oldPassword"
            type="password"
            placeholder="请输入旧密码"
          ></uni-easyinput>
        </uni-forms-item>
        <uni-forms-item name="newPassword" label="新密码" required>
          <uni-easyinput
            v-model="formData.newPassword"
            type="password"
            placeholder="请输入新密码"
          ></uni-easyinput>
        </uni-forms-item>
        <uni-forms-item name="newPassword2" label="确认密码" required>
          <uni-easyinput
            v-model="formData.newPassword2"
            type="password"
            placeholder="请再次输入新密码"
          ></uni-easyinput>
        </uni-forms-item>
        <view class="control-btn">
          <button class="submit-btn" type="primary" @click="submit">确认修改</button>
        </view>
        <view class="lost" @click="toSetPwd">未设置/忘记旧密码？</view>
      </uni-forms>
    </view>
  </view>
</template>

<script>
import securityOrange from '../../../static/security-orange.png'
import passwordMod from '@/uni_modules/sv-id-pages/common/password.js'
import { mutations, store } from '@/uni_modules/sv-id-pages/common/store'
const uniIdCo = uniCloud.importObject('uni-id-co', { customUI: true })

export default {
  data() {
    return {
      securityLogo: {
        orange: securityOrange
      },
      formData: {
        oldPassword: '',
        newPassword: '',
        newPassword2: ''
      },
      rules: {
        oldPassword: {
          rules: [
            {
              required: true,
              errorMessage: '请输入新密码'
            },
            {
              pattern: /^.{8,16}$/,
              errorMessage: '密码为8-16位'
            }
          ]
        },
        ...passwordMod.getPwdRules('newPassword', 'newPassword2')
      }
    }
  },
  mounted() {
    this.$refs.formRef.setRules(this.rules)
  },
  methods: {
    /**
     * 完成并提交
     */
    submit() {
      this.$refs.formRef
        .validate()
        .then((formRes) => {
          uni.showLoading({ title: '修改中', mask: true })
          let { oldPassword, newPassword } = formRes
          uniIdCo
            .updatePwd({ oldPassword, newPassword })
            .then(() => {
              uni.hideLoading()
              uni.showToast({
                title: '密码修改成功',
                icon: 'success',
                duration: 2000,
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
        })
        .catch((err) => {
          console.log('==== validate err :', err)
        })
    },
    toSetPwd() {
      if (store.userInfo.mobile) {
        uni.navigateTo({
          url: '/uni_modules/sv-id-pages/pages/userinfo/set-pwd/set-pwd'
        })
      } else {
        uni.showModal({
          title: '系统提示',
          content: '监测到您还未绑定手机，先绑定手机后再使用短信验证码的方式设置密码吧~',
          confirmText: '去绑定',
          showCancel: true,
          success: ({ confirm }) => {
            if (confirm) {
              uni.navigateTo({
                url: '/uni_modules/sv-id-pages/pages/userinfo/bind-mobile/bind-mobile'
              })
            }
          }
        })
      }
    }
  }
}
</script>

<style lang="scss">
.sv-id-change-pwd {
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

  .pwd-form {
    height: 100%;
    display: flex;
    flex-direction: column;
    padding: 24rpx;
    box-sizing: border-box;

    .control-btn {
      display: flex;

      .submit-btn {
        width: 100%;
        line-height: unset;
        font-size: 14px;
        padding: 16rpx 0;
      }
    }

    .lost {
      display: inline-block;
      margin-top: 48rpx;
      font-size: 12px;
      color: $uni-color-primary;
      cursor: pointer;
    }
  }
}
</style>
