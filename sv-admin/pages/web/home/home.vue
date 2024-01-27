<template>
  <view>
    主页
    <button @click="next">下一页</button>
  </view>
</template>

<script setup>
function next() {
  uni.navigateTo({
    url: '/pages/web/mine/mine'
  })
}
</script>

<style lang="scss"></style>
