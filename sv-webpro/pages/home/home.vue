<template>
  <view class="home page">
    <view class="header"></view>
    主页{{ num }}
    <button @click="add">+1</button>
    <view class="footer">
      <view v-for="item in 5">页脚页脚页脚页脚页脚页脚页脚页脚页脚页脚页脚页脚页脚</view>
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
  height: 1000px;
  position: relative;

  .header {
    height: 100px;
    background-color: #cccccc;
  }

  .footer {
    width: 100%;
    background-color: #cccccc;
    position: absolute;
    bottom: 0;
  }
}
</style>
