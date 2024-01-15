<template>
  <view class="index">
    首页
    <text class="sv-icons-github"></text>
    <uv-button type="primary" text="月落"></uv-button>
    {{ now }}
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
