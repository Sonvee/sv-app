<template>
  <view class="table-page-container">
    <!-- 筛选栏 -->
    <view class="header" v-if="showHeader">
      <sv-table-header @submit="submitFilter"></sv-table-header>
    </view>
    <!-- 表格头部控制栏 -->
    <view class="control">
      <el-button type="primary" plain size="small" :icon="Plus" @click="add">新增</el-button>
      <el-button type="primary" plain size="small" :icon="Pointer" @click="onekey">
        一键新增
      </el-button>
      <el-button type="danger" plain size="small" :icon="Delete" @click="selectionRemove">
        批量删除
      </el-button>
      <el-button type="success" plain size="small" :icon="Refresh" @click="cdkeyVerify">
        刷新状态
      </el-button>
      <el-button type="danger" plain size="small" :icon="Close" @click="invalidRemove">
        清空失效
      </el-button>
      <view style="flex: 1"></view>
      <sv-excel-menu
        type="cdkey"
        :menu="['curPageExport', 'allPageExport']"
        :exportParams="pagingParams"
      ></sv-excel-menu>
      <el-button
        type="primary"
        link
        :icon="showHeader ? View : Hide"
        @click="showHeader = !showHeader"
      ></el-button>
      <el-button type="primary" link :icon="RefreshRight" @click="refresh"></el-button>
    </view>
    <!-- 表格主体 -->
    <el-table
      class="sv-el-table"
      v-loading="loading"
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="50" fixed="left" />
      <el-table-column prop="cdkey" label="激活码" :min-width="320" show-overflow-tooltip>
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
      <el-table-column
        prop="bind_plan[0].plan_id"
        label="绑定套餐ID"
        :min-width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="bind_plan[0].plan_name"
        label="绑定套餐名称"
        :min-width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="bind_plan[0].valid_day"
        label="绑定套餐有效期(天)"
        :width="200"
      ></el-table-column>
      <el-table-column prop="valid_date" align="center" label="激活码有效期至" :width="200">
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
  Pointer,
  Delete,
  Close,
  View,
  Hide,
  DocumentCopy
} from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import {
  cdkeyAdd,
  cdkeyDelete,
  cdkeyInvalidRemove,
  cdkeyList,
  cdkeyVerifyAuto
} from '@/service/api/vip'
import { useSysStore } from '@/store/sys'
import { timeFormat, setClipboard } from '@/utils/util'
import { createCDKey } from '@/uni_modules/sv-id-vip/utils'
import { isEmpty } from 'lodash-es'

const showHeader = ref(useSysStore().platform == 'pc') // 头部筛选栏显示
const tableData = ref([]) // 菜单表格
const loading = ref(false) // 表格loading
const pagingParams = ref({ pagesize: 20, pagenum: 1 }) // 表格分页默认参数
const filterParams = ref({}) // 筛选参数
const total = ref(0) // 表格总数
const showForm = ref(false) // 显示表单
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / onekey

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

  total.value = dataRes.total || 0

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

// 一键新增
function onekey() {
  formInit.value = {} // 置空参数
  formMode.value = 'onekey'
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
    case 'onekey':
      // 一键添加
      uni.showLoading({
        title: '一键生成中...'
      })
      for (let i = 0; i < e.data.num; i++) {
        await cdkeyAdd({
          cdkey: createCDKey(),
          bind_plan: e.data.bind_plan,
          valid_date: e.data.valid_date,
          status: 0
        })
      }
      uni.hideLoading()

      result = {
        success: true,
        message: '一键添加成功'
      }
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

// 多选
const batchSelection = ref([])
function handleSelectionChange(e) {
  batchSelection.value = e.map((item) => item.cdkey)
}

// 批量删除
function selectionRemove() {
  if (isEmpty(batchSelection.value)) return

  ElMessageBox.confirm(`确认批量删除所选项吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认批量删除操作
      const deleteRes = await cdkeyDelete({
        cdkey: batchSelection.value
      })

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
async function cdkeyVerify() {
  uni.showLoading({
    title: '校验中...'
  })
  await cdkeyVerifyAuto()
  uni.hideLoading()

  refresh()
}

function invalidRemove() {
  ElMessageBox.confirm(`确认一键清空失效的CDKEY吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const removeRes = await cdkeyInvalidRemove()

      ElMessage({
        type: 'success',
        message: removeRes?.message || removeRes?.error?.message
      })

      refresh()
    })
    .catch(() => {})
}
</script>

<style lang="scss"></style>
