<template>
  <view class="table-page-container">
    <!-- 筛选栏 -->
    <view class="header" v-if="showHeader">
      <sv-table-header @submit="submitFilter"></sv-table-header>
    </view>
    <!-- 表格头部控制栏 -->
    <view class="control">
      <!-- <el-button type="primary" plain size="small" :icon="Plus" @click="add">新增</el-button> -->
      <el-button type="danger" plain size="small" :icon="Delete" @click="selectionRemove">
        批量删除
      </el-button>
      <view style="flex: 1"></view>
      <sv-excel-menu
        type="feedback"
        :exportParams="dataParams"
        @noCoverImport="importOver"
        @coverImport="importOver"
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
      <el-table-column
        prop="user_id"
        label="反馈用户"
        :width="260"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="feedback_title"
        label="反馈标题"
        :width="300"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        prop="feedback_content"
        label="反馈内容"
        :min-width="400"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column prop="feedback_image" label="反馈图片" :min-width="220">
        <template #default="scope">
          <view v-if="scope.row.feedback_image?.length > 0">
            <el-image
              v-for="(item, index) in scope.row.feedback_image"
              style="width: 30px; height: 20px; margin-right: 2px"
              :src="item.url"
              :preview-src-list="scope.row.feedback_image.map((it) => it.url)"
              :initial-index="index"
              fit="cover"
              preview-teleported
            />
          </view>
        </template>
      </el-table-column>
      <el-table-column
        prop="feedback_type"
        label="反馈类型"
        align="center"
        :width="120"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-tag :type="fbtypeDict[scope.row.feedback_type].type" effect="dark">
            {{ fbtypeDict[scope.row.feedback_type].text }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="feedback_status"
        label="反馈状态"
        align="center"
        :width="120"
        show-overflow-tooltip
      >
        <template #default="scope">
          <el-tag :type="fbstatusDict[scope.row.feedback_status].type" effect="dark">
            {{ fbstatusDict[scope.row.feedback_status].text }}
          </el-tag>
        </template>
      </el-table-column>

      <el-table-column
        prop="create_date"
        label="反馈时间"
        :formatter="(row) => timeFormat(row.create_date)"
        align="center"
        :width="180"
        sortable
        show-overflow-tooltip
      ></el-table-column>

      <el-table-column label="配置" align="center" :width="160" fixed="right">
        <template #default="scope">
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
        :pagingParams="dataParams"
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
import { RefreshRight, Plus, EditPen, Delete, View, Hide } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'
import { feedbackList, feedbackAdd, feedbackDelete, feedbackUpdate } from '@/service/api/sys'
import { useSysStore } from '@/store/sys'
import { isEmpty } from 'lodash-es'
import { timeFormat } from '@/utils/util'

const showHeader = ref(useSysStore().platform == 'pc') // 头部筛选栏显示
const tableData = ref([]) // 菜单表格
const loading = ref(false) // 表格loading
const dataParams = ref({ pagesize: 20, pagenum: 1 }) // 筛选参数
const total = ref(0) // 表格总数
const showForm = ref(false) // 显示表单
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit

const fbtypeDict = {
  undefined: { text: '改进建议', type: 'primary' },
  0: { text: '改进建议', type: 'primary' },
  1: { text: '发现bug', type: 'danger' }
}

const fbstatusDict = {
  undefined: { text: '审批中', type: 'primary' },
  0: { text: '审批中', type: 'primary' },
  1: { text: '已解决', type: 'success' },
  2: { text: '已拒绝', type: 'danger' }
}

// 初始获取表格数据
handleTable(dataParams.value)

async function handleTable(params) {
  loading.value = true

  const dataRes = await feedbackList(params)
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
  formMode.value = 'edit'
  showForm.value = true
}

// 提交表单
async function submitForm(e) {
  let result = {}
  switch (e.mode) {
    case 'add':
      // 新增添加
      result = await feedbackAdd(e.data)
      break
    case 'edit':
      // 编辑更新
      result = await feedbackUpdate(e.data)
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
  const { feedback_title, feedback_id } = item
  ElMessageBox.confirm(`确认删除『 ${feedback_title} 』吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      // 确认删除操作
      const deleteRes = await feedbackDelete({ feedback_id })
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
  batchSelection.value = e.map((item) => item.feedback_id)
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
      const deleteRes = await feedbackDelete({
        feedback_id: batchSelection.value
      })

      ElMessage({
        type: 'success',
        message: deleteRes?.message || deleteRes?.error?.message
      })

      refresh()
    })
    .catch(() => {})
}

// 导入
function importOver(res) {
  ElMessage({
    type: res.code == 200 ? 'success' : 'warning',
    message: res.message
  })
  refresh()
}

// 头部筛选栏筛选条件
async function submitFilter(e) {
  Object.assign(dataParams.value, e)
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
