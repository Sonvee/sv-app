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
        label-width="120px"
        label-position="left"
      >
        <el-form-item prop="user_id" label="反馈用户ID" required>
          <el-input
            class="sv-el-input"
            v-model="formData.user_id"
            placeholder="请输入反馈用户ID"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item prop="feedback_title" label="反馈标题" required>
          <el-input
            class="sv-el-input"
            v-model="formData.feedback_title"
            placeholder="请输入反馈标题"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item prop="feedback_content" label="反馈内容" required>
          <el-input
            class="sv-el-input"
            v-model="formData.feedback_content"
            placeholder="请输入反馈内容"
            type="textarea"
            :autosize="{ minRows: 4 }"
            clearable
            disabled
          />
        </el-form-item>
        <el-form-item prop="feedback_image" label="反馈图片">
          <template v-if="formData.feedback_image.length > 0">
            <el-image
              v-for="(item, index) in formData.feedback_image"
              style="width: 60px; height: 40px; margin-right: 2px"
              :src="item.url"
              :preview-src-list="formData.feedback_image.map((it) => it.url)"
              :initial-index="index"
              fit="cover"
              preview-teleported
            />
          </template>
          <view v-else class="text-gray">
            <text class="uni-icons-image margin-right-xs"></text>
            未上传图片
          </view>
        </el-form-item>
        <el-form-item prop="feedback_type" label="反馈类型">
          <sv-dict-select
            v-model="formData.feedback_type"
            :dictList="fbtypeList"
            keyName="text"
            valueName="value"
            disabled
          ></sv-dict-select>
        </el-form-item>
        <el-form-item prop="feedback_status" label="反馈状态">
          <sv-dict-select
            v-model="formData.feedback_status"
            :dictList="fbstatusList"
            keyName="text"
            valueName="value"
          ></sv-dict-select>
        </el-form-item>

        <el-form-item prop="reply" label="反馈回复">
          <view style="height: 440px; width: 100%">
            <sv-wangeditor
              v-if="showEditor"
              v-model:html="formData.reply"
              ref="replyEditorRef"
              mode="simple"
            ></sv-wangeditor>
          </view>
        </el-form-item>

        <el-form-item prop="create_date" label="创建时间">
          <el-date-picker
            class="sv-el-date-picker"
            v-model="formData.create_date"
            type="datetime"
            placeholder="请选择日期时间"
            value-format="x"
            disabled
          />
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watchEffect } from 'vue'

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

const fbtypeList = [
  { text: '改进建议', value: 0 },
  { text: '发现bug', value: 1 }
]
const fbstatusList = [
  { text: '审批中', value: 0 },
  { text: '已解决', value: 1 },
  { text: '已拒绝', value: 2 }
]

// 表单数据
const formData = ref({})
// 初始数据
const formBase = {
  user_id: uniCloud.getCurrentUserInfo().uid, // 默认当前用户id
  feedback_id: '',
  feedback_title: '',
  feedback_content: '',
  feedback_image: [],
  create_date: '',
  feedback_status: '',
  reply: ''
}

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = Object.assign({ ...formBase }, props.formInit)
})

// 校验规则
const rules = ref({
  user_id: [{ required: true, message: '请输入反馈用户ID', trigger: 'blur' }],
  feedback_title: [{ required: true, message: '请输入反馈标题', trigger: 'blur' }],
  feedback_content: [{ required: true, message: '请输入反馈内容', trigger: 'blur' }]
})

const drawerRef = ref() // 抽屉
const formRef = ref() // 表单
const showEditor = ref(false) // 富文本组件显隐
const replyEditorRef = ref()

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
      replyEditorRef.value.save() // 富文本内容保存

      emits('submit', { data: formData.value, mode: props.formMode })
      drawerRef.value.handleClose()
    } else {
      console.log('==== 校验失败 :', fields)
    }
  })
}
</script>

<style lang="scss"></style>
