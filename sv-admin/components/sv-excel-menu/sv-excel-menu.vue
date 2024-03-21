<template>
  <view class="sv-excel-menu">
    <el-dropdown size="small" @command="onExcelMenuCommand">
      <el-button type="success" link>
        <template #icon>
          <view class="sv-icons-excel-fill"></view>
        </template>
      </el-button>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-for="item in menu" :key="item" :icon="menuMap[item].icon" :command="item">
            {{ menuMap[item].name }}
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </view>
</template>

<script setup>
import { Download, Upload, Reading, DocumentAdd, CopyDocument } from '@element-plus/icons-vue'
import { fileTemplate, fileImport, fileExport } from './excel-file.js'

const props = defineProps({
  type: {
    required: true,
    type: String,
    default: ''
  },
  // 导出参数
  exportParams: {
    type: Object,
    default: () => {
      return {
        pagesize: -1,
        pagenum: 1
      }
    }
  },
  menu: {
    type: Array,
    default: () => ['downloadTemplate', 'noCoverImport', 'coverImport', 'curPageExport', 'allPageExport']
  }
})

const emits = defineEmits(['downloadTemplate', 'noCoverImport', 'coverImport', 'curPageExport', 'allPageExport'])

const menuMap = {
  downloadTemplate: { name: '下载模版', icon: Download },
  noCoverImport: { name: '增量导入', icon: DocumentAdd },
  coverImport: { name: '覆盖导入', icon: CopyDocument },
  curPageExport: { name: '导出当页', icon: Upload },
  allPageExport: { name: '导出全部', icon: Reading }
}

function onExcelMenuCommand(command) {
  switch (command) {
    case 'downloadTemplate':
      // 下载模版
      fileTemplate(props.type, () => {
        emits(command)
      })
      break
    case 'noCoverImport':
      // 增量导入 - 不覆盖，只添加新数据
      fileImport(props.type, false, (res) => {
        emits(command, res)
      })
      break
    case 'coverImport':
      // 覆盖导入 - 会覆盖相同已有的数据
      fileImport(props.type, true, (res) => {
        emits(command, res)
      })
      break
    case 'curPageExport':
      // 导出当页
      fileExport(props.type, false, props.exportParams, () => {
        emits(command)
      })
      break
    case 'allPageExport':
      // 导出全部
      fileExport(props.type, true, props.exportParams, () => {
        emits(command)
      })
      break
  }
}
</script>

<style lang="scss">
.sv-excel-menu {
  margin-right: 12px;
  display: flex;
  align-items: center;
}
</style>
