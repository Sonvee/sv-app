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
      <el-table-column prop="permission_id" label="权限ID" :width="320" />
      <el-table-column prop="permission_name" label="权限名称" :width="320" />
      <el-table-column prop="comment" label="备注" show-overflow-tooltip />
      <el-table-column
        prop="create_date"
        label="创建时间"
        :formatter="(row) => timeFormat(row.create_date)"
        align="center"
        :width="220"
        sortable
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column label="配置" align="center" :width="160" fixed="right">
        <template #default="scope">
          <!-- 静态菜单不显示配置项 -->
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
import { timeFormat } from '@/utils/util'
import {
  permissionAdd,
  permissionDelete,
  permissionList,
  permissionUpdate
} from '@/api/svid'
import { storagePermissions } from '@/utils/pinia-storage'

const tableData = ref([]) // 菜单表格
const loading = ref(false) // 表格loading
const showForm = ref(false) // 显示表单
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit

// 初始获取表格数据
handleTable()

async function handleTable() {
  loading.value = true

  const dataRes = await permissionList()
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
  showForm.value = true
  formMode.value = 'edit'
}

// 提交表单
async function submitForm(e) {
  let result = {}
  switch (e.mode) {
    case 'add':
      // 新增添加
      result = await permissionAdd(e.data)
      break
    case 'edit':
      // 编辑更新
      result = await permissionUpdate(e.data)
      break
  }

  if (result.success) {
    ElNotification({
      title: 'Success',
      message: result?.message,
      type: 'success'
    })
    // 刷新本地权限缓存
    storagePermissions()

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
  const { permission_id, permission_name } = item
  ElMessageBox.confirm(`确认删除『 ${permission_name} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await permissionDelete({ permission_id })
      ElMessage({
        type: 'success',
        message: deleteRes?.message || deleteRes?.error?.message
      })
      // 刷新本地权限缓存
      storagePermissions()

      refresh()
    })
    .catch(() => {})
}
</script>

<style lang="scss"></style>
