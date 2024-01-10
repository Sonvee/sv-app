<template>
  <sv-page>
    <view class="mine">
      <button @click="toSetting">设置</button>
      <button @click="toLogin">登录</button>
    </view>
  </sv-page>
</template>

<script setup>
import { mutations } from '@/uni_modules/sv-id-pages/common/store'
function toSetting() {
  uni.navigateTo({ url: '/pages/mine/setting/setting' })
}

function toLogin() {
  mutations.logout()
}
</script>

<style lang="scss">
.mine {
  height: var(--page-height);
  border: 10px solid #3a5afb;
  box-sizing: border-box;
  color: var(--text-color);
}
</style>
