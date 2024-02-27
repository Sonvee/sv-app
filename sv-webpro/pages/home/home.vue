<template>
  <view class="home page">
    <el-backtop :right="30" :bottom="80" />
    <view class="header-image">
      <image
        class="width-height-full"
        src="../../static/images/kesuen-room.gif"
        mode="aspectFill"
      ></image>
    </view>
  </view>
</template>

<script setup>
import { ref, onMounted, onUnmounted, onActivated, onDeactivated } from 'vue'
import { testList } from '@/service/api/test'
import { changeTheme } from '../../utils/sys'

const num = ref(123)
const theme = ref('light')
function add() {
  num.value++
  theme.value = theme.value == 'light' ? 'dark' : 'light'
  changeTheme(theme.value)
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
.home {
  width: 100%;
  height: 2000px;
  position: relative;

  .header-image {
    width: 100%;
    height: 80vh;
  }
}
</style>
