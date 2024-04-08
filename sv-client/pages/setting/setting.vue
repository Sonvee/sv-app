<template>
  <sv-page>
    <view class="setting">
      <view class="sv-uni-list">
        <uni-list>
          <uni-list-item title="账号与安全" link @click="onSecurity"></uni-list-item>
        </uni-list>
      </view>
      <view class="sv-uni-list margin-top-sm">
        <uni-list>
          <view class="list-title">系统</view>
          <uni-list-item title="主题切换" link @click="toggleTheme">
            <template #footer>
              <text
                class="text-xl"
                :class="[sysStore.themes == 'light' ? 'sv-icons-sun' : 'sv-icons-moon']"
              ></text>
            </template>
          </uni-list-item>
        </uni-list>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import { judgeLogin } from '@/utils/util'
import { useSysStore } from '@/store/sys'
import { changeTheme } from '@/utils/sys'

function onSecurity() {
  // 判断登录
  const isLogin = judgeLogin()
  // 未登录不予操作
  if (!isLogin) return

  uni.navigateTo({
    url: '/uni_modules/sv-id-pages/pages/userinfo/security/security'
  })
}

const sysStore = useSysStore()

function toggleTheme() {
  const theme = sysStore.getThemes() == 'light' ? 'dark' : 'light'
  changeTheme(theme)
}
</script>

<style lang="scss">
.setting {
  height: var(--page-notab-height);
  padding: 24rpx 0;
}
</style>
