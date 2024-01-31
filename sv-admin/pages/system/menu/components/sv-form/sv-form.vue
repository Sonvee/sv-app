<template>
  <el-drawer
    v-bind="$attrs"
    class="sv-el-drawer"
    ref="drawerRef"
    @open="openDrawer"
    @close="closeDrawer"
    destroy-on-close
    :close-on-click-modal="false"
  >
    <template #header>
      <h3>{{ formMode == 'add' ? '新增' : '编辑' }}</h3>
    </template>
    <template #default>
      <view class="sv-add">
        <el-form
          class="sv-el-form"
          ref="formRef"
          :model="formData"
          :rules="rules"
          label-width="80px"
          label-position="left"
        >
          <el-form-item prop="menu_id" label="菜单ID" required>
            <el-input v-model="formData.menu_id" placeholder="请输入菜单ID" clearable />
          </el-form-item>
          <el-form-item prop="name" label="菜单名称" required>
            <el-input v-model="formData.name" placeholder="请输入菜单名称" clearable />
          </el-form-item>
          <el-form-item prop="url" label="路径">
            <el-input v-model.trim="formData.url" placeholder="请输入菜单路径" clearable />
          </el-form-item>
          <el-form-item prop="parent_id" label="父级ID">
            <el-input
              class="sv-el-input"
              v-model="formData.parent_id"
              disabled
              placeholder="请输入父级ID"
              clearable
            />
          </el-form-item>
          <el-form-item prop="icon" label="图标">
            <sv-icon-select
              v-model="formData.icon"
              clearable
              @selected="selectedIcon"
            ></sv-icon-select>
            <view class="tips" @click="toUniIcons">如何使用自定义图标？</view>
          </el-form-item>
          <el-form-item prop="sort" label="序号">
            <el-input-number
              class="sv-el-input-number"
              v-model="formData.sort"
              :min="0"
              @change="changeSort"
            />
          </el-form-item>
          <el-form-item prop="permission" label="权限">
            <el-checkbox-group v-model="formData.permission">
              <el-checkbox v-for="item in permissionList" :key="item" :label="item.permission_id">
                {{ item.permission_name }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item prop="enable" label="状态">
            <el-switch
              v-model="formData.enable"
              inline-prompt
              :active-icon="Check"
              :inactive-icon="Close"
            />
          </el-form-item>
        </el-form>
      </view>
    </template>
    <template #footer>
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确认</el-button>
    </template>
  </el-drawer>
</template>

<script setup>
import { ref, watchEffect, computed } from 'vue'
import { Check, Close } from '@element-plus/icons-vue'
import adminConfig from '@/admin.config.js'
import { getPermissionFromCache } from '@/utils/sys'

const props = defineProps({
  formInit: {
    type: Object,
    default: {}
  },
  formMode: {
    type: String,
    default: 'add'
  }
})

const emits = defineEmits(['submit'])

// 表单数据
const formData = ref({})
// 初始数据
const formBase = {
  menu_id: '', // id
  name: '', // 名称
  url: '', // 路径
  parent_id: '', // 父级id
  icon: '', // 图标
  sort: 0, // 序号
  permission: [], // 权限
  enable: true // 是否启用
}

watchEffect(() => {
  // 表单数据初始化更新
  formData.value = Object.assign({ ...formBase }, props.formInit)
})

// 校验规则
const rules = ref({
  menu_id: [{ required: true, message: '请输入菜单ID', trigger: 'blur' }],
  name: [{ required: true, message: '请输入菜单名称', trigger: 'blur' }]
})

const drawerRef = ref() // 抽屉
const formRef = ref() // 表单

function openDrawer() {}

function closeDrawer() {}

// 关闭抽屉
function cancel() {
  drawerRef.value.handleClose()
}
// 确认提交表单
function confirm() {
  formRef.value.validate((valid, fields) => {
    if (valid) {
      emits('submit', { data: formData.value, mode: props.formMode })
      drawerRef.value.handleClose()
    } else {
      console.log('==== 校验失败 :', fields)
    }
  })
}
// 跳转图标外链
function toUniIcons() {
  // window.open('https://uniapp.dcloud.net.cn/uniCloud/admin.html#icon-图标')
  window.open(adminConfig.iconHelp.url)
}
// 选中图标
function selectedIcon(icon) {
  formData.value.icon = icon
}
// 改变序号
function changeSort(value) {
  formData.value.sort = value
}

// 权限列表
const permissionList = ref([])

async function handleCache() {
  permissionList.value = await getPermissionFromCache()
}
handleCache()
</script>

<style lang="scss">
.sv-add {
  width: 100%;
  height: 100%;
}

.tips {
  text-decoration: underline;
  cursor: pointer;
  color: $uni-color-primary;
  font-size: $uni-font-size-sm;
}
</style>
