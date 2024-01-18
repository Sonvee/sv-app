<template>
  <el-drawer v-bind="$attrs" class="sv-el-drawer" ref="drawerRef">
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <view class="sv-add">
        <el-form
          ref="formRef"
          class="sv-el-form"
          :model="formData"
          :rules="rules"
          label-width="80px"
          label-position="left"
        >
          <el-form-item prop="dict_id" label="字典ID" required>
            <el-input v-model="formData.dict_id" placeholder="请输入字典ID" clearable />
          </el-form-item>
          <el-form-item prop="dict_name" label="字典名称" required>
            <el-input v-model="formData.dict_name" placeholder="请输入字典名称" clearable />
          </el-form-item>
          <el-form-item prop="dict" label="字典内容" required>
            <sv-dynamic-input v-model:data="formData.dict" labelWidth="30px"></sv-dynamic-input>
          </el-form-item>
          <el-form-item prop="comment" label="备注">
            <el-input
              v-model="formData.comment"
              type="textarea"
              :autosize="{ minRows: 2 }"
              placeholder="请输入备注"
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
  dict_id: '',
  dict_name: '',
  dict: [{ key: '', value: '' }],
  comment: '',
  create_date: Date.now()
}

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = Object.assign({ ...initData }, props.formInit)
})

// 校验规则
const rules = ref({
  dict_id: [{ required: true, message: '请输入字典ID', trigger: 'blur' }],
  dict_name: [{ required: true, message: '请输入字典名称', trigger: 'blur' }],
  dict: [{ required: true, message: '请输入字典内容', trigger: 'blur' }]
})

const drawerRef = ref() // 抽屉
const formRef = ref() // 表单

// 关闭抽屉
function cancel() {
  drawerRef.value.close()
}
// 确认提交表单
function confirm() {
  formRef.value.validate(async (valid, fields) => {
    if (valid) {
      emits('submit', { data: formData.value, mode: props.formMode })
      drawerRef.value.close()
    } else {
      console.log('==== 校验失败 :', fields)
    }
  })
}
</script>

<style lang="scss">
.sv-add {
  width: 100%;
  height: 100%;
}
</style>
