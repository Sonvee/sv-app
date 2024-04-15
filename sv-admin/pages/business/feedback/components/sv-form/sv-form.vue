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
        <el-form-item prop="test_id" label="测试用例ID" required>
          <el-input v-model="formData.test_id" placeholder="请输入测试用例ID" clearable />
        </el-form-item>
        <el-form-item prop="test_name" label="测试用例名称" required>
          <el-input v-model="formData.test_name" placeholder="请输入测试用例名称" clearable />
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

// 表单数据
const formData = ref({})
// 初始数据
const formBase = {
  test_id: '',
  test_name: ''
}

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = Object.assign({ ...formBase }, props.formInit)
})

// 校验规则
const rules = ref({
  test_id: [{ required: true, message: '请输入测试用例ID', trigger: 'blur' }],
  test_name: [{ required: true, message: '请输入测试用例名称', trigger: 'blur' }]
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
      emits('submit', { data: formData.value, mode: props.formMode })
      drawerRef.value.handleClose()
    } else {
      console.log('==== 校验失败 :', fields)
    }
  })
}
</script>

<style lang="scss"></style>
