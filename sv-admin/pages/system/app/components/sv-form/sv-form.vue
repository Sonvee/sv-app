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
      <view class="sv-add">
        <el-form
          class="sv-el-form"
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="80px"
          label-position="left"
        >
          <el-form-item prop="icon_url" label="图标">
            <uni-file-picker
              :image-styles="{
                width: 100,
                height: 100
              }"
              :auto-upload="false"
              v-model="iconFile"
              fileMediatype="image"
              mode="grid"
              limit="1"
              @select="selectFile"
              @success="uploadSuccess"
              @fail="uploadFail"
            />
          </el-form-item>
          <el-form-item prop="appid" label="应用ID" required>
            <el-input v-model="formData.appid" placeholder="请输入应用ID" clearable />
          </el-form-item>
          <el-form-item prop="name" label="应用名称" required>
            <el-input v-model="formData.name" placeholder="请输入应用名称" clearable />
          </el-form-item>
          <el-form-item prop="description" label="应用描述">
            <el-input
              v-model="formData.description"
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="请输入应用描述"
            />
          </el-form-item>
          <el-form-item prop="introduction" label="应用简介">
            <el-input
              v-model="formData.introduction"
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="请输入应用简介"
            />
          </el-form-item>
          <el-form-item prop="create_date" label="创建时间">
            <el-date-picker
              v-model="formData.create_date"
              type="datetime"
              placeholder="请选择日期时间"
              value-format="x"
            />
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
import { uploadFile } from '@/utils/util'

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
  icon_url: '',
  appid: '',
  name: '',
  description: '',
  introduction: '',
  create_date: Date.now()
}

// 图标文件对象
const iconFile = ref({})

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = Object.assign({ ...initData }, props.formInit)
  // console.log('==== formData.value :', formData.value, props.formInit)

  if (formData.value?.icon_url) {
    iconFile.value = { url: formData.value?.icon_url }
  } else {
    iconFile.value = null
  }
})

// 校验规则
const rules = ref({
  appid: [{ required: true, message: '请输入应用ID', trigger: 'blur' }],
  name: [{ required: true, message: '请输入应用名称', trigger: 'blur' }]
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
      /**
       * uploadFile 手动上传图片
       * import { uploadFile } from '@/utils/util'
       * @param {File} file
       * @param {string} 文件在云存储中的根目录
       */
      if (!iconFile.value?.url) {
        // 叉掉图片并保存时，如果云端原有图片，则需删除云存储中原文件，并重置路径字段
        if (props.formInit.icon_url) {
          uniCloud.importObject('sv-utils').deleteCloudFile([props.formInit.icon_url])
          formData.value.icon_url = ''
        }
      } else {
        // 修改图片时，需要上传新图片，保存新图片路径，再删除原图片
        if (iconFile.value.url !== formData.value.icon_url) {
          // 图标修改了才上传，否则不上传
          const upRes = await uploadFile(iconFile.value, 'staticstorage')
          formData.value.icon_url = upRes.fileID // 替换云存储中网络地址
          // 删除云存储中原文件
          if (props.formInit.icon_url) {
            uniCloud.importObject('sv-utils').deleteCloudFile([props.formInit.icon_url])
          }
        }
      }

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
  iconFile.value = { extname, url, name: `${Date.now()}-${name}` } // 确保name唯一性
}

function uploadSuccess(e) {
  const { extname, name, url } = e?.tempFiles[0]
  iconFile.value = { extname, name, url }
}

function uploadFail(e) {
  uni.showToast({
    title: '图片上传失败' + e,
    icon: 'none'
  })
}
</script>

<style lang="scss">
.sv-add {
  width: 100%;
  height: 100%;
}
</style>
