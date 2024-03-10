<template>
  <sv-page>
    <view class="vip">
      <!-- 头部 -->
      <view class="padding">
        <view class="header w-full radius-lg flex padding-sm">
          <view class="cu-avatar round lg">
            <image
              class="w-h-full"
              v-if="userInfo?.avatar_file?.url"
              :src="userInfo.avatar_file.url"
            ></image>
            <text v-else class="cuIcon-my"></text>
          </view>
          <view class="flex-sub margin-left flex-col justify-around">
            <view class="text-bold text-lg">
              {{ userInfo.nickname }}
            </view>
            <view class="text-sm text-cyan">VIP已于2024-03-01过期</view>
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
      <uv-skeletons class="padding-lr" :loading="loading" :skeleton="skeleton">
        <uv-scroll-list class="sv-uv-scroll-list" :indicator="false">
          <view v-for="item in planList" :key="item.name">
            <view
              class="plan-item margin radius-lg"
              :class="[curPlan?.name == item.name ? 'selected-plan' : '']"
              @click="selectPlan(item)"
            >
              {{ item.name }}
            </view>
          </view>
        </uv-scroll-list>
      </uv-skeletons>
      <!-- 特权 -->
      <view class="cu-bar">
        <view class="action sub-title">
          <text class="text-lg text-bold text-tyblue">会员特权</text>
          <text class="text-sm text-ABC text-tyblue">privilege</text>
        </view>
      </view>
      <view class="sv-grid grid-col-5 padding-lr-sm">
        <view
          class="grid-item-xl flex-col align-center justify-evenly"
          v-for="item in privilegeList"
          :key="item.lable"
        >
          <text class="text-sl" :class="item.value"></text>
          <text class="text-sm">{{ item.lable }}</text>
        </view>
      </view>
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
          <uv-radio name="unionpay" label="银联">
            <view class="padding-tb-sm text-red">
              <text class="sv-icons-unionpay margin-right-xs text-lg" style="width: 1.6em"></text>
              <text>银联</text>
            </view>
          </uv-radio>
        </uv-radio-group>
      </view>
      <view class="padding-lr" v-else>
        <uni-easyinput v-model.trim="cdkey" placeholder="请输入CDKEY"></uni-easyinput>
        <button class="margin-top w-full cu-btn bg-gradual-pink" @click="confirmCdkey">
          确定激活
        </button>
      </view>
      <!-- 底部栏 -->
      <view v-if="payWay == 'wallet'" class="pay-footer cu-bar tabbar border foot">
        <view class="h-full padding-lr-sm flex-col justify-evenly">
          <view class="text-bold text-red" @click="onFold">
            <text class="text-xxl text-price">{{ money }}</text>
            <text class="text-sm margin-left-xs">
              已优惠
              <text class="text-price">{{ curPlan?.discount || 0 }}</text>
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
            <text @click="onProtocol('auto-pay')">自动续费</text>
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
            <text>{{ curPlan?.name }} VIP</text>
            <text class="text-red text-bold text-lg text-price">{{ curPlan?.price }}</text>
          </view>
          <view class="text-bold text-lg">优惠</view>
          <view class="flex justify-between line-height-3">
            <text>促销折扣</text>
            <text class="text-orange text-bold text-lg text-price">{{ curPlan?.discount }}</text>
          </view>
          <view class="text-bold text-lg">结算</view>
          <view class="flex justify-between line-height-3">
            <text>支付金额</text>
            <text class="text-green text-bold text-lg text-price">{{ money }}</text>
          </view>
        </view>
        <view class="tabbar-placehoder"></view>
      </uv-popup>
    </view>
  </sv-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { store } from '@/uni_modules/sv-id-pages/common/store'
import { vipList } from '@/service/api/svid'
import { isEmpty } from 'lodash-es'

const userInfo = computed(() => {
  return store.userInfo
})

const loading = ref(true)
const planList = ref([])
const curPlan = ref()

const money = computed(() => {
  return curPlan.value?.price - curPlan.value?.discount || 0
})

const readed = ref([''])

function onProtocol(e) {
  console.log('==== onProtocol :', e)
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

const skeleton = [
  {
    type: 'flex',
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
      },
      {
        type: 'custom',
        style: 'width:200rpx;height:240rpx;margin:30rpx;'
      }
    ]
  }
]

getVipList()

function getVipList() {
  vipList().then((res) => {
    planList.value = res.data || []
    loading.value = false
    console.log('==== planList.value :', planList.value)
  })
}

function selectPlan(e) {
  curPlan.value = e
}

const privilegeList = ref([
  {
    lable: '特权甲',
    value: 'cuIcon-comment'
  },
  {
    lable: '特权乙',
    value: 'cuIcon-comment'
  },
  {
    lable: '特权丙',
    value: 'cuIcon-comment'
  },
  {
    lable: '特权丁',
    value: 'cuIcon-comment'
  },
  {
    lable: '特权戊',
    value: 'cuIcon-comment'
  }
])

const payWay = ref('wallet') // wallet cdkey

function toggleWay(e) {
  payWay.value = e
}

const paySelect = ref('wxpay') // wxpay alipay

function onPay() {
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
  console.log('==== 支付方式 :', paySelect.value)
  console.log('==== 选择套餐 :', curPlan.value)
}

const cdkey = ref('')

function confirmCdkey() {
  // CDKEY校验
  if (!cdkey.value) {
    uni.showToast({
      title: '请输入正确的CDKEY',
      icon: 'none'
    })
  }
  console.log('==== cdkey :', cdkey.value)
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
    border: 1px solid #ccc;
  }

  .selected-plan {
    box-shadow: 2px 2px 8px #fb7299aa, -2px -2px 8px #fb7299aa;
  }

  .selected-way {
    box-shadow: 2px 2px 8px #39c5bbaa, -2px -2px 8px #39c5bbaa;
  }

  .pay-footer {
    @include useTheme {
      background-color: #{getTheme('sv-card-color')};
    }
  }
}
</style>
