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
    <view class="sv-side-bar">
      <view @click="loginOut">退出登录</view>
    </view>
    <view class="footer-placeholder"></view>
  </el-drawer>
</template>

<script setup>
function loginOut() {
  getApp().$svIdPagesStore.mutations.logout()
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
