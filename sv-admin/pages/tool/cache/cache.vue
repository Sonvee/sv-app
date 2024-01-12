<template>
  <view class="table-page-container">
    <!-- 表格头部控制栏 -->
    <view class="control">
      <el-button type="danger" plain size="small" :icon="Delete" @click="clear">清空</el-button>
      <el-button type="primary" plain size="small" :icon="RefreshRight" @click="refresh">
        刷新
      </el-button>
      <view class="placeholder"></view>
      <el-button type="primary" plain size="small" :icon="Refresh" @click="svidRefresh">
        更新svid缓存
      </el-button>
      <el-button type="primary" plain size="small" :icon="Refresh" @click="sysRefresh">
        更新sys缓存
      </el-button>
    </view>
    <!-- 表格主体 -->
    <el-table class="sv-el-table" v-loading="loading" :data="tableData" border>
      <el-table-column label="键名" :width="300">
        <template #default="scope">
          {{ scope.row.key }}
          <el-tooltip effect="light" placement="right" content="复制">
            <el-button
              :icon="DocumentCopy"
              circle
              size="small"
              text
              @click="copyCacheKey(scope.row.key)"
            />
          </el-tooltip>
        </template>
      </el-table-column>
      <el-table-column label="键值详情">
        <template #default="scope">
          <el-button type="primary" size="small" @click="onKeyDetail(scope.row.key)">
            查看详情
          </el-button>
        </template>
      </el-table-column>
      <el-table-column label="配置" align="center" :width="100" fixed="right">
        <template #default="scope">
          <!-- 静态菜单不显示配置项 -->
          <el-button-group>
            <el-button text size="small" :icon="Delete" @click="del(scope.row)">删除</el-button>
          </el-button-group>
        </template>
      </el-table-column>
    </el-table>
    <!-- 详情弹窗 -->
    <el-dialog
      class="sv-el-dialog"
      :width="appWidth"
      v-model="dialogVisible"
      :title="curCache?.key"
      align-center
    >
      <el-scrollbar height="500px">
        <sv-json-view :obj="curCache?.value" :key="jsonviewKey"></sv-json-view>
      </el-scrollbar>
    </el-dialog>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { RefreshRight, Refresh, Delete, DocumentCopy } from '@element-plus/icons-vue'
import { ElMessageBox, ElMessage } from 'element-plus'
import { refreshSvidStorage, refreshSysStorage } from '@/utils/pinia-storage'

const tableData = ref([]) // 菜单表格
const loading = ref(false) // 表格loading

const appWidth = computed(() => {
  return uni.getSystemInfoSync().deviceType == 'pc' ? '50%' : '90%'
})

// 初始获取表格数据
handleTable()

async function handleTable() {
  // 获取所有缓存键名
  const storageKeys = uni.getStorageInfoSync().keys
  tableData.value = storageKeys.map((item) => {
    return {
      key: item
    }
  })
}

const dialogVisible = ref(false)
const curCache = ref()
const jsonviewKey = ref(0)
// 根据key获取缓存值
function onKeyDetail(key) {
  curCache.value = null
  const value = uni.getStorageSync(key)
  curCache.value = { key, value }
  jsonviewKey.value++ // 手动刷新json-view组件
  dialogVisible.value = true
}

function copyCacheKey(key) {
  uni.setClipboardData({
    data: key
  })
}

// 刷新
function refresh() {
  tableData.value = [] // 置空数据
  handleTable()
}

// 更新svid缓存
function svidRefresh() {
  loading.value = true
  refreshSvidStorage().then(() => {
    refresh()
    loading.value = false
  })
}

// 更新sys缓存
function sysRefresh() {
  loading.value = true
  refreshSysStorage().then(() => {
    refresh()
    loading.value = false
  })
}

// 清空缓存
function clear() {
  ElMessageBox.confirm(
    `确认清空缓存吗？清空缓存会导致重新登陆或其它意料之外的问题，还请三思哦~`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      // 确认清空操作
      const storageKeys = uni.getStorageInfoSync().keys
      storageKeys.forEach((item) => {
        uni.removeStorageSync(item)
      })

      ElMessage({
        type: 'success',
        message: '清空成功'
      })
      refresh()
    })
    .catch(() => {})
}

// 删除
function del(item) {
  const { key } = item
  ElMessageBox.confirm(
    `确认删除${key}吗？删除部分缓存可能导致意料之外的问题，还请三思哦~`,
    '系统提示',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(async () => {
      // 确认删除操作
      uni.removeStorageSync(key)

      ElMessage({
        type: 'success',
        message: '删除成功'
      })
      refresh()
    })
    .catch(() => {})
}
</script>

<style lang="scss">
.table-page-container {
  .control {
    margin-bottom: 10px;
    display: flex;

    .placeholder {
      flex-grow: 1;
    }
  }

  .sv-pagination {
    padding: 10px 0;
    display: flex;
    justify-content: flex-end;
  }
}

::v-deep .nopadding-cell {
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