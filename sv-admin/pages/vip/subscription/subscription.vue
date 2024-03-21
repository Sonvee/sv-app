<template>
  <view class="table-page-container">
    <!-- 筛选栏 -->
    <view class="header" v-if="showHeader">
      <sv-table-header @submit="submitFilter"></sv-table-header>
    </view>
    <!-- 表格头部控制栏 -->
    <view class="control">
      <el-button type="danger" plain size="small" :icon="Delete" @click="selectionRemove">
        批量删除
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
    <el-table
      class="sv-el-table"
      v-loading="loading"
      :data="tableData"
      border
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" align="center" width="50" fixed="left" />
      <el-table-column prop="user_id" label="订阅用户UID" :width="300" show-overflow-tooltip>
        <template #default="scope">
          {{ scope.row.user_id }}
          <el-tooltip effect="light" placement="right" content="复制">
            <el-button
              :icon="DocumentCopy"
              circle
              size="small"
              text
              @click="setClipboard(scope.row.user_id)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column
        prop="subscription_plan[0].plan_id"
        label="订阅套餐ID"
        :min-width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="subscription_plan[0]plan_name"
        label="订阅套餐名称"
        :min-width="200"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="duration_time"
        label="有效期(天)"
        align="center"
        :width="160"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ Math.floor(scope.row.duration_time / (24 * 60 * 60 * 1000)) }}
        </template>
      </el-table-column>
      <el-table-column prop="pay_fee" label="付款金额(分)" :width="260">
        <template #default="scope">
          {{ scope.row.pay_fee || 0 }}分
          <text class="text-cyan">= {{ convertFenToYuan(scope.row.pay_fee) }}元</text>
        </template>
      </el-table-column>
      <el-table-column prop="mode" label="订阅模式" align="center" :width="120">
        <template #default="scope">
          <el-tag :type="modeDict[scope.row.mode].type" effect="dark">
            {{ modeDict[scope.row.mode].text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="start_date"
        label="订阅日期"
        align="center"
        :width="200"
        show-overflow-tooltip
      >
        <template #default="scope">
          {{ timeFormat(scope.row.start_date) }}
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
  </view>
</template>

<script setup>
import { ref } from 'vue'
import SvTableHeader from './components/sv-table-header/sv-table-header.vue'
import { RefreshRight, Delete, View, Hide, DocumentCopy } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { subscriptionList, subscriptionDelete } from '@/service/api/vip'
import { useSysStore } from '@/store/sys'
import { timeFormat, setClipboard } from '@/utils/util'
import { isEmpty } from 'lodash-es'
import { convertFenToYuan } from '@/uni_modules/sv-id-vip/utils'

const showHeader = ref(useSysStore().platform == 'pc') // 头部筛选栏显示
const tableData = ref([]) // 菜单表格
const loading = ref(false) // 表格loading
const pagingParams = ref({ pagesize: 20, pagenum: 1 }) // 表格分页默认参数
const filterParams = ref({}) // 筛选参数
const total = ref(0) // 表格总数

const modeDict = {
  undefined: { text: '普通支付', type: 'primary' },
  0: { text: '普通支付', type: 'primary' },
  1: { text: '激活码', type: 'success' }
}

// 初始获取表格数据
handleTable(pagingParams.value)

async function handleTable(params) {
  loading.value = true

  const dataRes = await subscriptionList(params)
  tableData.value = dataRes.data || []

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

// 删除
function del(item) {
  const { _id } = item
  ElMessageBox.confirm(`确认删除${_id}吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await subscriptionDelete({ _id })
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
  batchSelection.value = e.map((item) => item._id)
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
      const deleteRes = await subscriptionDelete({
        _id: batchSelection.value
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
</script>

<style lang="scss"></style>
