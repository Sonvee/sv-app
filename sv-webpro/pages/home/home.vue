<template>
  <view class="page-home">
    <view class="header"></view>
    主页{{ num }}
    <button @click="add">+1</button>
    <view class="footer"></view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
import { testList } from '@/service/api/test'

const num = ref(123)
function add() {
  num.value++

  uni.showToast({
    title: '加一'
  })
}

onMounted(() => {
  console.log('==== onMounted home :')

  testList().then((res) => {
    console.log('==== testList :', res)
  })
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
  position: relative;

  .header {
    height: 100px;
    background-color: #66ccff;
  }

  .footer {
    width: 100%;
    height: 100px;
    background-color: #66ccff;
    position: absolute;
    bottom: 0;
  }
}
</style>
