<template>
  <view class="sv-table-header">
    <el-form class="sv-el-form" inline :model="filterForm" :size="size">
      <el-form-item label="测试用例ID">
        <el-input
          v-model="filterForm.test_id"
          placeholder="请输入测试用例ID"
          clearable
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="测试用例名称">
        <el-input
          v-model="filterForm.test_name"
          placeholder="请输入测试用例名称"
          clearable
          style="width: 150px"
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
  test_id: '',
  test_name: ''
})

// 提交
function submit() {
  emits('submit', filterForm.value)
}

// 重置
function reset() {
  filterForm.value = {
    test_id: '',
    test_name: ''
  }
}
</script>

<style lang="scss"></style>
