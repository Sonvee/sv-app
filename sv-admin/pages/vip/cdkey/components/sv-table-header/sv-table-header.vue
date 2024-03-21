<template>
  <view class="sv-table-header">
    <el-form class="sv-el-form" inline :model="filterForm" :size="size">
      <el-form-item label="CDKEY">
        <el-input
          v-model="filterForm.cdkey"
          placeholder="请输入CDKEY"
          clearable
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="绑定套餐">
        <sv-dict-select
          v-model="filterForm.bind_plan"
          placeholder="请选择绑定套餐"
          :dictList="bindPlanList"
          keyName="plan_name"
          valueName="plan_id"
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
import { vipList } from '@/service/api/vip'

const props = defineProps({
  size: {
    type: String,
    default: 'small' // 'large' | 'default' | 'small'
  }
})

const emits = defineEmits(['submit'])

// 过滤条件表单
const filterForm = ref({
  cdkey: '',
  bind_plan: ''
})

const bindPlanList = ref([])
async function handleDictList() {
  const viplistRes = await vipList()
  bindPlanList.value = viplistRes.data || []
}
handleDictList()

// 提交
function submit() {
  emits('submit', filterForm.value)
}

// 重置
function reset() {
  filterForm.value = {
    cdkey: '',
    bind_plan: ''
  }
}
</script>

<style lang="scss"></style>
