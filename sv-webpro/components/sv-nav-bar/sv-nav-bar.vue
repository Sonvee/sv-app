<template>
  <view class="sv-nav-bar">
    <view class="dl" @click="toHome">首页</view>
    <view class="dl" @click="toAbout">关于</view>
    <view class="dl" @click="toMine">我的</view>
    <view class="dl" @click="tologin">登录</view>
  </view>
  <view class="navbar-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { useRouter } from 'vue-router'

const props = defineProps({
  placeholder: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
function toHome() {
  router.push('/pages/home/home')
}

function toAbout() {
  router.push('/pages/about/about')
}

function toMine() {
  router.push('/pages/mine/mine')
}

function tologin() {
  router.push('/uni_modules/sv-id-pages/pages/login/login-admin')
}
</script>

<style lang="scss">
.sv-nav-bar {
  width: 100%;
  height: 50px;
  position: fixed;
  top: 0;
  z-index: 999;
  border: 1px solid;
  display: flex;
}
.navbar-placeholder {
  height: 50px;
}
</style>
