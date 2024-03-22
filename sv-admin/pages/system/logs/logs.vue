<template>
  <view class="table-page-container">
    <!-- 表格头部控制栏 -->
    <view class="control">
      <view style="flex: 1"></view>
      <sv-excel-menu
        type="logs"
        :menu="['curPageExport', 'allPageExport']"
        :exportParams="dataParams"
      ></sv-excel-menu>
      <el-button type="primary" link :icon="RefreshRight" @click="refresh"></el-button>
    </view>
    <!-- 表格主体 -->
    <el-table class="sv-el-table" v-loading="loading" :data="tableData" border>
      <el-table-column prop="user_id[0]._id" label="用户ID" :width="240" show-overflow-tooltip />
      <el-table-column
        prop="user_id[0].nickname"
        label="用户昵称"
        :width="160"
        show-overflow-tooltip
      />
      <el-table-column prop="ip" label="IP地址" :width="150" />
      <el-table-column prop="appid" label="登录客户端" :width="150" align="center" />
      <el-table-column prop="type" label="操作类型" :width="120" />
      <el-table-column
        prop="state"
        label="状态"
        :width="80"
        align="center"
        :formatter="(row) => (row.state == 1 ? '成功' : '失败')"
        :filters="[
          { text: '成功', value: 1 },
          { text: '失败', value: 0 }
        ]"
        :filter-method="(value, row) => row.state == value"
      />
      <el-table-column prop="device_id" label="唯一设备标识" :width="200" show-overflow-tooltip />
      <el-table-column
        prop="ua"
        label="userAgent"
        :min-width="200"
        align="center"
        show-overflow-tooltip
      />
      <el-table-column
        prop="create_date"
        label="操作时间"
        :formatter="(row) => timeFormat(row.create_date)"
        align="center"
        :width="180"
        sortable
        show-overflow-tooltip
      ></el-table-column>
    </el-table>
    <!-- 分页 -->
    <sv-pagination
      :pagingParams="dataParams"
      :total="total"
      @update:page-size="handleSizeChange"
      @update:current-page="handleCurrentChange"
    />
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { RefreshRight } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { timeFormat } from '@/utils/util'
import { logList } from '@/service/api/svid'

const tableData = ref([]) // 菜单表格
const loading = ref(false) // 表格loading
const dataParams = ref({ pagesize: 20, pagenum: 1 }) // 表格分页默认参数
const total = ref(0) // 表格总数

// 初始获取表格数据
handleTable(dataParams.value)

async function handleTable(params) {
  loading.value = true

  const dataRes = await logList(params)
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
  handleTable(dataParams.value)
}

// 分页
function handleSizeChange(e) {
  dataParams.value.pagesize = e
  handleTable(dataParams.value)
}
function handleCurrentChange(e) {
  dataParams.value.pagenum = e
  handleTable(dataParams.value)
}
</script>

<style lang="scss"></style>
