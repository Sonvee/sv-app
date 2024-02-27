<template>
  <view class="about page">关于</view>
</template>

<script setup>
import { onActivated, onDeactivated } from 'vue'

onActivated(() => {
  console.log('==== onActivated about :')
})

onDeactivated(() => {
  console.log('==== onDeactivated about :')
})
</script>

<style lang="scss">
.about {
  width: 100%;
  height: 100%;
}
</style>
