<template>
  <view class="page-home">
    <view class="header"></view>
    主页{{ num }}
    <button @click="add">+1</button>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'

const num = ref(123)
function add() {
  num.value++

  uni.showToast({
    title: '加一'
  })
}

onMounted(() => {
  console.log('==== onMounted home :')
})

onActivated(() => {
  console.log('==== onActivated home :')
})

onDeactivated(() => {
  console.log('==== onDeactivated home :')
})

onUnmounted(() => {
  console.log('==== onUnmounted home :')
})
</script>

<style lang="scss">
.page-home {
  width: 100%;
  height: 1000px;

  .header {
    height: 100px;
    background-color: #66ccff;
  }
}
</style>
