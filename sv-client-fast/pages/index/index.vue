<template>
  <view class="index">
    首页
    <text class="sv-icons-github"></text>
    {{ now }}
    <button class="cu-btn round bg-red shadow">按钮</button>
  </view>
</template>

<script setup>
import dayjs from 'dayjs'

import { testList } from '../../service/api/test'
const now = dayjs().format('YYYY-MM-DD HH:mm:ss')

testList().then((res) => {
  console.log('==== res :', res)
})
</script>

<style lang="scss">
.index {
  height: 100%;
  border: 10px solid #66ccff;
}
</style>
