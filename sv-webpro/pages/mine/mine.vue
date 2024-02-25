<template>
  <view>我的</view>
</template>

<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('==== onActivated mine :')
})

onDeactivated(() => {
  console.log('==== onDeactivated mine :')
})
</script>

<style></style>
