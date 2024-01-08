<template>
  <view class="sv-tn-tabbar">
    <tn-tabbar
      :model-value="currentTabbar"
      :fixed="tabOpt.fixed"
      :frosted="tabOpt.frosted"
      :placeholder="tabOpt.placeholder"
      :icon-size="tabOpt.iconSize"
      :font-size="tabOpt.fontSize"
      :top-shadow="tabOpt.topShadow"
      :switch-animation="tabOpt.switchAnimation"
      :z-index="tabOpt.zIndex"
      :before-switch="beforeSwitch"
      @change="changeTabber"
    >
      <tn-tabbar-item
        v-for="(item, index) in tabBarList"
        :key="index"
        :icon="item.iconPath"
        :active-icon="item.selectedIconPath"
        :text="item.text"
        :name="item.pagePath"
        :bulge="item.bulge"
      />
    </tn-tabbar>
  </view>
</template>

<script setup>
import { computed, ref, watchEffect } from 'vue'
import { useSysStore } from '@/store/sys'

const props = defineProps({
  options: {
    type: Object,
    default: () => {}
  }
})

// 导航栏数据
const tabBarList = [
  {
    text: '首页',
    iconPath: 'home',
    selectedIconPath: 'home-fill',
    pagePath: '/pages/index/index'
  },
  {
    text: '主页',
    iconPath: 'home',
    selectedIconPath: 'home-fill',
    pagePath: '/pages/home/home',
    bulge: true
  },
  {
    text: '我的',
    iconPath: 'my',
    selectedIconPath: 'my-fill',
    pagePath: '/pages/mine/mine'
  }
]

// 配色方案跟随主题，此处不进行设置
const defaultOpt = {
  fixed: true,
  placeholder: true,
  frosted: true,
  border: false,
  topShadow: true,
  iconSize: '20px',
  fontSize: '12px',
  switchAnimation: true,
  zIndex: 996
}

const tabOpt = computed(() => {
  return Object.assign({ ...defaultOpt }, props.options)
})

function beforeSwitch() {
  return new Promise((resolve) => {
    resolve(true)
  })
}

const sysStore = useSysStore()

const currentTabbar = ref(sysStore.getConfig().curTabbarRoute)

function changeTabber(url) {
  currentTabbar.value = url
  sysStore.setConfig({
    curTabbarRoute: url
  })
  uni.switchTab({ url })
}

function handleCurPageRoute() {
  const pages = getCurrentPages()
  const page = pages[pages.length - 1]
  // 需带上'/'前缀
  return '/' + page.route
}

watchEffect(() => {
  const curPage = sysStore.getConfig().curTabbarRoute
  // 若pinia中还未存储响应式curTabbarRoute，则需要先取当前路由进行初始化
  if (!curPage) sysStore.setConfig({ curTabbarRoute: handleCurPageRoute() })
  currentTabbar.value = curPage || handleCurPageRoute()
})
</script>

<style lang="scss"></style>
