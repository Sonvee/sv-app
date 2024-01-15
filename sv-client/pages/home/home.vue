<template>
  <sv-page showTabBar>
    <view class="home">home</view>
  </sv-page>
</template>

<script setup>
import { testList } from '../../service/api/test'

getTestList()
function getTestList() {
  testList().then((res) => {
    console.log('==== res :', res)
  })
}
</script>

<style lang="scss">
.home {
  height: var(--page-main-height);
  border: 10px solid #3a5afb;
  box-sizing: border-box;
}
</style>
