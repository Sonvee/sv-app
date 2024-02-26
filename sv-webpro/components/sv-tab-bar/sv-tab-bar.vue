<template>
  <view class="sv-tab-bar flex">
    <view v-for="item in tabbar" :key="item.path" @click="onTab(item.path)">
      {{ item.name }}
    </view>
  </view>
  <view class="tabbar-placeholder" v-if="placeholder"></view>
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
const tabbar = router.options.routes.filter((item) => item.meta?.tab)

function onTab(path) {
  router.push(path)
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
    background-image: radial-gradient(transparent 1px, #{getTheme('sv-bg-color')} 1px);
  }
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px);
}
.tabbar-placeholder {
  height: $tab-bar-height;
}
</style>
