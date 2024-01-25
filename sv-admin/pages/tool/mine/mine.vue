<template>
  <view class="page-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="10">
        <view class="mine-row-1 card">
          <el-avatar class="sv-avatar" :src="authInfo?.avatar_file?.url" :size="86" shape="square" />
          <view class="content">
            <el-descriptions class="sv-el-descriptions" :column="2" size="small">
              <template #title>
                <el-text type="primary" size="large">
                  <el-icon><User /></el-icon>
                  {{ authInfo.username }} {{ getNowTimeName(true) }}~
                </el-text>
              </template>
              <template #extra>
                <el-button link size="small" :icon="RefreshRight" @click="refresh">刷新</el-button>
                <el-button link size="small" :icon="EditPen" @click="edit(authInfo)">编辑</el-button>
              </template>
              <el-descriptions-item label="昵称">
                {{ authInfo.nickname || '--' }}
              </el-descriptions-item>
              <el-descriptions-item label="身份">
                {{ authInfo.role?.toString() || '--' }}
              </el-descriptions-item>
              <el-descriptions-item label="IP地址">
                {{ authInfo.last_login_ip || '--' }}
              </el-descriptions-item>
              <el-descriptions-item label="登录时间">
                {{ timeFormat(authInfo.last_login_date) || '--' }}
              </el-descriptions-item>
            </el-descriptions>
          </view>
        </view>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="14">
        <view class="mine-row-1 card"></view>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <view class="mine-row-2 card"></view>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :span="8">
        <view class="mine-row-3 card"></view>
      </el-col>
      <el-col :span="8">
        <view class="mine-row-3 card"></view>
      </el-col>
      <el-col :span="8">
        <view class="mine-row-3 card"></view>
      </el-col>
    </el-row>
    <!-- 表单抽屉弹窗 -->
    <sv-form v-model="showForm" :form-init="formInit" @submit="submitForm"></sv-form>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getNowTimeName, timeFormat } from '@/utils/util'
import { User, RefreshRight, EditPen } from '@element-plus/icons-vue'
import SvForm from './components/sv-form/sv-form.vue'
import { userUpdate } from '@/service/api/svid'
import { ElNotification } from 'element-plus'

const authInfo = computed(() => getApp().$svIdPagesStore.store.userInfo)

function refresh() {
  handleCache()
}

const showForm = ref(false) // 显示表单
const formInit = ref({}) // 表单初始值

// 编辑
function edit(item) {
  // console.log('==== item :', item)
  formInit.value = item
  showForm.value = true
}

// 提交表单
async function submitForm(e) {
  let result = await userUpdate(e.data)
  if (result.success || result.errCode == 0) {
    ElNotification({
      title: 'Success',
      message: result?.message || 'Request Success',
      type: 'success'
    })

    await handleCache()
  } else {
    ElNotification({
      title: 'Error',
      message: result?.message || result?.error?.message,
      type: 'error'
    })
  }
}
</script>

<style lang="scss">
.page-container {
  .mine-row-1 {
    padding: 10px;
    display: flex;
    box-sizing: border-box;

    .sv-avatar {
      flex-shrink: 0;
      margin-right: 12px;
    }

    .content {
      flex-grow: 1;
      flex-shrink: 0;
    }
  }

  .mine-row-1 {
    height: 108px;
  }

  .mine-row-2 {
    height: 200px;
  }

  .mine-row-3,
  .mine-row-3,
  .mine-row-3 {
    height: 500px;
  }
}

.el-col {
  margin-bottom: 10px;
}

// 移动端隐藏头像
@media screen and (max-width: 768px) {
  .sv-avatar {
    display: none !important;
  }
}
</style>
