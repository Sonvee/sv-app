<template>
  <view class="table-page-container">
    <!-- 表格头部控制栏 -->
    <view class="control">
      <el-button type="primary" plain size="small" :icon="Plus" @click="addFirst">
        新增一级菜单
      </el-button>
      <el-button type="primary" plain size="small" :icon="Sort" @click="toggleExpandAll">
        展开/折叠
      </el-button>
      <view style="flex: 1"></view>
      <el-button type="primary" link :icon="RefreshRight" @click="refresh"></el-button>
    </view>
    <!-- 表格主体 -->
    <el-table
      v-if="refreshTable"
      v-loading="loading"
      class="sv-el-table"
      :data="tableData"
      row-key="menu_id"
      border
      :default-expand-all="isExpandAll"
    >
      <el-table-column prop="name" label="名称" :width="200" fixed="left" />
      <el-table-column prop="menu_id" label="ID" show-overflow-tooltip :width="280" />
      <el-table-column prop="icon" label="图标" align="center" :width="80">
        <template #default="scope">
          <el-tooltip :content="scope.row.icon" placement="bottom" effect="light">
            <el-button :class="scope.row.icon" link></el-button>
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column sortable prop="sort" label="序号" :width="100" />
      <el-table-column prop="url" label="路径" show-overflow-tooltip :width="320" />
      <el-table-column prop="permission" label="权限" show-overflow-tooltip>
        <template #default="scope">
          <el-tag
            v-for="item in scope.row.permission"
            :key="item"
            effect="plain"
            style="margin: 4px"
          >
            {{ item }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="状态" align="center" :width="80">
        <template #default="scope">
          <el-tag :type="scope.row.enable ? '' : 'danger'" effect="dark">
            {{ scope.row.enable ? '启用' : '停用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="类型" align="center" :width="80">
        <template #default="scope">
          <el-tooltip
            v-if="scope.row?.type == 'static'"
            effect="light"
            content="静态菜单请在admin.config.js中配置"
            placement="right"
          >
            <el-tag type="info">静态</el-tag>
          </el-tooltip>
          <el-tag v-else type="success">动态</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="配置" align="center" :width="220" fixed="right">
        <template #default="scope">
          <!-- 静态菜单不显示配置项 -->
          <el-button-group v-if="scope.row?.type !== 'static'">
            <el-button text size="small" :icon="Plus" @click="add(scope.row)">新增</el-button>
            <el-button text size="small" :icon="EditPen" @click="edit(scope.row)">编辑</el-button>
            <el-button
              v-if="!scope.row?.children?.length > 0"
              text
              size="small"
              :icon="Delete"
              @click="del(scope.row)"
            >
              删除
            </el-button>
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
import { nextTick, ref } from 'vue'
import SvForm from './components/sv-form/sv-form.vue'
import { getMenu } from '@/utils/sys.js'
import { menuAdd, menuDelete, menuUpdate } from '@/service/api/sys.js'
import { Sort, RefreshRight, Plus, EditPen, Delete } from '@element-plus/icons-vue'
import { ElNotification, ElMessageBox, ElMessage } from 'element-plus'

const refreshTable = ref(true) // 重新渲染表格状态
const loading = ref(false)

const tableData = ref([]) // 菜单表格

const showForm = ref(false) // 显示表单
const formInit = ref({}) // 表单初始值
const formMode = ref('') // 表单模式 add / edit

// 获取菜单数据
handleMenu()
async function handleMenu() {
  loading.value = true

  const menu = await getMenu()
  tableData.value = menu

  loading.value = false
}

// 展开/折叠 默认展开
const isExpandAll = ref(true)
function toggleExpandAll() {
  refreshTable.value = false
  isExpandAll.value = !isExpandAll.value
  nextTick(() => {
    refreshTable.value = true
  })
}

// 刷新
function refresh() {
  tableData.value = [] // 初始化
  handleMenu()
}

// 新增一级菜单
function addFirst() {
  formInit.value = {}
  formMode.value = 'add'
  showForm.value = true
}

// 新增次级菜单
function add(item) {
  formInit.value = { parent_id: item.menu_id, url: item.url }
  formMode.value = 'add'
  showForm.value = true
}

// 编辑，若修改父级menu_id，则需要同时对其子级的parent_id进行修改
let tempChild = {
  children: [], // 暂存children，用于遍历修改
  parent: '' // 暂存父级menu_id，用于对比变化
}
function edit(item) {
  // 暂存children和parent_id
  tempChild.children = item.children
  tempChild.parent = item.menu_id
  const itemCopy = { ...item }
  // 移除itemCopy中children字段
  delete itemCopy.children
  formInit.value = itemCopy
  showForm.value = true
  formMode.value = 'edit'
}

// 提交表单
async function submitForm(e) {
  let result = {}
  switch (e.mode) {
    case 'add':
      // 新增添加
      result = await menuAdd(e.data)
      break
    case 'edit':
      // 编辑更新
      result = await menuUpdate(e.data)
      // 若修改了父级的menu_id，则所有子级的parent_id全都跟着修改
      if (tempChild.parent !== e.data.menu_id && tempChild.children.length > 0) {
        tempChild.children.forEach(async (item) => {
          await menuUpdate({
            _id: item._id,
            parent_id: e.data.menu_id
          })
        })
        // 子级更新完成之后再初始化
        tempChild.children = []
        tempChild.parent = ''
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
  const { name, menu_id } = item
  ElMessageBox.confirm(`确认删除${name}吗？`, '系统提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(async () => {
      const menudeleteRes = await menuDelete({ menu_id })
      // console.log('==== menudeleteRes :', menudeleteRes)
      ElMessage({
        type: 'success',
        message: menudeleteRes.message
      })
      refresh()
    })
    .catch(() => {})
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
}
</style>
