<template>
  <view class="sv-table-header">
    <el-form class="sv-el-form" inline :model="filterForm" :size="size">
      <el-form-item label="订阅用户UID">
        <el-input
          v-model="filterForm.user_id"
          placeholder="请输入订阅用户UID"
          clearable
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="订阅模式">
        <sv-dict-select
          v-model="filterForm.mode"
          placeholder="请选择订阅模式"
          :dictList="modeList"
          keyName="text"
          valueName="value"
        ></sv-dict-select>
      </el-form-item>
      <el-form-item label="订阅日期">
        <el-date-picker
          v-model="filterForm.start_date_range"
          type="datetimerange"
          range-separator="~"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="x"
          :default-time="[new Date(0, 0, 0, 0, 0, 0), new Date(0, 0, 0, 23, 59, 59)]"
          style="width: 320px"
        />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">搜索</el-button>
        <el-button type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </view>
</template>

<script setup>
import { ref } from 'vue'

const props = defineProps({
  size: {
    type: String,
    default: 'small' // 'large' | 'default' | 'small'
  }
})

const emits = defineEmits(['submit'])

// 过滤条件表单
const filterForm = ref({
  user_id: '',
  mode: '',
  start_date_range: []
})

const modeList = [
  {
    text: '普通支付',
    value: 0
  },
  {
    text: '激活码',
    value: 1
  }
]

// 提交
function submit() {
  emits('submit', filterForm.value)
}

// 重置
function reset() {
  filterForm.value = {
    user_id: '',
    mode: '',
    start_date_range: []
  }
}
</script>

<style lang="scss">
.sv-table-header {
  width: 100%;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;

  @include useTheme {
    border-bottom: 1px solid #{getTheme('sv-admin-border-color')};
  }

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}
</style>
