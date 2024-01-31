<template>
  <el-drawer
    v-bind="$attrs"
    class="sv-el-drawer"
    ref="drawerRef"
    @open="openDrawer"
    @close="closeDrawer"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <template #header>
      <h3>编辑</h3>
    </template>
    <template #default>
      <view class="sv-add">
        <el-form
          class="sv-el-form"
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="80px"
          label-position="left"
        >
          <el-form-item prop="avatar_file" label="头像">
            <sv-file-avatar v-model:file="formData.avatar_file" ref="fileAvatarRef"></sv-file-avatar>
          </el-form-item>
          <el-form-item prop="username" label="用户名" required>
            <el-input
              class="sv-el-input"
              v-model="formData.username"
              placeholder="请输入用户名"
              clearable
              :disabled="!isAdmin"
            />
          </el-form-item>
          <el-form-item prop="nickname" label="昵称" required>
            <el-input v-model="formData.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
          <el-form-item prop="gender" label="性别">
            <sv-dict-radio
              v-model="formData.gender"
              dictType="uni_id_users_gender"
              keyName="key"
              valueName="value"
            ></sv-dict-radio>
          </el-form-item>
          <el-form-item prop="mobile" label="手机号码">
            <el-input
              class="sv-el-input"
              v-model="formData.mobile"
              placeholder="请输入手机号码"
              clearable
              :disabled="!isAdmin"
            />
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input
              class="sv-el-input"
              v-model="formData.email"
              placeholder="请输入邮箱"
              clearable
              :disabled="!isAdmin"
            />
          </el-form-item>
          <el-form-item prop="my_invite_code" label="邀请码">
            <el-input
              class="sv-el-input"
              v-model="formData.my_invite_code"
              disabled
              placeholder="请输入邀请码"
              clearable
            />
          </el-form-item>
        </el-form>
      </view>
    </template>
    <template #footer>
      <!-- 密码修改 -->
      <sv-change-password mode="change" :userForm="formData"></sv-change-password>

      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue'
import { assignOverride } from '@/utils/util'
import { rules } from '@/utils/verification.js'

const props = defineProps({
  formInit: {
    type: Object,
    default: {}
  }
})

const emits = defineEmits(['submit'])

// 表单数据
const formData = ref({})
// 初始数据
const formBase = {
  avatar_file: {},
  username: '',
  nickname: '',
  gender: 0,
  mobile: '',
  email: '',
  my_invite_code: ''
}

const fileAvatarRef = ref()
// 判断当前用户是否是admin - 临时开启visitor权限，游客仅供浏览
const isAdmin = computed(() => {
  const { role } = uniCloud.getCurrentUserInfo()
  return role.includes('admin')
})

const drawerRef = ref() // 抽屉
const formRef = ref() // 表单

function openDrawer() {}

function closeDrawer() {}

// 关闭抽屉
function cancel() {
  drawerRef.value.handleClose()
}

// 确认提交表单
function confirm() {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      // 手动上传图片
      if (props.formInit.avatar_file.url !== formData.value.avatar_file.url) {
        await fileAvatarRef.value.uploadAvatar()
      }
      emits('submit', { data: formData.value })
      drawerRef.value.handleClose()
    } else {
      console.log('==== 校验失败 :', fields)
    }
  })
}

// 初始化监听
watchEffect(() => {
  // 表单数据初始化-预更新
  formData.value = assignOverride({ ...formBase }, props.formInit)
})
</script>

<style lang="scss">
.sv-add {
  width: 100%;
  height: 100%;
}
</style>
