<template>
  <el-drawer
    v-bind="$attrs"
    ref="drawerRef"
    class="sv-el-drawer"
    size="84%"
    direction="ltr"
    :show-close="false"
    :with-header="false"
    :z-index="888"
  >
    <view class="header-placeholder"></view>
    <aside class="sv-side-bar">
      <view class="flex align-center">
        <el-avatar
          class="sv-el-avatar flex-shrink-0"
          v-if="authInfo?.avatar_file?.url"
          :src="authInfo?.avatar_file?.url"
          :size="50"
        />
        <view class="flex-col justify-evenly padding-left-sm" style="height: 50px">
          <view class="text-lg text-bold text-line-1">{{ authInfo.nickname }}</view>
          <view class="text-df text-italic text-line-1">{{ authInfo.comment }}</view>
        </view>
      </view>
      <view class="margin-top-sm" @click="loginOut">退出登录</view>
      <view class="margin-top-sm" @click="toSetting">设置</view>
    </aside>
    <view class="footer-placeholder"></view>
  </el-drawer>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const drawerRef = ref()
const authInfo = computed(() => getApp().$svIdPagesStore.store.userInfo)

function loginOut() {
  getApp().$svIdPagesStore.mutations.logout(() => {
    router.push('/uni_modules/sv-id-pages/pages/login/login-web')
  })
}

function toSetting() {
  drawerRef.value.handleClose()
  router.push('/pages/mine/setting')
}
</script>

<style lang="scss">
.sv-side-bar {
  padding: 20px;
  box-sizing: border-box;
}

.header-placeholder,
.footer-placeholder {
  height: $sv-nav-bar-height;
}
</style>
