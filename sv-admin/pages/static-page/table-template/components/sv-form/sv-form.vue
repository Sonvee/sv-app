<template>
  <el-drawer v-bind="$attrs" class="sv-el-drawer" ref="drawerRef" @open="openDrawer" @close="closeDrawer">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
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
            <el-input v-model="formData.username" placeholder="请输入用户名" clearable />
          </el-form-item>
          <el-form-item prop="nickname" label="昵称" required>
            <el-input v-model="formData.nickname" placeholder="请输入昵称" clearable />
          </el-form-item>
          <el-form-item prop="age" label="年龄">
            <el-input-number class="sv-el-input-number" v-model="formData.age" :min="0" :max="100" />
          </el-form-item>
          <el-form-item prop="gender" label="性别">
            <el-radio-group v-model="formData.gender">
              <el-radio :label="0">保密</el-radio>
              <el-radio :label="1">男</el-radio>
              <el-radio :label="2">女</el-radio>
            </el-radio-group>
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
          <el-form-item prop="dcloud_appid" label="可用APP">
            <el-checkbox-group v-model="formData.dcloud_appid">
              <el-checkbox v-for="item in appList" :key="item" :label="item.appid">
                {{ item.name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="status" label="状态">
            <el-select v-model="formData.status" placeholder="状态">
              <el-option v-for="item in statusList" :key="item.value" :label="item.text" :value="item.value" />
            </el-select>
          </el-form-item>
          <el-form-item prop="forbidden" label="封禁">
            <el-switch
              v-model="formData.forbidden"
              inline-prompt
              style="--el-switch-on-color: #dd524d; --el-switch-off-color: #007aff"
              :active-icon="WarnTriangleFilled"
              :inactive-icon="Minus"
            />
          </el-form-item>
          <!-- 内置图标选择栏 -->
          <el-form-item prop="icon" label="图标">
            <sv-icon-select
              v-model="formData.icon"
              clearable
              :pop-width="400"
              @selected="selectedIcon"
            ></sv-icon-select>
          </el-form-item>
          <el-form-item prop="rich-text" label="富文本">
            <sv-wangeditor
              v-if="showEditor"
              v-model:html="formData.comment"
              ref="editorRef"
              @change="changeEditor"
            ></sv-wangeditor>
          </el-form-item>
        </el-form>
      </view>
    </template>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue'
import { WarnTriangleFilled, Minus } from '@element-plus/icons-vue'

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

// 表单数据
const formData = ref({})
// 初始数据
const initData = {
  avatar_file: {},
  username: '',
  nickname: '123',
  age: 0,
  gender: 0,
  mobile: '',
  email: '',
  role: [],
  my_invite_code: '',
  dcloud_appid: [],
  status: 0,
  forbidden: false,
  icon: '',
  comment: '<div>hello world</div>'
}

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = Object.assign({ ...initData }, props.formInit)
})

// 校验规则
const rules = ref({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  nickname: [{ required: true, message: '请输入昵称称', trigger: 'blur' }]
})

// 账号状态字典
const statusList = [
  {
    text: '正常',
    value: 0
  },
  {
    text: '禁用',
    value: 1
  },
  {
    text: '审核中',
    value: 2
  },
  {
    text: '审核拒绝',
    value: 3
  }
]
// APP应用复选框
const appList = [
  { appid: 'APP_1', name: '应用1' },
  { appid: 'APP_2', name: '应用2' },
  { appid: 'APP_3', name: '应用3' },
  { appid: 'APP_4', name: '应用4' }
]

const drawerRef = ref() // 抽屉
const formRef = ref() // 表单

const showEditor = ref(false)

function openDrawer() {
  showEditor.value = true
}

function closeDrawer() {
  showEditor.value = false
}

// 关闭抽屉
function cancel() {
  drawerRef.value.handleClose()
}
// 确认提交表单
function confirm() {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      /**
       * uploadFile 手动上传图片，此处仅展示，故注释
       * import { uploadFile } from '@/utils/util'
       * @param {File} avatar_file
       * @param {string} 文件在云存储中的根目录
       */
      // const upRes = await uploadFile(formData.value.avatar_file, 'avatarstorage')
      // formData.value.avatar_file.url = upRes.fileID // 替换云存储中网络地址

      emits('submit', { data: formData.value, mode: props.formMode })
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
}

function uploadSuccess(e) {
  const { extname, name, url } = e?.tempFiles[0]
  formData.value.avatar_file = { extname, name, url }
}

function uploadFail(e) {
  uni.showToast({
    title: '图片上传失败' + e,
    icon: 'none'
  })
}

// 选中图标
function selectedIcon(icon) {
  formData.value.icon = icon
}

/**
 * 富文本
 */
const editorRef = ref()
function changeEditor(e) {
  console.log('==== changeEditor e :', e)
}
</script>

<style lang="scss">
.sv-add {
  width: 100%;
  height: 100%;
}
</style>
