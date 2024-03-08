<template>
  <sv-page>
    <view class="vip">
      <!-- 头部 -->
      <view class="header flex padding">
        <view class="cu-avatar round lg">
          <image
            class="w-h-full"
            v-if="userInfo?.avatar_file?.url"
            :src="userInfo.avatar_file.url"
          ></image>
          <text v-else class="cuIcon-my"></text>
        </view>
        <view class="flex-sub margin-left flex-col justify-evenly">
          <view class="text-bold text-df">
            {{ userInfo.nickname }}
          </view>
          <view class="text-sm text-cyan">VIP已于2024-03-01过期</view>
        </view>
      </view>
      <!-- 套餐 -->
      <view class="padding">
        <uv-scroll-list>
          <view v-for="(item, index) in mealList" :key="item.name">
            <view class="meal-item margin radius-lg">{{ item.name }}</view>
          </view>
        </uv-scroll-list>
      </view>
    </view>
  </sv-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { store } from '@/uni_modules/sv-id-pages/common/store'
import { vipList } from '@/service/api/svid'

const userInfo = computed(() => {
  return store.userInfo
})

const mealList = ref([])

getVipList()

function getVipList() {
  vipList().then((res) => {
    mealList.value = res.data || []
    console.log('==== mealList.value :', mealList.value)
  })
}
</script>

<style lang="scss">
.vip {
  min-height: var(--page-notab-height);

  .header {
    @include useTheme {
      box-shadow: 0 2px 4px #{getTheme('sv-shadow-color')};
    }
  }

  .meal-item {
    width: 100px;
    height: 120px;
    border: 1px solid #ccc;
  }
}
</style>
