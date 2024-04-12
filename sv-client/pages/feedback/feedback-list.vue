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
          <view
            class="feedback-item flex-vc"
            :class="[data.index == 0 ? 'solid-top' : '']"
            @click="onFeedback(data.item)"
          >
            <view class="feedback-item-box">
              <view class="flex-vc">
                <view class="flex-sub text-line-1 text-bold">
                  {{ data.item.feedback_title }}
                </view>
                <uv-tags
                  size="mini"
                  :text="statusMap[data.item.feedback_status].text"
                  :type="statusMap[data.item.feedback_status].type"
                ></uv-tags>
              </view>
              <view class="margin-top-xs text-sm text-line-2">
                {{ data.item.feedback_content }}
              </view>
            </view>
            <view class="cuIcon-right text-xl text-gray padding-lr"></view>
          </view>
        </template>
      </sv-paging>
      <uv-popup ref="feedbackDetailRef" mode="center" closeable>
        <view class="feedback-detail-popup">
          <view class="popup-header">
            <view class="popup-title text-line-1">
              {{ curFeedback.feedback_title }}
            </view>
          </view>
          <view class="popup-content">
            <view class="popup-detail">
              <!-- 内容详情 -->
              <view class="flex-vc">
                状态：
                <uv-tags
                  size="mini"
                  :text="statusMap[curFeedback.feedback_status].text"
                  :type="statusMap[curFeedback.feedback_status].type"
                ></uv-tags>
              </view>
              <view class="margin-top-sm">反馈时间：{{ timeFormat(curFeedback.create_date) }}</view>
              <view class="margin-top-sm">
                反馈内容：
                <view class="margin-top-sm">
                  <uni-easyinput
                    v-model="curFeedback.feedback_content"
                    type="textarea"
                    disabled
                    autoHeight
                    :maxlength="-1"
                    placeholder="请输入反馈内容"
                  ></uni-easyinput>
                </view>
              </view>
              <view class="margin-top-sm">
                <view class="margin-bottom-sm">反馈图片：</view>
                <view class="flex-col-vhc">
                  <uv-album
                    v-if="curFeedback.feedback_image?.length > 0"
                    keyName="url"
                    :urls="curFeedback.feedback_image"
                  ></uv-album>
                  <uv-empty
                    width="80"
                    height="80"
                    text="未上传图片"
                    icon="https://cdn.uviewui.com/uview/empty/data.png"
                  ></uv-empty>
                </view>
              </view>
              <view class="margin-top-sm">
                <view class="margin-bottom-sm">反馈回复：</view>
                <view>1231312</view>
              </view>
            </view>
          </view>
        </view>
      </uv-popup>
    </view>
  </sv-page>
</template>

<script setup>
import { ref } from 'vue'
import { store } from '@/uni_modules/sv-id-pages/common/store'
import { feedbackList } from '@/service/api/sys'
import { timeFormat } from '@/utils/util'

const dataParams = ref({ user_id: store.userInfo._id })

const statusMap = {
  0: { text: '审批中', type: 'primary' },
  1: { text: '已解决', type: 'success' },
  2: { text: '已拒绝', type: 'error' }
}

function queryRes(e) {
  console.log('==== queryRes :', e)
}

function refreshOK(e) {
  console.log('==== refreshOK :', e)
}

const feedbackDetailRef = ref()
const curFeedback = ref()

function onFeedback(e) {
  console.log('==== onFeddback :', e)
  curFeedback.value = e
  feedbackDetailRef.value.open()
}
</script>

<style lang="scss">
.feedback-list {
  height: var(--page-notab-height);

  .feedback-item {
    @include useTheme {
      border-bottom: 1px solid #{getTheme('sv-border-color')};
      background-color: getTheme('sv-card-color');
      &:active {
        background-color: getTheme('sv-hover-color');
      }
    }

    .feedback-item-box {
      flex: 1;
      padding: 20rpx 0 20rpx 30rpx;
    }
  }
  .solid-top {
    @include useTheme {
      border-top: 1px solid #{getTheme('sv-border-color')};
    }
  }

  .feedback-detail-popup {
    width: 80vw;
    height: 80vh;

    @include useTheme {
      background-color: getTheme('sv-card-color');
    }

    .popup-header {
      height: 96rpx;
      padding: 30rpx 96rpx 30rpx 30rpx;

      .popup-title {
        font-weight: 700;
      }
    }

    .popup-content {
      padding: 0 30rpx 30rpx 30rpx;
      height: calc(100% - 96rpx);

      .popup-detail {
        height: 100%;
        overflow: auto;
      }
    }
  }
}
</style>
