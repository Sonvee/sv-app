<template>
  <el-drawer
    v-bind="$attrs"
    ref="drawerRef"
    class="sv-el-drawer"
    size="84%"
    direction="ltr"
    :show-close="false"
    :with-header="false"
    :z-index="888"
  >
    <view class="header-placeholder"></view>
    <aside class="sv-side-bar">
      <view class="flex align-center sv-press" v-if="hasLogin" @click="onUser">
        <el-avatar
          class="flex-shrink-0"
          :src="authInfo?.avatar_file?.url"
          :icon="UserFilled"
          :size="50"
        />
        <view class="flex-col justify-evenly padding-left" style="height: 50px">
          <view class="text-lg sv-text-streamer text-bold text-line-1">
            {{ authInfo.nickname }}
          </view>
          <view class="text-df text-grey text-italic text-line-1">{{ authInfo.comment }}</view>
        </view>
      </view>
      <view class="flex align-center sv-press" v-else @click="toLogin">
        <el-avatar class="flex-shrink-0" :icon="UserFilled" :size="50" />
        <view class="flex-col justify-evenly padding-left text-lg text-bold">登录</view>
      </view>
      <view class="margin-top" @click="toSetting">设置</view>
    </aside>
    <view class="footer-placeholder"></view>
  </el-drawer>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { UserFilled } from '@element-plus/icons-vue'

const router = useRouter()
const route = useRoute()
const drawerRef = ref()
const authInfo = computed(() => getApp().$svIdPagesStore.store.userInfo)
const hasLogin = computed(() => getApp().$svIdPagesStore.store.hasLogin)

function toLogin() {
  getApp().$svIdPagesStore.mutations.logout(() => {
    router.push('/uni_modules/sv-id-pages/pages/login/login-web')
  })
}

function onUser() {
  drawerRef.value.handleClose()
  if (route.path == '/pages/mine/mine') return // 不重复跳转
  router.push('/pages/mine/mine')
}

function toSetting() {
  drawerRef.value.handleClose()
  router.push('/pages/mine/setting')
}
</script>

<style lang="scss">
.sv-side-bar {
  padding: 20px;
  box-sizing: border-box;
}

.header-placeholder,
.footer-placeholder {
  height: $sv-nav-bar-height;
}

.sv-press {
  transition: all 0.2s ease;
  cursor: pointer;
  &:active {
    transform: scale(0.94);
    transform-origin: left center;
    opacity: 0.86;
    text-shadow: 0 0 2px #66ccff;
  }
}
</style>
