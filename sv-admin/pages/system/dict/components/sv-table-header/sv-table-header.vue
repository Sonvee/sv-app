<template>
  <view class="sv-table-header">
    <el-form class="sv-el-form" inline :model="filterForm">
      <el-form-item label="字典ID/名称">
        <el-input v-model="filterForm.name" placeholder="请输入字典ID/名称" clearable />
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

const emits = defineEmits(['submit'])

// 过滤条件表单
const filterForm = ref({
  name: ''
})

// 提交
function submit() {
  emits('submit', filterForm.value)
}

// 重置
function reset() {
  filterForm.value = {
    name: ''
  }
}
</script>

<style lang="scss">
.sv-table-header {
  width: 100%;
  padding: 10px 10px 0 10px;
  box-sizing: border-box;

  @include useTheme {
    border-bottom: 1px solid #{getTheme('sv-border-color')};
  }

  ::v-deep .el-form-item {
    margin-bottom: 20px;
  }
}
</style>
