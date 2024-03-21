<template>
  <view class="sv-table-header">
    <el-form class="sv-el-form" inline :model="filterForm" :size="size">
      <el-form-item label="用户名/昵称">
        <el-input
          v-model="filterForm.name"
          placeholder="请输入用户名/昵称"
          clearable
          style="width: 150px"
        />
      </el-form-item>
      <el-form-item label="账号类型">
        <el-select
          class="sv-el-select"
          v-model="filterForm.platform"
          placeholder="选择账号类型"
          clearable
        >
          <el-option
            v-for="item in platformList"
            :key="item.label"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="日期时间">
        <el-date-picker
          v-model="filterForm.datetime"
          type="datetime"
          placeholder="请选择日期时间"
          value-format="x"
          style="width: 170px"
        />
      </el-form-item>
      <el-form-item label="日期时间范围">
        <el-date-picker
          v-model="filterForm.datetimerange"
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
  name: '',
  platform: ''
})

// 停启用状态选择器
const platformList = [
  {
    label: '普通账号',
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
    name: '',
    platform: '',
    datetime: '',
    datetimerange: []
  }
}
</script>

<style lang="scss"></style>
