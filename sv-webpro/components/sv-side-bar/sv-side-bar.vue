<template>
  <el-drawer
    v-bind="$attrs"
    class="sv-el-drawer"
    size="80%"
    direction="ltr"
    :show-close="false"
    :with-header="false"
    :z-index="888"
  >
    <view class="header-placeholder"></view>
    <view class="sv-side-bar">
      侧边栏内容
    </view>
    <view class="footer-placeholder"></view>
  </el-drawer>
</template>

<script setup></script>

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
