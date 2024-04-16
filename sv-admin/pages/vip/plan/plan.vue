<template>
  <view class="table-page-container">
    <!-- 表格头部控制栏 -->
    <view class="control">
      <el-button type="primary" plain size="small" :icon="Plus" @click="add">新增</el-button>
      <view style="flex: 1"></view>
      <el-button type="primary" link :icon="RefreshRight" @click="refresh"></el-button>
    </view>
    <!-- 表格主体 -->
    <el-table class="sv-el-table" v-loading="loading" :data="tableData" border>
      <el-table-column prop="sort" label="序号" align="center" :width="60" />
      <el-table-column prop="plan_id" label="套餐ID" :width="240" />
      <el-table-column prop="plan_name" label="套餐名称" :width="200" />
      <el-table-column prop="description" label="套餐描述" :min-width="200" />
      <el-table-column prop="valid_day" label="有效期(天)" :width="120" />
      <el-table-column prop="price" label="定价(分)" :width="200">
        <template #default="scope">
          {{ scope.row.price }}分
          <text class="text-cyan">= {{ convertFenToYuan(scope.row.price) }}元</text>
        </template>
      </el-table-column>
      <el-table-column prop="discount" label="折扣(分)" :width="200">
        <template #default="scope">
          {{ scope.row.discount }}分
          <text class="text-cyan">= {{ convertFenToYuan(scope.row.discount) }}元</text>
        </template>
      </el-table-column>
      <el-table-column label="售价(分)" :width="200">
        <template #default="scope">
          {{ scope.row.price - scope.row.discount }}分
          <text class="text-cyan">
            = {{ convertFenToYuan(scope.row.price - scope.row.discount) }}元
          </text>
        </template>
      </el-table-column>
      <el-table-column label="配置" align="center" :width="160" fixed="right">
        <template #default="scope">
          <el-button-group>
            <el-button text size="small" :icon="EditPen" @click="edit(scope.row)">编辑</el-button>
            <el-button text size="small" :icon="Delete" @click="del(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 表单抽屉弹窗 -->
    <sv-form
      v-model="showForm"
      :form-init="formInit"
      :form-mode="formMode"
      @submit="submitForm"
    ></sv-form>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import SvForm from './components/sv-form/sv-form.vue'
import { RefreshRight, Plus, EditPen, Delete } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { vipAdd, vipDelete, vipList, vipUpdate } from '@/service/api/vip'
import { convertFenToYuan } from '@/uni_modules/sv-id-vip/utils'

const tableData = ref([]) // 菜单表格
const loading = ref(false) // 表格loading
const showForm = ref(false) // 显示表单
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit

// 初始获取表格数据
handleTable()

async function handleTable() {
  loading.value = true

  const dataRes = await vipList()
  tableData.value = dataRes.data

  if (!dataRes.success) {
    ElMessage({
      message: dataRes?.message || dataRes?.error?.message,
      type: 'warning'
    })
  }

  loading.value = false
}

// 刷新
function refresh() {
  tableData.value = [] // 置空数据
  handleTable()
}

// 新增
function add() {
  formInit.value = {} // 置空参数
  formMode.value = 'add'
  showForm.value = true
}

// 编辑
function edit(item) {
  formInit.value = item // 携带参数
  formMode.value = 'edit'
  showForm.value = true
}

// 提交表单
async function submitForm(e) {
  let result = {}
  switch (e.mode) {
    case 'add':
      // 新增添加
      result = await vipAdd(e.data)
      break
    case 'edit':
      // 编辑更新
      result = await vipUpdate(e.data)
      break
  }

  if (result.success) {
    ElNotification({
      title: 'Success',
      message: result?.message,
      type: 'success'
    })

    refresh()
  } else {
    ElNotification({
      title: 'Error',
      message: result?.message || result?.error?.message,
      type: 'error'
    })
  }
}

// 删除
function del(item) {
  const { plan_id, plan_name } = item
  ElMessageBox.confirm(`确认删除『 ${plan_name} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await vipDelete({ plan_id })
      ElMessage({
        type: 'success',
        message: deleteRes?.message || deleteRes?.error?.message
      })

      refresh()
    })
    .catch(() => {})
}
</script>

<style lang="scss"></style>
