<template>
  <sv-page>
    <view class="feedback">
      <view class="sv-paging-header">
        <uv-tabs
          :list="tabList"
          keyName="text"
          activeStyle="color:#0081ff"
          inactiveStyle="color:#1cbbb4"
          @click="tapTab"
        >
          <template #right>
            <text
              v-if="editList.length > 0"
              class="cuIcon-delete text-xl text-red padding-sm"
              @click="onDeleteList"
            ></text>
            <text
              class="cuIcon-edit text-xl padding-sm"
              :class="[isEdit ? 'text-blue' : 'text-cyan']"
              @click="onEditList"
            ></text>
          </template>
        </uv-tabs>
      </view>
      <view class="sv-paging-list">
        <sv-paging
          ref="pagingRef"
          :apiFunc="feedbackList"
          :apiParams="dataParams"
          @apiQuery="queryRes"
        >
          <template #default="{ data }">
            <!-- 列表 -->
            <view
              class="feedback-item flex-vc card"
              :class="[isEdit ? 'shake-bottom' : '']"
              @click="onFeedback(data.item)"
            >
              <view class="feedback-item-box">
                <view class="flex-vc">
                  <view class="flex-sub flex-vc">
                    <sv-checkbox
                      v-if="isEdit"
                      class="margin-right-sm"
                      :info="data.item.feedback_id"
                      @change="changeCheck"
                    ></sv-checkbox>
                    <view class="text-line-1 text-bold">
                      {{ data.item.feedback_title }}
                    </view>
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
      </view>
      <!-- 悬浮按钮 -->
      <view class="fab-btn" @click="onFeedbackSend">
        <text class="cuIcon-text text-xxl text-green"></text>
      </view>
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
                类型：
                <uv-tags
                  size="mini"
                  :text="typeMap[curFeedback.feedback_type].text"
                  :type="typeMap[curFeedback.feedback_type].type"
                ></uv-tags>
              </view>
              <view class="flex-vc margin-top-sm">
                状态：
                <uv-tags
                  size="mini"
                  :text="statusMap[curFeedback.feedback_status].text"
                  :type="statusMap[curFeedback.feedback_status].type"
                ></uv-tags>
              </view>
              <view class="margin-top-sm">反馈时间：{{ timeFormat(curFeedback.create_date) }}</view>
              <view class="margin-top-sm">
                <view class="flex-vc">
                  <view>反馈内容：</view>
                  <view class="flex-sub"></view>
                  <text
                    class="cuIcon-edit text-lg text-bold text-green"
                    @click="onEdit(curFeedback)"
                  ></text>
                </view>
                <view class="margin-top-sm">
                  <view class="content-box">{{ curFeedback.feedback_content }}</view>
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
                    v-else
                    width="80"
                    height="80"
                    text="未上传图片"
                    icon="https://cdn.uviewui.com/uview/empty/data.png"
                  ></uv-empty>
                </view>
              </view>
              <view class="margin-top-sm">
                <view class="margin-bottom-sm">反馈回复：</view>
                <view v-if="curFeedback.reply" class="content-box">
                  <mp-html class="rich-text" :content="curFeedback.reply" />
                </view>
                <uv-empty
                  v-else
                  width="80"
                  height="80"
                  text="等待回复中"
                  icon="https://cdn.uviewui.com/uview/empty/message.png"
                ></uv-empty>
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
import { feedbackList, feedbackDelete } from '@/api/sys'
import { timeFormat } from '@/utils/util'

const dataParams = ref({ user_id: store.userInfo._id, feedback_type: '' })
const pagingRef = ref()

const tabList = ref([
  { text: '全部', value: '' },
  { text: '改进建议', value: 0 },
  { text: '发现bug', value: 1 }
])

const typeMap = {
  0: { text: '改进建议', type: 'info' },
  1: { text: '发现bug', type: 'warning' }
}

const statusMap = {
  0: { text: '审批中', type: 'primary' },
  1: { text: '已解决', type: 'success' },
  2: { text: '已拒绝', type: 'error' }
}

function tapTab(e) {
  // 更新参数
  dataParams.value['feedback_type'] = e.value
  // 重载
  pagingRef.value.reload()
}

function queryRes(e) {
  // console.log('==== queryRes :', e)
}

const feedbackDetailRef = ref()
const curFeedback = ref()

function onFeedback(e) {
  curFeedback.value = e
  feedbackDetailRef.value.open()
}

// 前往发送反馈页面
function onFeedbackSend() {
  uni.navigateTo({ url: '/pages/feedback/feedback-form' })
}

// 前往编辑当前反馈
function onEdit(e) {
  // 移除_id字段不参与更新
  delete e._id
  // 通信通道传值
  uni.navigateTo({
    url: '/pages/feedback/feedback-form',
    success(res) {
      res.eventChannel.emit('e-transmit-feedback', {
        data: e,
        mode: 'edit'
      })
    }
  })
  // 关闭弹窗
  feedbackDetailRef.value.close()
}

const isEdit = ref(false)
function onEditList() {
  isEdit.value = !isEdit.value
  if (!isEdit.value) {
    // 置空编辑选中数组
    editList.value = []
  }
}

const editList = ref([])
function changeCheck(e) {
  const { checked, info } = e
  // checked为true时，向editList中添加项，否则删除
  if (checked) {
    editList.value.push(info)
  } else {
    const findIndex = editList.value.findIndex((item) => item == info)
    editList.value.splice(findIndex, 1)
  }
}

function onDeleteList() {
  uni.showModal({
    title: '系统提示',
    content: '确定删除选中项吗？',
    showCancel: true,
    success: async ({ confirm }) => {
      if (confirm) {
        const deleteRes = await feedbackDelete({
          feedback_id: editList.value
        })
        uni.showToast({ title: deleteRes.message })
        pagingRef.value.reload()
        // 置空编辑选中数组
        editList.value = []
        isEdit.value = false
      }
    }
  })
}
</script>

<style lang="scss">
.feedback {
  height: var(--page-notab-height);
  position: relative;

  .sv-paging-header {
    height: 88rpx;

    @include useTheme {
      background-color: getTheme('sv-bg-color');
    }
  }

  .sv-paging-list {
    height: calc(100% - 88rpx);

    .feedback-item {
      margin: 20rpx;

      .feedback-item-box {
        flex: 1;
        padding: 20rpx 0 20rpx 30rpx;
      }
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

        .content-box {
          @include useTheme {
            border: 1px solid #{getTheme('sv-border-color')};
          }
          border-radius: 8rpx;
          padding: 12rpx 16rpx;
        }
      }
    }
  }

  .fab-btn {
    position: fixed;
    bottom: calc(180rpx + env(safe-area-inset-bottom));
    right: 24rpx;
    width: 80rpx;
    height: 80rpx;
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0px 0px 10px 0px #c8c7cc66;
    backdrop-filter: blur(4px) brightness(120%);
    z-index: 999;

    &:active {
      box-shadow: 0px 0px 10px 0px #c8c7cc;
    }
  }
}
</style>
