<template>
  <view class="home page">
    <el-backtop :right="30" :bottom="80" />
    <view class="header-image">
      <!-- <image
        class="width-height-full"
        src="../../static/images/kesuen-room.gif"
        mode="aspectFill"
      ></image> -->
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
import { testList } from '@/service/api/test'

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
.home {
  width: 100%;
  height: 2000px;
  position: relative;

  .header-image {
    width: 100%;
    height: 80vh;
    border: 1px solid #66ccff;
  }
}
</style>
