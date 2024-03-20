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
      <h3>{{ formMode == 'add' ? '新增' : '一键新增' }}</h3>
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
          <el-form-item v-if="formMode == 'add'" prop="cdkey" label="激活码" required>
            <el-input
              class="sv-el-input"
              v-model="formData.cdkey"
              placeholder="请生成CDKEY"
              disabled
            >
              <template #append>
                <view class="create-cdkey-btn" @click="generateCDKey">生成CDKEY</view>
              </template>
            </el-input>
          </el-form-item>
          <el-form-item prop="bind_plan" label="绑定套餐" required>
            <sv-dict-select
              v-model="formData.bind_plan"
              placeholder="请绑定套餐"
              :dictList="bindPlanList"
              keyName="plan_name"
              valueName="plan_id"
            ></sv-dict-select>
          </el-form-item>
          <el-form-item prop="status" label="状态" required>
            <sv-dict-select
              v-model="formData.status"
              :dictList="statusList"
              keyName="text"
              valueName="value"
              disabled
            ></sv-dict-select>
          </el-form-item>
          <el-form-item prop="valid_date" label="有效期至" required>
            <el-date-picker
              v-model="formData.valid_date"
              type="datetime"
              placeholder="请选择有效期"
              value-format="x"
            />
          </el-form-item>
          <el-form-item v-if="formMode == 'onekey'" prop="num" label="生成条数" required>
            <el-input-number
              class="sv-el-input-number"
              v-model="formData.num"
              :min="1"
              :max="20"
              :step="1"
              step-strictly
            />
            <text class="margin-left text-cyan">1 ~ 20</text>
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
import { vipList } from '@/service/api/vip'
import { createCDKey } from '@/uni_modules/sv-id-vip/utils'

const props = defineProps({
  formInit: {
    type: Object,
    default: {}
  },
  formMode: {
    type: String,
    default: 'add' // add | onekey
  }
})

const emits = defineEmits(['submit'])

// 表单数据
const formData = ref({})
// 初始数据
const formBase = {
  cdkey: '',
  bind_plan: '',
  valid_date: '',
  status: 0,
  num: 1 // 批量生成条数，最小1，最多20
}

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = Object.assign({ ...formBase }, props.formInit)
})

// 校验规则
const rules = ref({
  cdkey: [{ required: true, message: '请生成激活码', trigger: 'blur' }],
  bind_plan: [{ required: true, message: '请选择绑定套餐', trigger: 'blur' }],
  valid_date: [{ required: true, message: '请选择有效期', trigger: 'blur' }],
  num: [{ required: true, message: '请选择生成条数', trigger: 'blur' }]
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

function generateCDKey() {
  formData.value.cdkey = createCDKey()
}

const statusList = [
  {
    text: '待使用',
    value: 0
  },
  {
    text: '已使用',
    value: 1
  },
  {
    text: '已失效',
    value: 2
  }
]
const bindPlanList = ref([])
async function handleDictList() {
  const viplistRes = await vipList()
  bindPlanList.value = viplistRes.data || []
}
handleDictList()
</script>

<style lang="scss">
.sv-add {
  width: 100%;
  height: 100%;

  .create-cdkey-btn {
    cursor: pointer;
    color: $uni-color-success;
    &:active {
      opacity: 0.8;
    }
  }
}
</style>
