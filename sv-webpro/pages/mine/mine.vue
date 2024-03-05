<template>
  <view class="mine page flex-col align-center justify-center">
    我的
    <button @click="toLogin">退出登录</button>
  </view>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function toLogin() {
  getApp().$svIdPagesStore.mutations.logout(() => {
    router.push('/uni_modules/sv-id-pages/pages/login/login-web')
  })
}
</script>

<style lang="scss">
.mine {
  width: 100%;
  height: 100%;
}
</style>
