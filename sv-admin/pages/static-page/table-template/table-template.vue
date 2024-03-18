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
      <el-button type="primary" link :icon="showHeader ? View : Hide" @click="showHeader = !showHeader"></el-button>
      <el-button type="primary" link :icon="RefreshRight" @click="refresh"></el-button>
    </view>
    <!-- 表格主体 -->
    <el-table class="sv-el-table" v-loading="loading" :data="tableData" border>
      <el-table-column
        prop="avatar_file"
        label="头像"
        align="center"
        class-name="nopadding-cell"
        :width="60"
        fixed="left"
      >
        <template #default="scope">
          <image class="avatar-image" v-if="scope.row.avatar_file" :src="scope.row.avatar_file?.url" />
        </template>
      </el-table-column>
      <el-table-column prop="username" label="用户名" :width="180" fixed="left" />
      <el-table-column prop="nickname" label="昵称" :width="180" />
      <el-table-column prop="my_invite_code" label="邀请码" :width="120" />
      <el-table-column prop="dcloud_appid" label="可用APP" :min-width="300" align="center" show-overflow-tooltip>
        <template #default="scope">
          <el-tag
            v-for="(item, index) in scope.row.dcloud_appid"
            :key="item"
            :class="'sv-ml-gap-' + index"
            type="success"
            effect="plain"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <!-- 用户状态：0 正常 1 禁用 2 审核中 3 审核拒绝 -->
      <el-table-column prop="status" label="状态" align="center" :width="100">
        <template #default="scope">
          <el-tag :type="statusMap[scope.row.status].type" effect="dark">
            {{ statusMap[scope.row.status].text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="register_date"
        label="注册时间"
        :formatter="(row) => timeFormat(row.register_date)"
        align="center"
        sortable
        :min-width="120"
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
    <sv-form v-model="showForm" :form-init="formInit" :form-mode="formMode" @submit="submitForm"></sv-form>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import SvTableHeader from './components/sv-table-header/sv-table-header.vue'
import SvForm from './components/sv-form/sv-form.vue'
import { RefreshRight, View, Hide, Plus, EditPen, Delete } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { timeFormat } from '@/utils/util'
import tempdata from './temp-tabledata.json'
import { useSysStore } from '@/store/sys'

const showHeader = ref(useSysStore().platform == 'pc') // 头部筛选栏显示
const tableData = ref([]) // 菜单表格
const loading = ref(false) // 表格loading
const pagingParams = ref({ pagesize: 10, pagenum: 1 }) // 表格分页默认参数
const filterParams = ref({}) // 筛选参数
const total = ref(0) // 表格总数
const showForm = ref(false) // 显示表单
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit

// 初始获取表格数据
handleTable(pagingParams.value)

async function handleTable(params) {
  loading.value = true

  setTimeout(() => {
    // 替换成接口，注意携带参数
    tableData.value = tempdata.data
    total.value = tempdata.total

    if (!tempdata.success) {
      ElMessage({
        message: tempdata?.message || tempdata?.error?.message || 'Request Fail (仅展示)',
        type: 'warning'
      })
    }

    loading.value = false
  }, 1200)
}

// 状态格式化 用户状态：0 正常 1 禁用 2 审核中 3 审核拒绝
const statusMap = {
  undefined: { text: '正常', type: 'primary' }, // undefined也为正常
  0: { text: '正常', type: 'primary' },
  1: { text: '禁用', type: 'danger' },
  2: { text: '审核中', type: 'info' },
  3: { text: '审核拒绝', type: 'warning' }
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
      console.log('==== 新增添加 :', e)
      break
    case 'edit':
      // 编辑更新
      console.log('==== 编辑更新 :', e)
      break
  }

  if (result.success) {
    ElNotification({
      title: 'Success',
      message: result?.message || 'Request Success (仅展示)',
      type: 'success'
    })
    refresh()
  } else {
    ElNotification({
      title: 'Error',
      message: result?.message || result?.error?.message || 'Request Fail (仅展示)',
      type: 'error'
    })
  }
}

// 删除
function del(item) {
  ElMessageBox.confirm(`确认删除${item.username}吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作

      /**
       * 如果涉及到图片等文件，需要删除云存储中原文件
       * @param {string} fileurl 要删除的文件路径
       */
      // uniCloud.importObject('sv-utils').deleteCloudFile([fileurl])
      ElMessage({
        type: 'success',
        message: '删除成功(仅展示)'
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
</script>

<style lang="scss">
.table-page-container {
  display: flex;
  flex-direction: column;

  .header,
  .control {
    margin-bottom: 10px;
    display: flex;
    flex-wrap: wrap;
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
