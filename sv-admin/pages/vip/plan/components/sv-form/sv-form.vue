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
          label-width="100px"
          label-position="left"
        >
          <el-form-item prop="plan_id" label="套餐ID" required>
            <el-input
              class="sv-el-input"
              v-model="formData.plan_id"
              placeholder="请输入套餐ID (唯一且不可更改)"
              clearable
              :disabled="formMode != 'add'"
            />
          </el-form-item>
          <el-form-item prop="plan_name" label="套餐名称" required>
            <el-input v-model="formData.plan_name" placeholder="请输入套餐名称" clearable />
          </el-form-item>
          <el-form-item prop="description" label="套餐描述">
            <el-input
              v-model="formData.description"
              type="textarea"
              :autosize="{ minRows: 4 }"
              placeholder="请输入套餐描述"
            />
          </el-form-item>
          <el-form-item prop="valid_day" label="有效期(天)" required>
            <el-input-number class="sv-el-input-number" v-model="formData.valid_day" :min="1" />
          </el-form-item>
          <el-form-item prop="price" label="定价(分)" required>
            <el-input-number class="sv-el-input-number" v-model="formData.price" :min="0" />
            <text class="margin-left">=&nbsp;{{ convertFenToYuan(formData.price) }}&nbsp;元</text>
          </el-form-item>
          <el-form-item prop="discount" label="折扣(分)" required>
            <el-input-number class="sv-el-input-number" v-model="formData.discount" :min="0" />
            <text class="margin-left">
              =&nbsp;{{ convertFenToYuan(formData.discount) }}&nbsp;元
            </text>
          </el-form-item>
          <el-form-item prop="sort" label="排序">
            <el-input-number class="sv-el-input-number" v-model="formData.sort" :min="0" />
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
import { ref, watchEffect } from 'vue'
import { convertFenToYuan } from '@/uni_modules/sv-id-vip/utils'

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
  plan_id: '', // 唯一，不可更改
  plan_name: '',
  description: '',
  valid_day: 1, // 有效期默认1天
  price: 100, // 定价默认为100分(1元)
  discount: 0, // 折扣默认为0
  sort: 0 // 排序
}

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = Object.assign({ ...formBase }, props.formInit)
})

// 校验规则
const rules = ref({
  plan_id: [{ required: true, message: '请输入套餐ID', trigger: 'blur' }],
  plan_name: [{ required: true, message: '请输入套餐名称', trigger: 'blur' }],
  valid_day: [{ required: true, message: '请输入有效期', trigger: 'blur' }],
  price: [{ required: true, message: '请输入定价', trigger: 'blur' }],
  discount: [{ required: true, message: '请输入折扣', trigger: 'blur' }]
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

<style lang="scss">
.sv-add {
  width: 100%;
  height: 100%;
}
</style>
