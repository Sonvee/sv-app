<template>
  <view class="layout-nav-bar">
    <view class="sv-nav">
      <nav-logo></nav-logo>
      <el-menu class="sv-el-menu" mode="horizontal" :ellipsis="false">
        <!-- 历史记录 -->
        <nav-history ref="historyRef"></nav-history>

        <!-- 移动端菜单列表按钮 -->
        <nav-btn-menu></nav-btn-menu>

        <!-- 占位 -->
        <view class="flex-grow"></view>

        <!-- 工具栏 -->
        <view class="sv-menu-search">
          <nav-search :show="showSearch" ref="searchRef"></nav-search>
          <view class="sv-menu-icon" @click="globalSearch">
            <el-tooltip effect="light" content="全局搜索" placement="bottom">
              <view class="uni-icons-search icon-btn"></view>
            </el-tooltip>
          </view>
        </view>
        <view class="sv-menu-icon" @click="docUrl">
          <el-tooltip effect="light" content="文档地址" placement="bottom">
            <view class="sv-icons-github icon-btn"></view>
          </el-tooltip>
        </view>
        <view class="sv-menu-icon">
          <el-dropdown @command="handleTheme">
            <view class="sv-icons-skin icon-btn"></view>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="item in adminConfig.navBar.themes"
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
              <view class="authname">{{ authInfo?.nickname }}</view>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="mine">个人中心</el-dropdown-item>
                <el-dropdown-item command="logout" divided>退出登录</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </view>
      </el-menu>
    </view>
  </view>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import NavLogo from './components/nav-logo/nav-logo.vue'
import NavHistory from './components/nav-history/nav-history.vue'
import NavSearch from './components/nav-search/nav-search.vue'
import NavBtnMenu from './components/nav-btn-menu/nav-btn-menu.vue'
import { clearPiniaStorage } from '@/utils/pinia-storage'
import { useFullscreen } from '@vueuse/core'
import { changeTheme } from '@/utils/sys'
import adminConfig from '@/admin.config.js'

// 注意：topWindow和leftWindow等的生命周期在app渲染之前，需要注意相关写法

const historyRef = ref()
const searchRef = ref()

function handleCommand(command) {
  switch (command) {
    case 'mine':
      uni.navigateTo({
        url: '/pages/tool/mine/mine'
      })
      break
    case 'logout':
      // 清除缓存
      clearPiniaStorage()
      getApp().$svIdPagesStore.mutations.logout()
      break
  }
}

const authInfo = computed(() => getApp().$svIdPagesStore.store.userInfo)

// 监听登录成功后，刷新用户信息
uni.$on('uni-id-pages-login-success', (e) => {
  historyRef.value.handleHistory()
})

// 登录成功时才会进行初始化
onMounted(() => {
  if (getApp().$svIdPagesStore.store.hasLogin) {
    historyRef.value.handleHistory()
  }
})

function handleTheme(command) {
  changeTheme(command)
}

const { toggle } = useFullscreen()
function fullScreen() {
  // 切换全屏
  toggle()
}

function docUrl() {
  window.open('https://gitee.com/Sonweir/sv-admin')
}

const showSearch = ref(false)
function globalSearch() {
  showSearch.value = !showSearch.value
  if (showSearch.value) {
    searchRef.value.handleMenuNode()
  }
}
</script>

<style lang="scss">
.layout-nav-bar {
  height: $sv-nav-bar-height;
  width: 100%;
  box-sizing: border-box;
  @include useTheme {
    background-color: getTheme('sv-bg-color');
  }

  .sv-nav {
    height: 100%;
    display: flex;
    align-items: center;

    .sv-el-menu {
      width: 100%;
      display: flex;
      align-items: center;

      .sv-menu-search,
      .sv-menu-item,
      .sv-menu-icon {
        height: 100%;
        box-sizing: border-box;
        display: flex;
        align-items: center;
        cursor: pointer;
        flex-shrink: 0;
      }

      .sv-menu-item,
      .sv-menu-icon {
        &:hover {
          @include useTheme {
            background-color: getTheme('sv-hover-color');
          }
        }

        .authname {
          padding-left: 10px;
          max-width: 160px;
          @include useTheme {
            color: getTheme('sv-text-color');
          }
        }
      }

      .sv-menu-item {
        padding: 0 20px;
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

      .flex-grow {
        flex-grow: 1;
      }
    }
  }
}

// 移动端隐藏搜索
@media screen and (max-width: 854px) {
  .sv-menu-search {
    display: none !important;
  }
}
</style>
