<template>
  <sv-page>
    <view class="mine">
      <button @click="toSetting">设置</button>
    </view>
  </sv-page>
</template>

<script setup>
function toSetting() {
  uni.navigateTo({ url: '/pages/mine/setting/setting' })
}
</script>

<style lang="scss">
.mine {
  height: var(--page-nonav-height);
  border: 10px solid #3a5afb;
  box-sizing: border-box;
  color: var(--text-color);
}
</style>