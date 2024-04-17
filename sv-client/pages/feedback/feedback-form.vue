<template>
  <sv-page>
    <view class="feedback-form">
      <view class="feedback-type flex align-center margin-bottom-sm">
        反馈类型：
        <view class="sv-uni-data-select flex-sub">
          <uni-data-select
            v-model="fbFrom.feedback_type"
            :localdata="feedback_type_map"
          ></uni-data-select>
        </view>
      </view>
      <view class="feedback-title flex align-center margin-bottom-sm">
        反馈标题：
        <view class="sv-uni-easyinput flex-sub">
          <uni-easyinput
            v-model="fbFrom.feedback_title"
            placeholder="请输入反馈标题 (可选)"
          ></uni-easyinput>
        </view>
      </view>
      <view class="feedback-content margin-bottom-sm">
        <view class="margin-bottom-sm">反馈内容：</view>
        <view class="sv-uni-easyinput flex-sub">
          <uni-easyinput
            v-model.trim="fbFrom.feedback_content"
            type="textarea"
            autoHeight
            :maxlength="-1"
            placeholder="请输入反馈内容"
          ></uni-easyinput>
        </view>
      </view>
      <!-- 反馈图片上传- 当反馈类型不为试题错误时显示 -->
      <view class="feedback-image margin-bottom-sm" v-if="fbFrom.feedback_type !== 2">
        <view class="margin-bottom-sm">反馈图片：</view>
        <uni-file-picker
          v-model="fbFrom.feedback_image"
          fileMediatype="image"
          mode="grid"
          @select="select"
          @progress="progress"
          @success="success"
          @fail="fail"
        />
      </view>
      <!-- 占位 -->
      <view style="height: 80rpx"></view>
      <view class="feedback-control flex-vc">
        <button class="cu-btn bg-gradual-red flex-sub margin-right-sm" @click="toBack">返回</button>
        <button class="cu-btn bg-gradual-blue flex-sub" @click="toSubmit">提交反馈</button>
      </view>
    </view>
    <!-- 退出拦截 -->
    <sv-intercept-back
      :show="interceptFlag"
      content="反馈内容还未提交，确定退出吗？"
    ></sv-intercept-back>
  </sv-page>
</template>

<script setup>
import { ref, getCurrentInstance } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { store } from '@/uni_modules/sv-id-pages/common/store'
import { feedbackAdd, feedbackUpdate } from '@/service/api/sys'
import { assignOverride } from '@/utils/util'

const { proxy } = getCurrentInstance()

const feedback_type_map = ref([
  { text: '改进建议', value: 0 },
  { text: '发现bug', value: 1 }
])

const interceptFlag = ref(true)

const fbFrom = ref({
  user_id: store.userInfo._id,
  feedback_id: '',
  feedback_type: 0,
  feedback_title: '',
  feedback_content: '',
  feedback_image: [],
  feedback_status: 0,
  create_date: ''
})

const fbMode = ref('add')

onLoad(() => {
  const eventChannel = proxy.getOpenerEventChannel()
  eventChannel.once('e-transmit-feedback', (res) => {
    fbFrom.value = assignOverride({ ...fbFrom.value }, res.data)
    fbMode.value = res.mode
  })
})

// 图片上传相关
// 获取上传状态
function select(e) {
  console.log('选择文件：', e)
}
// 获取上传进度
function progress(e) {
  console.log('上传进度：', e)
}
// 上传成功
function success(e) {
  console.log('上传成功', e)
}
// 上传失败
function fail(e) {
  console.log('上传失败：', e)
}

function toBack() {
  uni.navigateBack()
}

// 提交
function toSubmit() {
  if (fbFrom.value.feedback_type === '') {
    uni.showToast({
      title: '请选择反馈类型',
      icon: 'error'
    })
    return
  }
  if (!fbFrom.value.feedback_content) {
    uni.showToast({
      title: '请输入反馈内容',
      icon: 'error'
    })
    return
  }
  uni.showModal({
    title: '系统提示',
    content: '确定提交问题反馈吗？',
    cancelText: '再检查一下',
    showCancel: true,
    success: async ({ confirm }) => {
      if (confirm) {
        // 提交反馈单
        let fbRes
        if (fbMode.value == 'add') {
          // 新增
          fbFrom.value.create_date = Date.now()
          fbFrom.value.feedback_id = `feedback_${store.userInfo._id}_${fbFrom.value.create_date}`
          fbRes = await feedbackAdd(fbFrom.value)
        } else {
          // 编辑时需要将状态改回审批中
          fbFrom.value.feedback_status = 0
          fbRes = await feedbackUpdate(fbFrom.value)
        }
        uni.showToast({
          title: fbRes.message,
          icon: 'none',
          duration: 1200
        })
        if (fbRes.success) {
          interceptFlag.value = false
          setTimeout(() => {
            uni.navigateBack()
          }, 1200)
        }
      }
    }
  })
}
</script>

<style lang="scss">
.feedback-form {
  min-height: var(--page-notab-height);
  padding: 24rpx;
  box-sizing: border-box;
  position: relative;

  .feedback-control {
    position: absolute;
    bottom: calc(24rpx + env(safe-area-inset-bottom));
    width: calc(100% - 48rpx);
  }
}
</style>
