<template>
  <sv-page showTabBar>
    <view class="mine">
      <view class="header">
        <!-- 小功能 -->
        <view class="flex justify-end align-center padding-right" style="height: 40px">
          <text class="cuIcon-scan text-xxl padding-xs" @click="onScan"></text>
          <text
            class="text-xxl padding-xs"
            :class="[sysStore.themes == 'light' ? 'sv-icons-sun' : 'sv-icons-moon']"
            @click="changeTheme"
          ></text>
        </view>
        <!-- 账号 -->
        <view class="flex padding-lr" @click="toUser">
          <view class="cu-avatar round lg">
            <image
              class="cu-avatar-image"
              v-if="userInfo?.avatar_file?.url"
              :src="userInfo.avatar_file.url"
            ></image>
            <text v-else class="cuIcon-my"></text>
          </view>
          <view class="flex-sub margin-left flex-col justify-evenly" v-if="hasLogin">
            <view class="text-bold">{{ userInfo.nickname }}</view>
            <view class="text-gray">{{ userInfo.comment }}</view>
          </view>
          <view class="flex-sub margin-left flex-col justify-evenly" v-else>
            <view class="text-bold text-green">立即登录</view>
            <view class="text-gray">登录即可体验完整功能</view>
          </view>
          <view class="flex align-center">
            <text class="cuIcon-right text-gray"></text>
          </view>
        </view>
        <!-- 数据 -->
        <view class="flex justify-between padding">
          <view class="flex-sub flex-col-vhc" v-for="item in statisticsCard" :key="item.lable">
            <view class="text-lg text-bold text-green">{{ item.value }}</view>
            <view class="text-sm text-grey">{{ item.lable }}</view>
          </view>
        </view>
      </view>
      <view class="vip margin padding-xs radius-lg flex-vc">
        <view class="flex-sub text-sm">
          <view class="text-green">
            <text class="cuIcon-choiceness"></text>
            解锁会员享受更多权限
          </view>
          <view class="text-red">
            <text class="cuIcon-hotfill"></text>
            活动热销中，速来围观
          </view>
        </view>
        <button class="cu-btn round bg-green shadow">
          <text class="cuIcon-vip margin-right-xs text-lg"></text>
          <text class="text-sm">激活VIP</text>
        </button>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useSysStore } from '../../store/sys'
import { mutations, store } from '../../uni_modules/sv-id-pages/common/store'

const sysStore = useSysStore()

const userInfo = computed(() => {
  return store.userInfo
})
const hasLogin = computed(() => {
  return store.hasLogin
})

const statisticsCard = ref([
  {
    lable: '数据甲',
    value: '25'
  },
  {
    lable: '数据乙',
    value: '33'
  },
  {
    lable: '数据丙',
    value: '61'
  }
])

function changeTheme() {
  const theme = sysStore.getThemes() == 'light' ? 'dark' : 'light'
  sysStore.setThemes(theme)
}

function onScan() {
  // #ifndef H5
  uni.scanCode({
    onlyFromCamera: false,
    success: (res) => {
      console.log('==== res :', res)
    },
    fail: (err) => {
      console.log('==== err :', err)
    }
  })
  // #endif
  // #ifdef H5
  uni.showToast({
    title: 'H5端不支持扫码',
    icon: 'none'
  })
  // #endif
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
</script>

<style lang="scss">
.mine {
  height: var(--page-height);

  .header {
    @include useTheme {
      box-shadow: 0 2px 4px #{getTheme('sv-shadow-color')};
    }
  }

  .vip {
    border: 1px solid;
  }
}
</style>
