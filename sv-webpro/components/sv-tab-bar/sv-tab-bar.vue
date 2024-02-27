<template>
  <view class="sv-tab-bar">
    <view
      v-for="item in tabbar"
      :key="item.path"
      :class="['tab-item', route.path == item.path ? 'jello-horizontal' : '']"
      :style="{ color: route.path == item.path ? item.activeColor : item.color }"
      @click="onTab(item)"
    >
      <view :class="['text-xxl', route.path == item.path ? item.activeIcon : item.icon]"></view>
      <view class="text-sm" v-if="item.name">
        {{ item.name }}
      </view>
    </view>
  </view>
  <!-- 占位 -->
  <view class="tabbar-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const props = defineProps({
  placeholder: {
    type: Boolean,
    default: false
  }
})

const tabbar = computed(() => {
  const routes = router.options.routes
  const tabRoutes = routes
    .filter((item) => item.meta?.tab)
    .sort((a, b) => a.meta.tab.index - b.meta.tab.index)
  const tabs = tabRoutes.map((item) => {
    return {
      name: item.name,
      path: item.path,
      ...item.meta.tab
    }
  })
  return tabs
})

function onTab(item) {
  if (item.path) router.push(item.path)
}
</script>

<style lang="scss">
$tab-bar-height: 50px;

.sv-tab-bar {
  width: 100%;
  height: $tab-bar-height;
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
  height: $tab-bar-height;
}
</style>
