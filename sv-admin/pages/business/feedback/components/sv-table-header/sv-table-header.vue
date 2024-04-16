<template>
  <view class="sv-table-header">
    <el-form class="sv-el-form" inline :model="filterForm" :size="size">
      <el-form-item label="反馈用户ID">
        <el-input
          v-model="filterForm.user_id"
          placeholder="请输入反馈用户ID"
          clearable
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="反馈标题">
        <el-input
          v-model="filterForm.feedback_title"
          placeholder="请输入反馈标题"
          clearable
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="反馈类型">
        <sv-dict-select
          v-model="filterForm.feedback_type"
          placeholder="请选择反馈类型"
          :dictList="fbtypeList"
          keyName="text"
          valueName="value"
        ></sv-dict-select>
      </el-form-item>
      <el-form-item label="反馈状态">
        <sv-dict-select
          v-model="filterForm.feedback_status"
          placeholder="请选择反馈状态"
          :dictList="fbstatusList"
          keyName="text"
          valueName="value"
        ></sv-dict-select>
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

const fbtypeList = [
  { text: '改进建议', value: 0 },
  { text: '发现bug', value: 1 }
]

const fbstatusList = [
  { text: '审批中', value: 0 },
  { text: '已解决', value: 1 },
  { text: '已拒绝', value: 2 }
]

// 过滤条件表单
const filterForm = ref({
  user_id: '',
  feedback_title: '',
  feedback_type: '',
  feedback_status: ''
})

// 提交
function submit() {
  emits('submit', filterForm.value)
}

// 重置
function reset() {
  filterForm.value = {
    user_id: '',
    feedback_title: '',
    feedback_type: '',
    feedback_status: ''
  }
}
</script>

<style lang="scss"></style>
