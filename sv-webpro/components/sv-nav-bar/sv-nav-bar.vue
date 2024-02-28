<template>
  <view class="sv-nav-bar">
    <!-- 移动端 -->
    <template v-if="sysStore.platform == 'mobile'">
      <text
        class="text-xl padding-sm cursor-pointer"
        :class="[isShowSideBar ? 'uni-icons-settings' : 'uni-icons-list']"
        @click="toggleSideBar"
      ></text>
      <view class="sv-text-streamer text-xl text-bold">标题</view>
      <text
        class="text-xl padding-sm cursor-pointer"
        :class="[sysStore.themes == 'light' ? 'sv-icons-sun' : 'sv-icons-moon']"
        @click="toggleTheme"
      ></text>
    </template>
    <!-- pc端 -->
    <template v-else>
      <!-- 左侧标题栏 -->
      <view class="sv-text-streamer text-xl text-bold padding-sm cursor-pointer" @click="toHome">
        标题
      </view>
      <!-- 中心导航栏 -->
      <view>123</view>
      <!-- 右侧控制栏 -->
      <view class="flex align-center height-full">
        <view class="sv-menu-icon" @click="docUrl">
          <el-tooltip effect="light" content="文档地址" placement="bottom">
            <view class="sv-icons-github icon-btn"></view>
          </el-tooltip>
        </view>
        <view class="sv-menu-icon">
          <el-dropdown @command="changeTheme">
            <view class="sv-icons-skin icon-btn"></view>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in webproConfig.navBar.themes"
                  :key="item.value"
                  :command="item.value"
                >
                  {{ item.text }}
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </view>
        <view class="sv-menu-icon" @click="fullScreen">
          <el-tooltip effect="light" content="全屏" placement="bottom">
            <view class="sv-icons-fullscreen icon-btn"></view>
          </el-tooltip>
        </view>
        <!-- 个人中心 -->
        <view class="sv-menu-item">
          <el-dropdown trigger="click" placement="bottom-end" @command="handleCommand">
            <span class="flex-vc">
              <el-avatar
                class="sv-el-avatar"
                v-if="authInfo?.avatar_file?.url"
                :src="authInfo?.avatar_file?.url"
                :size="36"
              />
              <view class="authname padding-left-sm">{{ authInfo?.nickname }}</view>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="mine">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </view>
      </view>
    </template>
  </view>
  <!-- 占位 -->
  <view class="header-placeholder" v-if="placeholder"></view>
</template>

<script setup>
import { computed, inject } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useSysStore } from '@/store/sys'
import { changeTheme } from '@/utils/sys'
import webproConfig from '@/webpro.config.js'
import { useFullscreen } from '@vueuse/core'
import { clearPiniaStorage } from '@/utils/pinia-storage'

const props = defineProps({
  placeholder: {
    type: Boolean,
    default: false
  }
})

const router = useRouter()
const route = useRoute()
const sysStore = useSysStore()
const isShowSideBar = inject('e-show-side-bar')
const authInfo = computed(() => getApp().$svIdPagesStore.store.userInfo)
console.log('====  authInfo:', authInfo.value)

function toggleSideBar() {
  isShowSideBar.value = !isShowSideBar.value
}

function toggleTheme() {
  const curTheme = sysStore.getThemes() == 'light' ? 'dark' : 'light'
  changeTheme(curTheme)
}

const navbar = computed(() => {
  const routes = router.options.routes
  const navRoutes = routes
    .filter((item) => item.meta?.nav)
    .sort((a, b) => a.meta.nav.index - b.meta.nav.index)
  const navs = navRoutes.map((item) => {
    return {
      name: item.name,
      path: item.path,
      ...item.meta.nav
    }
  })
  return navs
})

function onNav(item) {
  // 若已是当前路由，则不再重复跳转
  if (item.path == route.path) return
  if (item.path) router.push(item.path)
}

function toHome() {
  router.push('/pages/home/home')
}

function docUrl() {
  window.open('https://gitee.com/Sonve/sv-app')
}

const { toggle } = useFullscreen()
function fullScreen() {
  // 切换全屏
  toggle()
}

// 个人中心菜单
function handleCommand(command) {
  switch (command) {
    case 'mine':
      break
    case 'logout':
      // 清除缓存
      clearPiniaStorage()
      getApp().$svIdPagesStore.mutations.logout()
      break
  }
}
</script>

<style lang="scss">
.sv-nav-bar {
  width: 100%;
  height: $sv-nav-bar-height;
  position: fixed;
  top: 0;
  z-index: 999;

  display: flex;
  align-items: center;
  padding: 0 10px;
  justify-content: space-between;

  @include useTheme {
    border-bottom: 1px solid #{getTheme('sv-border-color')};
    background-image: radial-gradient(transparent 1px, #{getTheme('sv-bg-color')} 4px);
    background-color: #{getTheme('sv-bg-color') + 'aa'};
  }
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  -webkit-backdrop-filter: saturate(50%) blur(4px);

  // pc端导航栏右侧控制相关
  .sv-menu-item,
  .sv-menu-icon {
    height: 100%;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    cursor: pointer;
    flex-shrink: 0;

    &:hover {
      @include useTheme {
        background-color: getTheme('sv-hover-color');
      }
    }
    .authname {
      max-width: 160px;
      @include useTheme {
        color: getTheme('sv-text-color');
      }
    }
  }

  .sv-menu-item {
    padding: 0 10px;
  }

  .sv-menu-icon {
    width: 36px;
    display: flex;
    justify-content: center;
    align-items: center;

    .icon-btn {
      font-size: 20px;
      @include useTheme {
        // 拼接上些许透明效果
        color: #{getTheme('sv-text-color') + 'dd'};
      }
    }

    &:hover {
      .icon-btn {
        transition: transform 0.3s;
        transform: scale(1.2);
        @include useTheme {
          color: getTheme('sv-text-color');
        }
      }
    }
  }
}

.header-placeholder {
  height: $sv-nav-bar-height;
}
</style>