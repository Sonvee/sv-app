<template>
  <view class="sv-nav-bar flex align-center padding">
    <text class="sv-icons-portal margin-right" @click="toggleSideBar"></text>
    <view v-for="item in tabbar" :key="item.path" @click="onNav(item.path)">
      {{ item.name }}
    </view>
  </view>
  <view class="header-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { inject } from 'vue'
import { useRouter } from 'vue-router'

const props = defineProps({
  placeholder: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const tabbar = router.options.routes.filter((item) => item.meta?.tab)

function onNav(path) {
  router.push(path)
}

const isShowSideBar = inject('e-show-side-bar')
function toggleSideBar() {
  isShowSideBar.value = !isShowSideBar.value
}
</script>

<style lang="scss">
.sv-nav-bar {
  width: 100%;
  height: $sv-nav-bar-height;
  position: fixed;
  top: 0;
  z-index: 999;

  @include useTheme {
    border-bottom: 1px solid #{getTheme('sv-border-color')};
    background-image: radial-gradient(transparent 1px, #{getTheme('sv-bg-color')} 1px);
  }
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px);
}

.header-placeholder {
  height: $sv-nav-bar-height;
}
</style>
