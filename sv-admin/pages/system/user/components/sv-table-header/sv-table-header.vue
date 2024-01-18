<template>
  <view class="sv-table-header">
    <el-form class="sv-el-form" inline :model="filterForm" :size="size">
      <el-form-item label="UID">
        <el-input v-model="filterForm._id" placeholder="请输入用户UID" clearable />
      </el-form-item>
      <el-form-item label="用户名/昵称">
        <el-input v-model="filterForm.name" placeholder="请输入用户名/昵称" clearable />
      </el-form-item>
      <el-form-item label="账号类型">
        <el-select
          class="sv-el-select"
          v-model="filterForm.platform"
          placeholder="选择账号类型"
          clearable
        >
          <el-option
            :label="item.label"
            :value="item.value"
            v-for="item in platformList"
            :key="item"
          />
        </el-select>
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
  _id: '',
  name: '',
  platform: ''
})

// 停启用状态选择器
const platformList = [
  {
    label: '官方账户',
    value: 'web'
  },
  {
    label: '微信用户',
    value: 'mp-weixin'
  }
]

// 提交
function submit() {
  emits('submit', filterForm.value)
}

// 重置
function reset() {
  filterForm.value = {
    _id: '',
    name: '',
    platform: ''
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

  :deep(.el-form-item) {
    margin-bottom: 20px;
  }
}
</style>
