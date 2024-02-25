<template>
  <view class="sv-table-header">
    <el-form class="sv-el-form" inline :model="filterForm" :size="size">
      <el-form-item label="UID">
        <el-input v-model="filterForm._id" placeholder="请输入用户UID" clearable />
      </el-form-item>
      <el-form-item label="用户名/昵称">
        <el-input v-model="filterForm.name" placeholder="请输入用户名/昵称" clearable />
      </el-form-item>
      <el-form-item label="角色">
        <sv-dict-select
          v-model="filterForm.role"
          placeholder="选择角色"
          :dictList="useSvidStore().getRoles()"
          keyName="role_name"
          valueName="role_id"
        ></sv-dict-select>
      </el-form-item>
      <el-form-item label="账号类型">
        <sv-dict-select
          v-model="filterForm.platform"
          placeholder="选择账号类型"
          dictType="uni_id_users_platform"
          keyName="key"
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
import { useSvidStore } from '@/store/svid'

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
  platform: '',
  role: ''
})

// 提交
function submit() {
  emits('submit', filterForm.value)
}

// 重置
function reset() {
  filterForm.value = {
    _id: '',
    name: '',
    platform: '',
    role: ''
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
