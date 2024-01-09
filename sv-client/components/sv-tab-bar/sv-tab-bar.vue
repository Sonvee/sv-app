<template>
  <view class="sv-tab-bar">
    <uv-tabbar
      :value="tabIndex"
      fixed
      placeholder
      activeColor="#3A5AFB"
      inactiveColor="#66ccff"
      :border="false"
      :customStyle="{ background: bgColor, backdropFilter: 'blur(8px) brightness(110%)' }"
      @change="changeTab"
    >
      <uv-tabbar-item v-for="(item, index) in tabBarList" :key="index" :text="item.text">
        <!-- 未选中图标 -->
        <template #inactive-icon>
          <image class="tab-icon" :src="item.iconPath"></image>
        </template>
        <!-- 已选中图标 -->
        <template #active-icon>
          <image class="tab-icon" :src="item.selectedIconPath"></image>
        </template>
      </uv-tabbar-item>
    </uv-tabbar>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSysStore } from '@/store/sys'

const props = defineProps({
  bgColor: {
    type: String,
    default: 'transparent'
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

// 导航栏数据 - 保持和官方tabbar数据结构一致
const tabBarList = [
  {
    pagePath: '/pages/index/index',
    text: '首页',
    iconPath: '/static/icons/home.png',
    selectedIconPath: '/static/icons/home-fill.png'
  },
  {
    pagePath: '/pages/home/home',
    text: '主页',
    iconPath: '/static/icons/home.png',
    selectedIconPath: '/static/icons/home-fill.png'
  },
  {
    pagePath: '/pages/mine/mine',
    text: '我的',
    iconPath: '/static/icons/mine.png',
    selectedIconPath: '/static/icons/mine-fill.png'
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
  }
}
</style>
