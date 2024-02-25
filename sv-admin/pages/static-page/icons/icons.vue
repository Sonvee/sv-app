<template>
  <view class="page-container static-icons-page">
    <view class="icons-page-container">
      <sv-icon-list class="sv-icon-list" :colnum="colnum"></sv-icon-list>
    </view>
    <view class="help card" @click="toHelp">如何使用自定义图标</view>
  </view>
</template>

<script setup>
import { computed } from 'vue'
import SvIconList from '@/components/sv-icon-select/sv-icon-list.vue'
import adminConfig from '@/admin.config.js'

const colnum = computed(() => {
  return uni.getSystemInfoSync().windowWidth > 600 ? 7 : 3
})

function toHelp() {
  window.open(adminConfig.iconHelp.url)
}
</script>

<style lang="scss">
.static-icons-page {
  display: flex;

  .icons-page-container {
    flex-grow: 1;
    overflow: auto;
  }

  .help {
    position: absolute;
    bottom: 30px;
    right: 30px;
    padding: 6px 10px;
    border-radius: 6px;
    font-size: 12px;
    cursor: pointer;
    color: $uni-color-primary;
  }
  .help:active {
    color: $uni-color-success;
  }
}
</style>
