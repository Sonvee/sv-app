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
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <el-form
        class="sv-el-form"
        ref="formRef"
        :model="formData"
        :rules="rules"
        label-width="80px"
        label-position="left"
      >
        <el-form-item v-if="formMode !== 'add'" prop="avatar_file" label="头像">
          <sv-file-avatar v-model:file="formData.avatar_file" ref="fileAvatarRef"></sv-file-avatar>
        </el-form-item>
        <el-form-item prop="username" label="用户名" required>
          <el-input v-model="formData.username" placeholder="请输入用户名" clearable />
        </el-form-item>
        <el-form-item prop="nickname" label="昵称" required>
          <el-input v-model="formData.nickname" placeholder="请输入昵称" clearable />
        </el-form-item>
        <el-form-item v-if="formMode == 'add'" prop="password" label="密码" required>
          <el-input
            v-model="formData.password"
            type="password"
            show-password
            placeholder="请输入密码"
            clearable
          />
        </el-form-item>
        <el-form-item v-if="formMode !== 'add'" prop="gender" label="性别">
          <sv-dict-radio
            v-model="formData.gender"
            dictType="uni_id_users_gender"
            keyName="key"
            valueName="value"
          ></sv-dict-radio>
        </el-form-item>
        <el-form-item prop="mobile" label="手机号码">
          <el-input v-model="formData.mobile" placeholder="请输入手机号码" clearable />
        </el-form-item>
        <el-form-item prop="email" label="邮箱">
          <el-input v-model="formData.email" placeholder="请输入邮箱" clearable />
        </el-form-item>
        <el-form-item prop="role" label="角色" required>
          <sv-dict-checkbox
            v-model="formData.role"
            :dictList="useSvidStore().getRoles()"
            keyName="role_id"
            valueName="role_name"
          ></sv-dict-checkbox>
        </el-form-item>
        <el-form-item v-if="formMode !== 'add'" prop="my_invite_code" label="邀请码">
          <el-input
            class="sv-el-input"
            v-model="formData.my_invite_code"
            disabled
            placeholder="请输入邀请码"
            clearable
          />
        </el-form-item>
        <el-form-item prop="dcloud_appid" label="可用APP" required>
          <sv-dict-checkbox
            v-model="formData.dcloud_appid"
            :dictList="useSysStore().getApps()"
            keyName="appid"
            valueName="name"
          ></sv-dict-checkbox>
        </el-form-item>
        <el-form-item prop="status" label="状态">
          <sv-dict-select
            v-model="formData.status"
            dictType="uni_id_users_status"
            keyName="value"
            valueName="key"
          ></sv-dict-select>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <!-- 密码修改 -->
      <sv-change-password
        v-if="formMode == 'edit' && isAdmin"
        :userForm="formData"
      ></sv-change-password>

      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { assignOverride } from '@/utils/util'
import { useSvidStore } from '@/store/svid'
import { useSysStore } from '@/store/sys'
import { rules } from '@/utils/verification.js'

const props = defineProps({
  formInit: {
    type: Object,
    default: {}
  },
  formMode: {
    type: String,
    default: 'add'
  }
})

const emits = defineEmits(['submit'])

const fileAvatarRef = ref()
// 判断当前用户是否是admin - 临时开启visitor权限，游客仅供浏览
const isAdmin = computed(() => {
  const { role } = uniCloud.getCurrentUserInfo()
  return role.includes('admin') || role.includes('visitor')
})

// 表单数据
const formData = ref({})
// 初始数据
const formBase = {
  _id: '',
  avatar_file: {},
  username: '',
  nickname: '',
  password: '',
  gender: 0,
  mobile: '',
  email: '',
  role: [],
  my_invite_code: '',
  dcloud_appid: [],
  status: 0
}

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
      if (
        props.formMode == 'edit' &&
        props.formInit.avatar_file?.url !== formData.value.avatar_file?.url
      ) {
        await fileAvatarRef.value.uploadAvatar()
      }
      emits('submit', { data: formData.value, mode: props.formMode })
      drawerRef.value.handleClose()
    } else {
      console.log('==== 校验失败 :', fields)
    }
  })
}

// 初始化监听
watchEffect(() => {
  // 表单数据初始化-预更新
  if (props.formMode !== 'add') {
    delete formBase.password
    formBase._id = ''
  } else {
    // 新增账号，需要删掉_id字段，添加password
    delete formBase._id
    formBase.password = ''
  }
  formData.value = assignOverride({ ...formBase }, props.formInit)
})
</script>

<style lang="scss"></style>
