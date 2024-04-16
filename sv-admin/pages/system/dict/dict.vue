<template>
  <view class="table-page-container">
    <!-- 筛选栏 -->
    <view class="header" v-if="showHeader">
      <sv-table-header @submit="submitFilter"></sv-table-header>
    </view>
    <!-- 表格头部控制栏 -->
    <view class="control">
      <el-button type="primary" plain size="small" :icon="Plus" @click="add">新增</el-button>
      <view style="flex: 1"></view>
      <el-button
        type="primary"
        link
        :icon="showHeader ? View : Hide"
        @click="showHeader = !showHeader"
      ></el-button>
      <el-button type="primary" link :icon="RefreshRight" @click="refresh"></el-button>
    </view>
    <!-- 表格主体 -->
    <el-table class="sv-el-table" v-loading="loading" :data="tableData" border>
      <el-table-column label="字典ID" :width="220">
        <template #default="scope">
          {{ scope.row.dict_id }}
          <el-tooltip effect="light" placement="right" content="复制">
            <el-button
              :icon="DocumentCopy"
              circle
              size="small"
              text
              @click="setClipboard(scope.row.dict_id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="dict_name" label="字典名称" :width="220" />
      <el-table-column
        prop="dict"
        label="字典内容"
        align="center"
        :width="300"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-popover placement="bottom" :width="300" trigger="click">
            <template #reference>
              <el-button size="small">查看详情</el-button>
            </template>
            <!-- 内嵌表格 -->
            <el-table :data="scope.row.dict">
              <el-table-column prop="key" label="字典键名" />
              <el-table-column prop="value" label="字典键值" />
            </el-table>
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column prop="comment" label="备注" :min-width="200" show-overflow-tooltip />
      <el-table-column
        prop="create_date"
        label="创建时间"
        :formatter="(row) => timeFormat(row.create_date)"
        align="center"
        :width="200"
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
import {
  View,
  Hide,
  RefreshRight,
  Plus,
  EditPen,
  Delete,
  DocumentCopy
} from '@element-plus/icons-vue'
import SvTableHeader from './components/sv-table-header/sv-table-header.vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { setClipboard, timeFormat } from '@/utils/util'
import { dictAdd, dictDelete, dictList, dictUpdate } from '@/service/api/sys'
import { storageDicts } from '@/utils/pinia-storage'
import { useSysStore } from '@/store/sys'

const showHeader = ref(useSysStore().platform == 'pc') // 头部筛选栏显示
const tableData = ref([]) // 菜单表格
const loading = ref(false) // 表格loading
const dataParams = ref({}) // 筛选参数
const showForm = ref(false) // 显示表单
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit

// 初始获取表格数据
handleTable(dataParams.value)

async function handleTable(params) {
  loading.value = true

  const dataRes = await dictList(params)
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
  handleTable(dataParams.value)
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
      result = await dictAdd(e.data)
      break
    case 'edit':
      // 编辑更新
      result = await dictUpdate(e.data)
      break
  }

  if (result.success) {
    ElNotification({
      title: 'Success',
      message: result?.message,
      type: 'success'
    })
    // 刷新本地字典缓存
    storageDicts()

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
  const { dict_id, dict_name } = item
  ElMessageBox.confirm(`确认删除『 ${dict_name} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await dictDelete({ dict_id })
      ElMessage({
        type: 'success',
        message: deleteRes?.message || deleteRes?.error?.message
      })
      // 刷新本地字典缓存
      storageDicts()

      refresh()
    })
    .catch(() => {})
}

// 头部筛选栏筛选条件
async function submitFilter(e) {
  Object.assign(dataParams.value, e)
  handleTable(dataParams.value)
}
</script>

<style lang="scss"></style>
