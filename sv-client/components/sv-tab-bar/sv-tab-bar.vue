<template>
  <view class="sv-tab-bar">
    <uv-tabbar
      :value="tabIndex"
      fixed
      placeholder
      :activeColor="activeColor"
      :inactiveColor="inactiveColor"
      :border="false"
      :customStyle="{ background: bgColor, backdropFilter: 'blur(12px) brightness(120%)' }"
      @change="changeTab"
    >
      <uv-tabbar-item v-for="(item, index) in tabBarList" :key="index" :text="item.text">
        <!-- 未选中图标 -->
        <template #inactive-icon>
          <text
            class="tab-icon"
            v-if="item.iconfont"
            :class="item.iconfont"
            :style="{ color: inactiveColor }"
          ></text>
          <image v-else class="tab-icon" :src="item.iconPath"></image>
        </template>
        <!-- 已选中图标 -->
        <template #active-icon>
          <text
            class="tab-icon jello-horizontal"
            v-if="item.selectedIconfont || item.iconfont"
            :class="item.selectedIconfont || item.iconfont"
            :style="{ color: activeColor }"
          ></text>
          <image v-else class="tab-icon jello-horizontal" :src="item.selectedIconPath"></image>
        </template>
      </uv-tabbar-item>
    </uv-tabbar>
  </view>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useSysStore } from '@/store/sys'

const props = defineProps({
  bgColor: {
    type: String,
    default: 'transparent'
  },
  activeColor: {
    type: String,
    default: '#3A5AFB'
  },
  inactiveColor: {
    type: String,
    default: '#66ccff'
  }
})

// 当前tab页索引
const tabIndex = computed({
  set(newIndex) {
    useSysStore().setConfig({ curTabIndex: newIndex })
  },
  get() {
    return useSysStore().getConfig().curTabIndex
  }
})

/**
 * 导航栏数据 - 尽量保持和官方tabbar数据结构一致
 * {
 *   pagePath: '/pages/index/index',
 *   text: '首页',
 *   iconfont: 'cuIcon-home', // 优先级高于iconPath
 *   selectedIconfont: 'cuIcon-homefill'
 *   iconPath: '', // 图片路径
 *   selectedIconPath: '',
 * }
 */
const tabBarList = [
  {
    pagePath: '/pages/index/index',
    text: '首页',
    iconfont: 'cuIcon-home',
    selectedIconfont: 'cuIcon-homefill'
  },
  {
    pagePath: '/pages/hall/hall',
    text: '大厅',
    iconfont: 'cuIcon-shop',
    selectedIconfont: 'cuIcon-shopfill'
  },
  {
    pagePath: '/pages/home/home',
    text: '主页',
    iconfont: 'cuIcon-form',
    selectedIconfont: 'cuIcon-formfill'
  },
  {
    pagePath: '/pages/mine/mine',
    text: '我的',
    iconfont: 'cuIcon-my',
    selectedIconfont: 'cuIcon-myfill'
  }
]

function changeTab(index) {
  tabIndex.value = index
  const curTab = tabBarList[index]
  uni.switchTab({ url: curTab.pagePath })
}
</script>

<style lang="scss">
.sv-tab-bar {
  .tab-icon {
    width: 40rpx;
    height: 40rpx;
    font-size: 40rpx;
  }
}
</style>
