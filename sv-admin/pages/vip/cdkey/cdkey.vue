<template>
  <view class="table-page-container">
    <!-- 筛选栏 -->
    <view class="header" v-if="showHeader">
      <sv-table-header @submit="submitFilter"></sv-table-header>
    </view>
    <!-- 表格头部控制栏 -->
    <view class="control">
      <el-button type="primary" plain size="small" :icon="Plus" @click="add">新增</el-button>
      <el-button type="primary" plain size="small" :icon="Plus" @click="add">一键新增</el-button>
      <el-button type="primary" plain size="small" :icon="Refresh" @click="cdkeyVerify">
        刷新状态
      </el-button>
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
      <el-table-column prop="cdkey" label="激活码" :min-width="300" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.cdkey }}
          <el-tooltip effect="light" placement="right" content="复制">
            <el-button
              :icon="DocumentCopy"
              circle
              size="small"
              text
              @click="setClipboard(scope.row.cdkey)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column prop="bind_plan" label="绑定套餐" :min-width="300" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.bind_plan[0].plan_id }}『{{ scope.row.bind_plan[0].plan_name }}』
        </template>
      </el-table-column>
      <el-table-column prop="valid_date" align="center" label="有效期至" :width="200">
        <template #default="scope">
          {{ timeFormat(scope.row.valid_date) }}
        </template>
      </el-table-column>
      <el-table-column prop="status" align="center" label="状态" :width="120">
        <template #default="scope">
          <el-tag :type="cdkeyStatusDict[scope.row.status].type" effect="dark">
            {{ cdkeyStatusDict[scope.row.status].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column label="配置" align="center" :width="100" fixed="right">
        <template #default="scope">
          <el-button-group>
            <el-button text size="small" :icon="Delete" @click="del(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <view class="sv-pagination">
      <sv-pagination
        :pagingParams="pagingParams"
        :total="total"
        @update:page-size="handleSizeChange"
        @update:current-page="handleCurrentChange"
      />
    </view>
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
import SvTableHeader from './components/sv-table-header/sv-table-header.vue'
import {
  RefreshRight,
  Refresh,
  Plus,
  Delete,
  View,
  Hide,
  DocumentCopy
} from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { cdkeyAdd, cdkeyDelete, cdkeyList, cdkeyVerifyAuto } from '@/service/api/vip'
import { useSysStore } from '@/store/sys'
import { timeFormat, setClipboard } from '@/utils/util'

const showHeader = ref(useSysStore().platform == 'pc') // 头部筛选栏显示
const tableData = ref([]) // 菜单表格
const loading = ref(false) // 表格loading
const pagingParams = ref({ pagesize: 10, pagenum: 1 }) // 表格分页默认参数
const filterParams = ref({}) // 筛选参数
const total = ref(0) // 表格总数
const showForm = ref(false) // 显示表单
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit

const cdkeyStatusDict = {
  undefined: { text: '待使用', type: 'primary' },
  0: { text: '待使用', type: 'primary' },
  1: { text: '已使用', type: 'danger' },
  2: { text: '已失效', type: 'warning' }
}

// 初始获取表格数据
handleTable(pagingParams.value)

async function handleTable(params) {
  loading.value = true

  const dataRes = await cdkeyList(params)
  tableData.value = dataRes.data

  total.value = dataRes.total

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
  handleTable({ ...pagingParams.value, ...filterParams.value })
}

// 新增
function add() {
  formInit.value = {} // 置空参数
  formMode.value = 'add'
  showForm.value = true
}

// 提交表单
async function submitForm(e) {
  let result = {}
  switch (e.mode) {
    case 'add':
      // 新增添加
      result = await cdkeyAdd(e.data)
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
  const { cdkey } = item
  ElMessageBox.confirm(`确认删除${cdkey}吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await cdkeyDelete({ cdkey })
      ElMessage({
        type: 'success',
        message: deleteRes?.message || deleteRes?.error?.message
      })

      refresh()
    })
    .catch(() => {})
}

// 头部筛选栏筛选条件
async function submitFilter(e) {
  filterParams.value = e
  ElMessage({
    type: 'success',
    message: '搜索成功(仅展示)'
  })
  handleTable({ ...pagingParams.value, ...e })
}

// 分页
function handleSizeChange(e) {
  pagingParams.value.pagesize = e
  handleTable(pagingParams.value)
}
function handleCurrentChange(e) {
  pagingParams.value.pagenum = e
  handleTable(pagingParams.value)
}

/**
 * cdkey状态手动校验
 */
function cdkeyVerify() {
  cdkeyVerifyAuto().then(() => {
    refresh()
  })
}
</script>

<style lang="scss">
.table-page-container {
  .header,
  .control {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
  }

  .sv-pagination {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}

:deep(.nopadding-cell) {
  // 取消该单元格内边距
  padding: 0 !important;
}
.avatar-image {
  width: 30px;
  height: 30px;
  display: block;
  margin: 0 auto;
}
</style>
