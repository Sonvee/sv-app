<template>
  <view class="change-pwd">
    <uni-forms ref="form" :value="formData" err-show-type="toast" :label-width="80">
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
      <view class="button-group">
        <button type="warn" style="margin-right: 24rpx" @click="cancel">返回</button>
        <button type="primary" @click="submit">提交</button>
      </view>
    </uni-forms>
  </view>
</template>

<script>
import mixin from '@/uni_modules/sv-id-pages/common/login-page.mixin.js'
import passwordMod from '@/uni_modules/sv-id-pages/common/password.js'
import { mutations } from '@/uni_modules/sv-id-pages/common/store'
const uniIdCo = uniCloud.importObject('uni-id-co', {
  customUI: true
})
export default {
  mixins: [mixin],
  data() {
    return {
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
  onReady() {
    this.$refs.form.setRules(this.rules)
  },
  methods: {
    /**
     * 完成并提交
     */
    submit() {
      this.$refs.form
        .validate()
        .then((res) => {
          let { oldPassword, newPassword } = this.formData
          uniIdCo
            .updatePwd({
              oldPassword,
              newPassword
            })
            .then((e) => {
              uni.showToast({
                title: '密码修改成功',
                icon: 'none'
              })
              mutations.logout()
            })
            .catch((e) => {
              uni.showModal({
                content: e.message,
                showCancel: false
              })
            })
        })
        .catch((errors) => {
          let key = errors[0].key
          key = key.replace(key[0], key[0].toUpperCase())
          this['focus' + key] = true
        })
    },
    cancel() {
      uni.navigateBack()
    }
  }
}
</script>

<style lang="scss">
.change-pwd {
  padding: 24rpx;
  .button-group {
    display: flex;
    button {
      flex: 1;
    }
  }
}
</style>
