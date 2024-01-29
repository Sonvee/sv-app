<template>
  <view class="page-container">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="12" :xl="10">
        <view class="mine-row-1 card">
          <el-avatar
            class="sv-el-avatar"
            :src="authInfo?.avatar_file?.url"
            :size="86"
            shape="square"
          />
          <view class="content">
            <el-descriptions class="sv-el-descriptions" :column="2" size="small">
              <template #title>
                <el-text type="primary" size="large">
                  <el-icon><User /></el-icon>
                  {{ authInfo.username }} {{ getNowTimeName(true) }}~
                </el-text>
              </template>
              <template #extra>
                <el-button link size="small" :icon="EditPen" @click="edit(authInfo)">
                  编辑
                </el-button>
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
import { User, EditPen } from '@element-plus/icons-vue'
import SvForm from './components/sv-form/sv-form.vue'

const authInfo = computed(() => getApp().$svIdPagesStore.store.userInfo)

const showForm = ref(false) // 显示表单
const formInit = ref({}) // 表单初始值

// 编辑
function edit(item) {
  formInit.value = item
  showForm.value = true
}

// 提交表单
function submitForm(e) {
  let updateParams = {}
  // 判断当前用户是否是admin
  const { role } = uniCloud.getCurrentUserInfo()
  if (role.includes('admin')) {
    updateParams = e.data
  } else {
    const { nickname, avatar_file, gender } = e.data
    updateParams = { nickname, avatar_file, gender }
  }
  getApp().$svIdPagesStore.mutations.updateUserInfo(updateParams)
}
</script>

<style lang="scss">
.page-container {
  .mine-row-1 {
    padding: 10px;
    display: flex;
    box-sizing: border-box;

    .content {
      flex-grow: 1;
      flex-shrink: 0;
      margin-left: 12px;
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
