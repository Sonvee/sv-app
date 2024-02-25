<template>
  <view class="index">
    <sv-nav-bar></sv-nav-bar>
    <view class="index-body">
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <keep-alive :include="['about']">
            <component :is="Component" />
          </keep-alive>
        </transition>
      </router-view>
    </view>
  </view>
</template>

<script setup>
import { watchEffect } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

console.log('==== router :', router)
</script>

<style lang="scss">
.index {
  width: 100%;
  height: 100%;

  .index-body {
    width: 100%;
    height: 100%;
  }
}
</style>
