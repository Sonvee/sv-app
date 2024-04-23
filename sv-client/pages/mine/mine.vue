<template>
  <sv-page showTabBar>
    <view class="mine">
      <!-- 头部 -->
      <view class="header">
        <!-- 小功能 -->
        <view class="flex justify-end align-center padding-right-sm" style="height: 40px">
          <text class="cuIcon-scan text-xxl padding-xs" @click="onScan"></text>
          <text
            class="text-xxl padding-xs"
            :class="[sysStore.themes == 'light' ? 'sv-icons-sun' : 'sv-icons-moon']"
            @click="toggleTheme"
          ></text>
          <text
            class="cuIcon-refresh text-xxl padding-xs sv-turn-around-active"
            @click="onRefresh"
          ></text>
        </view>
        <!-- 账号 -->
        <view class="flex padding-lr" @click="toUser">
          <view class="cu-avatar round lg">
            <image
              class="w-h-full"
              v-if="userInfo?.avatar_file?.url"
              :src="userInfo.avatar_file.url"
            ></image>
            <text v-else class="cuIcon-my"></text>
          </view>
          <view class="flex-sub margin-left flex-col justify-evenly" v-if="hasLogin">
            <view class="text-bold text-df" :class="{ 'sv-text-streamer': isVip }">
              {{ userInfo.nickname || '起个昵称' }}
              <text class="sv-icons-vip" v-if="isVip"></text>
            </view>
            <view class="text-gray text-xs">
              {{ userInfo.comment || '写点什么吧~' }}
              <text class="cuIcon-writefill"></text>
            </view>
          </view>
          <view class="flex-sub margin-left flex-col justify-evenly" v-else>
            <view class="text-bold text-df text-green">立即登录</view>
            <view class="text-gray text-xs">登录即可体验完整功能</view>
          </view>
          <view class="flex align-center">
            <text class="cuIcon-right text-gray"></text>
          </view>
        </view>
        <!-- 数据 -->
        <view class="sv-grid grid-col-4 padding-tb-xs">
          <view class="grid-item-lg flex-col-vhc" v-for="item in statisticData" :key="item.name">
            <view class="flex-vc">
              <uv-count-to :startVal="0" :endVal="item.value" color="#39b54a"></uv-count-to>
              <text v-if="item.name == '百分比'" class="text-cyan">%</text>
            </view>
            <view class="text-sm text-cyan">{{ item.name }}</view>
          </view>
        </view>
      </view>
      <!-- 会员 -->
      <view class="vip margin padding-xs radius-lg flex-vc" @click="onVip">
        <template v-if="!isVip">
          <view class="flex-sub text-sm">
            <view class="text-green sv-text-streamer">
              <text class="cuIcon-choiceness"></text>
              解锁会员享受更多权限
            </view>
            <view class="text-red">
              <text class="cuIcon-hotfill"></text>
              活动热销中，速来围观
            </view>
          </view>
          <button class="cu-btn round bg-gradual-blue shadow">
            <text class="cuIcon-vip margin-right-xs text-lg"></text>
            <text class="text-sm">激活VIP</text>
          </button>
        </template>
        <template v-else>
          <view class="flex-sub text-sm">
            <view class="text-green sv-text-streamer">
              <text class="cuIcon-choiceness"></text>
              恭喜您已成为会员
            </view>
            <view class="text-green">
              <text class="cuIcon-crownfill"></text>
              查看我的会员特权
            </view>
          </view>
          <button class="cu-btn round bg-gradual-pink shadow">
            <text class="cuIcon-vip margin-right-xs text-lg"></text>
            <text class="text-sm">我的VIP</text>
          </button>
        </template>
      </view>
      <!-- 功能 -->
      <view class="cu-bar margin-top-sm">
        <view class="action sub-title">
          <text class="text-bold text-blue">功能面板</text>
          <text class="text-sm text-ABC text-blue">feature</text>
        </view>
        <!-- <view class="text-gray margin-right">
          <text class="text-sm">更多</text>
          <text class="cuIcon-right"></text>
        </view> -->
      </view>
      <view class="sv-grid grid-col-4 grid-gap-row">
        <view
          class="grid-item-lg flex-col align-center justify-evenly"
          v-for="item in featureMenu"
          :key="item.name"
          @click="onMenu(item)"
        >
          <text class="text-xxl" :class="item.icon"></text>
          <text class="text-sm">{{ item.name }}</text>
        </view>
      </view>
      <!-- 其他服务 -->
      <view class="cu-bar margin-top-sm">
        <view class="action sub-title">
          <text class="text-bold text-blue">其他服务</text>
          <text class="text-sm text-ABC text-blue">other</text>
        </view>
      </view>
      <view class="cu-list menu sm-border">
        <view
          class="cu-item arrow"
          v-for="item in otherMenu"
          :key="item.name"
          @click="onMenu(item)"
        >
          <view class="content">
            <text class="text-grey" :class="item.icon"></text>
            <text class="text-grey">{{ item.name }}</text>
          </view>
        </view>
      </view>
      <!-- 底部间隔栏 -->
      <view style="height: 40rpx"></view>
    </view>
  </sv-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { useSysStore } from '@/store/sys'
import { mutations, store } from '@/uni_modules/sv-id-pages/common/store'
import { judgeLogin, onScan, useThrottle } from '@/utils/util'
import { vipVerify } from '@/api/vip'
import { changeTheme } from '@/utils/sys'

const sysStore = useSysStore()

const userInfo = computed(() => {
  return store.userInfo
})
const hasLogin = computed(() => {
  return store.hasLogin
})

const vipInfo = ref()
const isVip = computed(() => {
  return vipInfo.value?.vip
})

onLoad(() => {
  // tabbar页面会缓存，onLoad不会频繁触发

  /**
   * 会员验证
   * 如若需要自动刷新验证，需要放在onShow生命周期中
   * 此处旨在为减少频繁刷新
   */
  getVipVerify()
  handleInit()
})

// 手动刷新页面
async function onRefresh() {
  // 节流操作
  if (!useThrottle()()) return

  uni.showLoading({
    title: '正在刷新'
  })
  await getVipVerify()
  await handleInit()
  uni.hideLoading()
}

async function getVipVerify() {
  if (userInfo.value._id) {
    const verifyRes = await vipVerify({ user_id: userInfo.value._id })
    vipInfo.value = verifyRes.data
  }
}

const statisticData = ref([
  { name: '数据甲', value: 24 },
  { name: '数据乙', value: 66 },
  { name: '数据丙', value: 128 },
  { name: '百分比', value: 88 }
])

async function handleInit() {}

const featureMenu = ref([
  { name: '菜单甲', icon: 'cuIcon-apps', path: '' },
  { name: '菜单乙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丙', icon: 'cuIcon-apps', path: '' },
  { name: '菜单丁', icon: 'cuIcon-apps', path: '' },
  { name: '菜单戊', icon: 'cuIcon-apps', path: '' },
  { name: '菜单己', icon: 'cuIcon-apps', path: '' },
  { name: '菜单庚', icon: 'cuIcon-apps', path: '' },
  { name: '菜单辛', icon: 'cuIcon-apps', path: '' }
])

const otherMenu = [
  { name: '设置', icon: 'cuIcon-settings', path: '/pages/setting/setting' },
  { name: '问题反馈', icon: 'cuIcon-service', path: '/pages/feedback/feedback' },
  { name: '关于我们', icon: 'cuIcon-info', path: '/pages/about/about' }
]

function onMenu(item) {
  // 不需要登录的菜单
  const whiteMenu = ['/pages/setting/setting', '/pages/about/about']

  if (item.path && !whiteMenu.includes(item.path)) {
    // 判断登录
    const isLogin = judgeLogin()
    // 未登录不予操作
    if (!isLogin) return
  }

  if (item.path) {
    uni.navigateTo({
      url: item.path
    })
  } else {
    uni.showToast({
      title: '敬请期待',
      icon: 'none'
    })
  }
}

function toggleTheme() {
  const theme = sysStore.getThemes() == 'light' ? 'dark' : 'light'
  changeTheme(theme)
}

function toUser() {
  if (hasLogin.value) {
    uni.navigateTo({
      url: '/uni_modules/sv-id-pages/pages/userinfo/userinfo'
    })
  } else {
    mutations.logout()
  }
}

function onVip() {
  // 判断登录
  const isLogin = judgeLogin()
  // 未登录不予操作
  if (!isLogin) return

  uni.navigateTo({ url: '/uni_modules/sv-id-vip/pages/vip/vip' })
}
</script>

<style lang="scss">
.mine {
  min-height: var(--page-main-height);

  .header {
    @include useTheme {
      box-shadow: 0 2px 4px #{getTheme('sv-shadow-color')};
    }
  }

  .vip {
    @include useTheme {
      background-color: getTheme('sv-card-color');
    }
  }
}
</style>
