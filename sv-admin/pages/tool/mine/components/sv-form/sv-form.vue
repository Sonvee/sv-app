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
            <uni-file-picker
              :image-styles="{
                width: 100,
                height: 100
              }"
              :auto-upload="false"
              v-model="formData.avatar_file"
              fileMediatype="image"
              mode="grid"
              limit="1"
              @select="selectFile"
              @success="uploadSuccess"
              @fail="uploadFail"
            />
          </el-form-item>
          <el-form-item prop="username" label="用户名" required>
            <el-input
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
            <el-radio-group v-model="formData.gender">
              <el-radio v-for="item in genderList" :key="item.key" :label="+item.key">
                {{ item.value }}
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item prop="mobile" label="手机号码">
            <el-input
              v-model="formData.mobile"
              placeholder="请输入手机号码"
              clearable
              :disabled="!isAdmin"
            />
          </el-form-item>
          <el-form-item prop="email" label="邮箱">
            <el-input
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
      <el-popover
        width="260px"
        placement="top-start"
        trigger="click"
        v-model:visible="showPwdReset"
      >
        <template #reference>
          <el-button style="float: left" type="danger">修改密码</el-button>
        </template>
        <view class="reset-pwd-form">
          <el-form
            class="sv-el-form"
            ref="pwdFormRef"
            :model="pwdFormData"
            :rules="rules"
            label-position="left"
          >
            <el-form-item prop="oldPassword" label="旧密码" required>
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

      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue'
import { assignOverride, uploadFile } from '@/utils/util'
import { rules } from '@/utils/verification.js'
import { getDictById } from '@/utils/sys'
import { ElNotification } from 'element-plus'

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
const initData = {
  avatar_file: {},
  username: '',
  nickname: '',
  gender: 0,
  mobile: '',
  email: '',
  my_invite_code: ''
}

// 判断当前用户是否是admin - 临时开启visitor权限，游客仅供浏览
const isAdmin = computed(() => {
  const { role } = uniCloud.getCurrentUserInfo()
  return role.includes('admin')
})

// 账号性别字典数组
const genderList = ref([])

async function handleCache() {
  genderList.value = await getDictById('uni_id_users_gender')
}
handleCache()

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
      if (!formData.value.avatar_file?.url) {
        // 叉掉图片并保存时，如果云端原有图片，则需删除云存储中原文件，并重置路径字段
        if (props.formInit.avatar_file?.url) {
          uniCloud.importObject('sv-utils').deleteCloudFile([props.formInit.avatar_file?.url])
        }
        /**
         * @bug uniCloud直接用{}进行update会导致无效，必须对其内部属性统一清空处理
         * @external https://ask.dcloud.net.cn/question/182139
         * @todo formData.value.avatar_file = {} 应当直接做清空操作，此处临时使用{extname:'',name:'',url:''}重置处理
         */
        formData.value.avatar_file = { extname: '', name: '', url: '' }
      } else {
        // 修改图片时，需要上传新图片，保存新图片路径，再删除原图片
        if (props.formInit.avatar_file?.url !== formData.value.avatar_file?.url) {
          // 图标修改了才上传，否则不上传
          const upRes = await uploadFile(formData.value.avatar_file, 'avatarstorage')
          formData.value.avatar_file.url = upRes.fileID // 替换云存储中网络地址
          // 删除云存储中原文件
          if (props.formInit.avatar_file?.url) {
            uniCloud.importObject('sv-utils').deleteCloudFile([props.formInit.avatar_file?.url])
          }
        }
      }
      // console.log('==== formData.value :', formData.value)

      emits('submit', { data: formData.value })
      drawerRef.value.handleClose()
    } else {
      console.log('==== 校验失败 :', fields)
    }
  })
}

/**
 * 图片
 */
// 手动选择上传图片
function selectFile(e) {
  const { extname, name, url } = e.tempFiles[0]
  formData.value.avatar_file = { extname, url, name: `${Date.now()}-${name}` } // 确保name唯一性
  console.log('==== selectFile :', formData.value.avatar_file)
}

function uploadSuccess(e) {
  console.log('==== uploadSuccess :', e)
  const { extname, name, url } = e?.tempFiles[0]
  formData.value.avatar_file = { extname, name, url }
}

function uploadFail(e) {
  uni.showToast({
    title: '图片上传失败' + e,
    icon: 'none'
  })
}

const pwdFormRef = ref()

const pwdFormData = ref({
  oldPassword: '',
  newPassword: ''
})
const showPwdReset = ref(false)

const uniIdCo = uniCloud.importObject('uni-id-co', {
  errorOptions: {
    type: 'toast'
  }
})

function pwdCancel() {
  pwdFormData.value = {
    oldPassword: '',
    newPassword: ''
  }
  showPwdReset.value = false
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
  pwdFormRef.value.validate(async (valid, fields) => {
    if (valid) {
      uniIdCo
        .updatePwd(pwdFormData.value)
        .then((res) => {
          ElNotification({
            title: 'Success',
            type: 'success',
            message: '修改密码成功'
          })
        })
        .catch((err) => {
          ElNotification({
            title: 'Error',
            type: 'error',
            message: err.errMsg
          })
        })
      showPwdReset.value = false
    }
  })
}

// 初始化监听
watchEffect(() => {
  // 表单数据初始化-预更新
  formData.value = assignOverride({ ...initData }, props.formInit)
  // 重置密码表单初始化
  pwdFormData.value = {
    newPassword: ''
  }
})
</script>

<style lang="scss">
.sv-add {
  width: 100%;
  height: 100%;
}
</style>
