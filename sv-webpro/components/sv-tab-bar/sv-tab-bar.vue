<template>
  <nav class="sv-tab-bar">
    <view
      v-for="item in tabbar"
      :key="item.path"
      :class="['tab-item', route.path == item.path ? 'jello-horizontal' : '']"
      :style="{
        color: route.path == item.path ? item.meta.tabbar.activeColor : item.meta.tabbar.color
      }"
      @click="onTab(item)"
    >
      <view
        :class="[
          'text-xxl',
          route.path == item.path ? item.meta.tabbar.activeIcon : item.meta.tabbar.icon
        ]"
      ></view>
      <view class="text-sm" v-if="item.name">
        {{ item.name }}
      </view>
    </view>
  </nav>
  <!-- 占位 -->
  <view class="tabbar-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSysStore } from '../../store/sys'
import { handleTabbar } from '../../utils/sys'

const router = useRouter()
const route = useRoute()
const sysStore = useSysStore()

const props = defineProps({
  placeholder: {
    type: Boolean,
    default: false
  }
})

const tabbar = computed(() => {
  const sysRoutes = sysStore.getSysRoutes()
  const tabs = handleTabbar(sysRoutes)
  return tabs
})
console.log('==== tabbar :', tabbar.value)

function onTab(item) {
  // 若已是当前路由，则不再重复跳转
  if (item.path == route.path) return
  if (item.path) router.push(item.path)
}
</script>

<style lang="scss">
.sv-tab-bar {
  width: 100%;
  height: $sv-tab-bar-height;
  position: fixed;
  bottom: 0;
  z-index: 999;

  @include useTheme {
    border-top: 1px solid #{getTheme('sv-border-color')};
    background-color: #{getTheme('sv-bg-color') + '66'};
  }
  backdrop-filter: blur(8px) brightness(110%);

  display: flex;
  align-items: camera;
  justify-content: space-around;

  .tab-item {
    height: 100%;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    cursor: pointer;
  }
}

.tabbar-placeholder {
  height: $sv-tab-bar-height;
}
</style>
