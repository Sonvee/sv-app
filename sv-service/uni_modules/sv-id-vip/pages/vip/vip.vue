<template>
  <sv-page>
    <view class="vip">
      <!-- 头部 -->
      <view class="padding">
        <view class="header w-full radius-lg flex padding-sm" @click="onUser">
          <view class="cu-avatar round lg">
            <image
              class="w-h-full"
              v-if="userInfo?.avatar_file?.url"
              :src="userInfo.avatar_file.url"
            ></image>
            <text v-else class="cuIcon-my"></text>
          </view>
          <view class="flex-sub margin-left flex-col justify-around">
            <view class="text-bold text-lg" :class="{ 'sv-text-streamer': isVip }">
              <text v-if="hasLogin">{{ userInfo.nickname }}</text>
              <text v-else>立即登录</text>
              <text class="sv-icons-vip margin-left-xs" v-if="isVip"></text>
            </view>
            <view class="text-sm text-cyan" v-if="hasLogin">
              {{ validityDate }}
            </view>
          </view>
        </view>
      </view>
      <!-- 套餐 -->
      <view class="cu-bar margin-top-xs">
        <view class="action sub-title">
          <text class="text-lg text-bold text-bili">会员套餐</text>
          <text class="text-sm text-ABC text-bili">VIPPLAN</text>
        </view>
      </view>
      <uv-skeletons class="padding-lr" :loading="skeletonPlanLoading" :skeleton="skeletonPlan">
        <uv-scroll-list class="sv-uv-scroll-list" :indicator="false">
          <view v-for="item in planList" :key="item.plan_name">
            <view
              class="plan-item margin radius-lg flex-col justify-evenly align-center"
              :class="[curPlan?.plan_name == item.plan_name ? 'selected-plan' : '']"
              @click="selectPlan(item)"
            >
              <view class="text-bold text-bili">
                {{ item.plan_name }}
              </view>
              <view class="text-price text-bold text-tyblue text-xxl">
                {{ convertFenToYuan(item?.price - item?.discount) }}
              </view>
              <view class="text-price text-miku text-delete-line">
                {{ convertFenToYuan(item?.price) }}
              </view>
              <view class="text-sm text-red">
                {{ item?.description }}
              </view>
            </view>
          </view>
        </uv-scroll-list>
      </uv-skeletons>
      <!-- 特权 -->
      <view class="cu-bar margin-bottom-xs">
        <view class="action sub-title">
          <text class="text-lg text-bold text-tyblue">会员特权</text>
          <text class="text-sm text-ABC text-tyblue">benefits</text>
        </view>
      </view>
      <uv-skeletons
        class="padding-lr"
        :loading="skeletonBenefitLoading"
        :skeleton="skeletonBenefit"
      >
        <view class="sv-grid grid-col-5 padding-lr-sm">
          <view
            class="grid-item-xl flex-col align-center justify-evenly text-tyblue"
            v-for="item in benefits"
            :key="item.lable"
          >
            <text class="text-sl" :class="item?.icon"></text>
            <text class="text-sm">{{ item.benefit_name }}</text>
          </view>
        </view>
      </uv-skeletons>
      <!-- 开通方式 -->
      <view class="cu-bar margin-top">
        <view class="action sub-title">
          <text class="text-lg text-bold text-miku">开通方式</text>
          <text class="text-sm text-ABC text-miku">PAYWAY</text>
        </view>
      </view>
      <view class="sv-grid grid-col-2 grid-gap-col-lg padding">
        <view
          class="grid-item-lg radius-lg bg-gradual-blue padding-sm flex align-center"
          :class="[payWay == 'wallet' ? 'selected-way' : '']"
          @click="toggleWay('wallet')"
        >
          <view class="cuIcon-pay text-sl"></view>
          <view class="padding-left-sm text-lg text-bold">普通支付</view>
        </view>
        <view
          class="grid-item-lg radius-lg bg-gradual-pink padding-sm flex align-center"
          :class="[payWay == 'cdkey' ? 'selected-way' : '']"
          @click="toggleWay('cdkey')"
        >
          <view class="cuIcon-command text-sl"></view>
          <view class="padding-left-sm text-lg text-bold">激活码兑换</view>
        </view>
      </view>
      <!-- 方式 -->
      <view class="padding-lr" v-if="payWay == 'wallet'">
        <uv-radio-group v-model="paySelect" placement="column" iconPlacement="right">
          <uv-radio name="wxpay" label="微信支付">
            <view class="padding-tb-sm text-green">
              <text class="sv-icons-wxpay margin-right-xs text-lg" style="width: 1.6em"></text>
              <text>微信支付</text>
            </view>
          </uv-radio>
          <uv-radio name="alipay" label="支付宝">
            <view class="padding-tb-sm text-blue">
              <text
                class="sv-icons-alipay-fill margin-right-xs text-lg"
                style="width: 1.6em"
              ></text>
              <text>支付宝</text>
            </view>
          </uv-radio>
          <!-- <uv-radio name="unionpay" label="银联">
            <view class="padding-tb-sm text-red">
              <text class="sv-icons-unionpay margin-right-xs text-lg" style="width: 1.6em"></text>
              <text>银联</text>
            </view>
          </uv-radio> -->
        </uv-radio-group>
      </view>
      <view class="padding-lr" v-else>
        <uni-easyinput
          v-model.trim="cdkey"
          placeholder="请输入CDKEY"
          :disabled="!hasLogin"
        ></uni-easyinput>
        <button class="margin-top w-full cu-btn bg-gradual-pink" @click="confirmCDKey">
          确定激活
        </button>
        <view class="fr margin-top text-sm text-cyan text-under-line text-right">
          <text @click="getCDKey">获取CDKEY</text>
        </view>
      </view>
      <!-- 底部栏 -->
      <view v-if="payWay == 'wallet'" class="pay-footer cu-bar tabbar border foot">
        <view class="h-full padding-lr-sm flex-col justify-evenly">
          <view class="text-bold text-red" @click="onFold">
            <text class="text-xxl text-price">
              {{ convertFenToYuan(curPlan?.price - curPlan?.discount) }}
            </text>
            <text class="text-sm margin-left-xs">
              已优惠
              <text class="text-price">{{ convertFenToYuan(curPlan?.discount) }}</text>
            </text>
            <text class="margin-left-xs" :class="[isFold ? 'cuIcon-fold' : 'cuIcon-unfold']"></text>
          </view>
          <view class="text-sm text-cyan flex-vc">
            <uv-checkbox-group v-model="readed" shape="circle" size="12">
              <uv-checkbox
                label="已阅读同意"
                labelSize="12"
                labelColor="#39b54a"
                name="read"
              ></uv-checkbox>
            </uv-checkbox-group>
            <text class="margin-left-xs" @click="onProtocol('vip-protocol')">会员协议</text>
            <text>丨</text>
            <text @click="onProtocol('pay-protocol')">支付条款</text>
          </view>
        </view>
        <view class="padding-lr-sm">
          <button class="cu-btn bg-red round shadow-blur" @click="onPay">立即订购</button>
        </view>
      </view>
      <!-- 底部占位 -->
      <view class="tabbar-placehoder margin-top"></view>
      <!-- 弹窗 -->
      <uv-popup
        class="sv-uv-popup"
        ref="payPopup"
        mode="bottom"
        round="12"
        closeable
        @change="(e) => (isFold = e.show)"
      >
        <view class="padding">
          <view class="text-lg text-bold text-center margin-bottom-sm">支付明细</view>
          <view class="text-bold text-lg">商品</view>
          <view class="flex justify-between line-height-3">
            <text>{{ curPlan?.plan_name }}</text>
            <text class="text-red text-bold text-lg text-price">
              {{ convertFenToYuan(curPlan?.price) }}
            </text>
          </view>
          <view class="text-bold text-lg">优惠</view>
          <view class="flex justify-between line-height-3">
            <text>促销折扣</text>
            <text class="text-orange text-bold text-lg text-price">
              {{ convertFenToYuan(curPlan?.discount) }}
            </text>
          </view>
          <view class="text-bold text-lg">结算</view>
          <view class="flex justify-between line-height-3">
            <text>支付金额</text>
            <text class="text-green text-bold text-lg text-price">
              {{ convertFenToYuan(curPlan?.price - curPlan?.discount) }}
            </text>
          </view>
        </view>
        <view class="tabbar-placehoder"></view>
      </uv-popup>
    </view>
  </sv-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { store } from '@/uni_modules/sv-id-pages/common/store'
import { benefitList, cdkeyActive, vipList, vipPayActive, vipVerify } from '@/service/api/vip'
import { isEmpty } from 'lodash-es'
import { createCDKey, validCDKey, convertFenToYuan } from '../../utils'
import dayjs from 'dayjs'

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
const validityDate = computed(() => {
  let text = ''
  const validDate = dayjs(vipInfo.value?.vip_validity).format('YYYY-MM-DD HH:mm:ss')
  if (vipInfo.value?.vip) {
    text = `VIP会员有效期至 ${validDate}`
  } else {
    if (vipInfo.value?.vip_validity) {
      text = `VIP会员已于 ${validDate}过期`
    } else {
      text = '还未开通过VIP会员哦'
    }
  }
  return text
})

onLoad(() => {
  // 会员验证
  getVipVerify()
  // 会员套餐
  getVipList()
  // 会员权益
  getVipBenefit()
})

async function getVipVerify() {
  if (hasLogin.value) {
    const verifyRes = await vipVerify({ user_id: userInfo.value._id })
    vipInfo.value = verifyRes.data
  }
}

function onUser() {
  if (hasLogin.value) {
    uni.navigateTo({ url: '/uni_modules/sv-id-pages/pages/userinfo/userinfo' })
  } else {
    uni.navigateTo({ url: '/uni_modules/sv-id-pages/pages/login/login' })
  }
}

const skeletonPlanLoading = ref(true)
const planList = ref([])
const curPlan = ref()

const readed = ref([''])

function onProtocol(e) {
  console.log('==== onProtocol :', e)
  uni.navigateTo({
    url: `/uni_modules/sv-id-vip/pages/protocol/${e}`
  })
}

const payPopup = ref()
const isFold = ref(false)

function onFold() {
  if (isFold.value) {
    payPopup.value.close()
  } else {
    if (!isEmpty(curPlan.value)) {
      payPopup.value.open()
    }
  }
}

const skeletonPlan = [
  {
    type: 'flex',
    style: 'margin-bottom:4px',
    children: [
      {
        type: 'custom',
        style: 'width:200rpx;height:240rpx;margin:30rpx;'
      },
      {
        type: 'custom',
        style: 'width:200rpx;height:240rpx;margin:30rpx;'
      },
      {
        type: 'custom',
        style: 'width:200rpx;height:240rpx;margin:30rpx;'
      }
    ]
  }
]

const skeletonBenefit = [
  {
    type: 'flex',
    style: 'justify-content:space-around',
    children: [
      {
        type: 'custom',
        style: 'width:120rpx;height:160rpx;'
      },
      {
        type: 'custom',
        style: 'width:120rpx;height:160rpx;'
      },
      {
        type: 'custom',
        style: 'width:120rpx;height:160rpx;'
      },
      {
        type: 'custom',
        style: 'width:120rpx;height:160rpx;'
      }
    ]
  }
]

function getVipList() {
  if (!hasLogin.value) return
  vipList().then((res) => {
    planList.value = res.data || []
    skeletonPlanLoading.value = false
  })
}

function selectPlan(e) {
  curPlan.value = e
}

const benefits = ref([])
const skeletonBenefitLoading = ref(true)

function getVipBenefit() {
  if (!hasLogin.value) return
  benefitList().then((res) => {
    benefits.value = res.data || []
    skeletonBenefitLoading.value = false
  })
}

const payWay = ref('wallet') // wallet cdkey

function toggleWay(e) {
  payWay.value = e
}

const paySelect = ref('wxpay') // wxpay alipay

async function onPay() {
  if (!hasLogin.value) return

  // 判断是否已选择套餐
  if (isEmpty(curPlan.value)) {
    uni.showToast({
      title: '还没有选择套餐哦',
      icon: 'none'
    })
    return
  }
  // 判断是否阅读协议
  if (!readed.value.includes('read')) {
    uni.showToast({
      title: '请阅读并同意相关协议',
      icon: 'none'
    })
    return
  }

  // 支付操作

  uni.showLoading({
    mask: true,
    title: '订阅中...'
  })

  const payActiveRes = await vipPayActive({
    user_id: userInfo.value._id,
    plan_id: curPlan.value.plan_id,
    pay_fee: curPlan.value.price - curPlan.value.discount // 实际支付金额
  })
  if (payActiveRes.success) {
    uni.showToast({
      title: payActiveRes.message,
      icon: 'none'
    })
    // 支付订阅成功后需要刷新vip验证
    await getVipVerify()
  }
}

const cdkey = ref('')

async function confirmCDKey() {
  if (!hasLogin.value) return

  // CDKEY校验
  if (!validCDKey(cdkey.value)) {
    uni.showToast({
      title: '请输入正确的CDKEY',
      icon: 'none'
    })
    return
  }
  uni.showLoading({
    mask: true,
    title: '激活中...'
  })
  const activeRes = await cdkeyActive({
    user_id: userInfo.value._id,
    cdkey: cdkey.value
  })
  // 无需再手动hideLoading，因为无论成功与否都会showToast自动关闭loding
  if (activeRes.success) {
    uni.showToast({
      title: activeRes.message,
      icon: 'none'
    })
    // 激活成功后需要刷新vip验证
    await getVipVerify()
  }
}

function getCDKey() {
  uni.navigateTo({ url: '/uni_modules/sv-id-vip/pages/getcdkey/getcdkey' })
}
</script>

<style lang="scss">
.vip {
  min-height: var(--page-notab-height);

  .header {
    @include useTheme {
      box-shadow: 2px 2px 8px #{getTheme('sv-shadow-color')},
        -2px -2px 8px #{getTheme('sv-shadow-color')};
    }
  }

  .plan-item {
    width: 200rpx;
    height: 240rpx;
    border: 1px solid transparent;
    @include useTheme {
      background: linear-gradient(#{getTheme('sv-bg-color')}, #{getTheme('sv-card-color')})
          padding-box,
        linear-gradient(135deg, #fb7299, #66ccff, #39c5bb) border-box;
    }
  }

  .selected-plan {
    box-shadow: 2px 2px 8px #fb729966, -2px -2px 8px #fb729966;
    @include useTheme {
      background-image: linear-gradient(#{getTheme('sv-bg-color')}, #{getTheme('sv-card-color')}),
        linear-gradient(135deg, #ff75c3, #ffa647, #ffe83f, #9fff5b, #70e2ff, #cd93ff);
    }
  }

  .selected-way {
    box-shadow: 2px 2px 8px #39c5bbaa, -2px -2px 8px #39c5bbaa;
  }

  .pay-footer {
    z-index: 99999;
    @include useTheme {
      background-color: #{getTheme('sv-card-color')};
    }
  }
}
</style>
