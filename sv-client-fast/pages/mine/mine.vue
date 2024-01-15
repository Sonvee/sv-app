<template>
  <view class="mine">
    <button @click="toSetting">设置</button>
    <button @click="toLogin">登录</button>
    <button @click="toMine">个人中心</button>
  </view>
</template>

<script setup>
function toSetting() {
  uni.navigateTo({
    url: '/pages/mine/setting/setting'
  })
}

function toLogin() {
  uni.navigateTo({
    url: '/uni_modules/sv-id-pages/pages/login/login'
  })
}

function toMine() {
  uni.navigateTo({
    url: '/uni_modules/sv-id-pages/pages/userinfo/userinfo'
  })
}
</script>

<style lang="scss">
.mine {
}
</style>
