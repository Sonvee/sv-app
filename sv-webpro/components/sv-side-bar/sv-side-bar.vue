<template>
  <el-drawer
    v-bind="$attrs"
    class="sv-el-drawer"
    size="84%"
    direction="ltr"
    :show-close="false"
    :with-header="false"
    :z-index="888"
  >
    <view class="header-placeholder"></view>
    <aside class="sv-side-bar">
      <view @click="loginOut">退出登录</view>
      <view @click="toSetting">设置</view>
    </aside>
    <view class="footer-placeholder"></view>
  </el-drawer>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function loginOut() {
  getApp().$svIdPagesStore.mutations.logout(() => {
    router.push('/uni_modules/sv-id-pages/pages/login/login-web')
  })
}

function toSetting() {
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
