<template>
  <el-popover width="260px" placement="top-start" trigger="click" v-model:visible="showPwdChange">
    <template #reference>
      <el-button style="float: left" type="danger">{{ mode == 'reset' ? '重置密码' : '修改密码' }}</el-button>
    </template>
    <view class="pwd-form">
      <el-form class="sv-el-form" ref="pwdFormRef" :model="pwdFormData" :rules="rules" label-position="left">
        <el-form-item v-if="mode == 'change'" prop="oldPassword" label="旧密码" required>
          <el-input
            v-model="pwdFormData.oldPassword"
            placeholder="请输入旧密码"
            type="password"
            show-password
            clearable
          />
        </el-form-item>
        <el-form-item prop="newPassword" label="新密码" required>
          <el-input
            v-model="pwdFormData.newPassword"
            placeholder="请输入新密码"
            type="password"
            show-password
            clearable
          />
        </el-form-item>
        <view class="flex" style="justify-content: flex-end">
          <el-button size="small" type="danger" @click="pwdCancel">取消</el-button>
          <el-button size="small" type="primary" @click="pwdConfirm">确认</el-button>
        </view>
      </el-form>
    </view>
  </el-popover>
</template>

<script setup>
import { ref } from 'vue'
import { rules } from '@/utils/verification.js'
import { ElNotification } from 'element-plus'
import { clearPiniaStorage } from '@/utils/pinia-storage';

const uniIdCo = uniCloud.importObject('uni-id-co', {
  errorOptions: {
    type: 'toast'
  }
})

const props = defineProps({
  mode: {
    type: String,
    default: 'reset' // change | reset
  },
  userForm: {
    type: Object,
    default: () => {}
  }
})

const showPwdChange = ref(false)
const pwdFormRef = ref()
const pwdFormData = ref({})

function pwdCancel() {
  pwdFormData.value = {}
  showPwdChange.value = false
}

// 确认提交修改密码表单
function pwdConfirm() {
  const { role } = uniCloud.getCurrentUserInfo()
  if (role.includes('visitor')) {
    ElNotification({
      title: 'Error',
      type: 'error',
      message: 'visitor禁止修改密码'
    })
    return
  }

  pwdFormRef.value.validate((valid, fields) => {
    if (valid) {
      if (props.mode == 'reset') {
        uniIdCo
          .updateUser({
            uid: props.userForm._id,
            username: props.userForm.username,
            password: pwdFormData.value.newPassword
          })
          .then(() => {
            ElNotification({
              title: 'Success',
              type: 'success',
              message: '密码重置成功'
            })
          })
          .catch((err) => {
            ElNotification({
              title: 'Error',
              type: 'error',
              message: err.errMsg
            })
          })
      } else if (props.mode == 'change') {
        uniIdCo
          .updatePwd(pwdFormData.value)
          .then(() => {
            ElNotification({
              title: 'Success',
              type: 'success',
              message: '修改密码成功'
            })
            // 需要重新登录
            clearPiniaStorage()
            getApp().$svIdPagesStore.mutations.logout()
          })
          .catch((err) => {
            ElNotification({
              title: 'Error',
              type: 'error',
              message: err.errMsg
            })
          })
      }
      showPwdChange.value = false
    }
  })
}
</script>

<style lang="scss"></style>
