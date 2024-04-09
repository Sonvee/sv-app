<template>
  <sv-page>
    <view class="feedback-list">
      <sv-paging
        ref="pagingRef"
        :apiFunc="feedbackList"
        :apiParams="dataParams"
        @apiQuery="queryRes"
        @refreshOK="refreshOK"
      >
        <template #default="{ data }">
          <!-- 列表 -->
          <view class="feedback-item flex-vc" :class="{ 'border-top': data.index == 0 }">
            <view class="flex-sub">{{ data.item.feedback_title }}</view>
            <view class="cuIcon-right text-xl text-gray padding-lr-sm"></view>
          </view>
        </template>
      </sv-paging>
    </view>
  </sv-page>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '@/uni_modules/sv-id-pages/common/store'
import { feedbackList } from '@/service/api/sys'

const dataParams = ref({ user_id: store.userInfo._id })

function queryRes(e) {
  console.log('==== queryRes :', e)
}

function refreshOK(e) {
  console.log('==== refreshOK :', e)
}
</script>

<style lang="scss">
.feedback-list {
  height: var(--page-notab-height);

  .feedback-item {
    height: 100rpx;
    border-bottom: 1px solid #cccccc;

    @include useTheme {
      &:active {
        background-color: getTheme('sv-hover-color');
      }
    }
  }
  .border-top {
    border-top: 1px solid #cccccc;
  }
}
</style>
