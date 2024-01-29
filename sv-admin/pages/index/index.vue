<template>
  <view class="page-container index-page">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="16">
        <view class="index-row-1 flex-vc card">
          <el-avatar :size="100" shape="square" :src="authInfo?.avatar_file?.url" />
          <view class="flex-col-vc" style="height: 100%; flex: 1; justify-content: space-evenly; padding-left: 10px">
            <view class="text-line-1 hello">{{ authInfo?.username }} {{ getNowTimeName(true) }}! 欢迎回来 ~</view>
            <view class="text-line-3 hello-sub">
              &emsp;&emsp;本框架自2023.10.22日开始新建文件夹到现在，依然还有很多需要完善的地方，也与sv-client客户端、sv-service管理端框架，在
              <a href="https://gitee.com/Sonve/sv-app" target="_blank" class="link">Gitee</a>
              与
              <a href="https://ext.dcloud.net.cn/plugin?id=15434" target="_blank" class="link">uniapp插件市场</a>
              同步开源，希望能够在大家的支持下不断进步完善，谢谢♪(･ω･)ﾉ
            </view>
          </view>
        </view>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="8">
        <view class="index-row-1 card flex" style="justify-content: space-evenly">
          <a href="https://uniapp.dcloud.net.cn" target="_blank">
            <image
              class="title-image"
              src="/static/logo.png"
              mode="heightFix"
              title="uniapp"
            ></image>
          </a>
          <a href="https://uniapp.dcloud.net.cn/uniCloud" target="_blank">
            <image
              class="title-image"
              src="/static/logo.png"
              mode="heightFix"
              title="unicloud"
            ></image>
          </a>
          <a href="https://cn.vuejs.org" target="_blank">
            <image
              class="title-image"
              src="/static/logo.png"
              mode="heightFix"
              title="vue3"
            ></image>
          </a>
          <a href="https://element-plus.gitee.io/zh-CN" target="_blank">
            <image
              class="title-image"
              style="margin-right: 0"
              src="/static/logo.png"
              mode="heightFix"
              title="element-plus"
            ></image>
          </a>
        </view>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <view class="index-row-2 card">
          <el-carousel trigger="click" height="260px">
            <el-carousel-item v-for="item in 4" :key="item">
              <view class="flex-vhc" style="width: 100%; height: 100%">
                {{ item }}
              </view>
            </el-carousel-item>
          </el-carousel>
        </view>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="14">
        <view class="index-row-3 card">
          <view class="theme-test flex-vhc">主题配色测试块</view>
        </view>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="10">
        <view class="index-row-3 card">
          <view class="donate-title">捐赠支持</view>
          <view class="flex" style="justify-content: space-evenly; padding: 10px 0">
            <image
              class="pay-image"
              src="https://mp-0ecede5c-a993-48bf-ba4b-45d9a8c7e79b.cdn.bspapp.com/pay/pay-ali.jpg"
            ></image>
            <image
              class="pay-image"
              src="https://mp-0ecede5c-a993-48bf-ba4b-45d9a8c7e79b.cdn.bspapp.com/pay/pay-wx.jpg"
            ></image>
          </view>
          <view class="flex-hc">
            <view class="glitch-text" data-glitch="求求一杯咖啡吧 ~">求求一杯咖啡吧 ~</view>
          </view>
        </view>
      </el-col>
    </el-row>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { getNowTimeName } from '@/utils/util'

const authInfo = computed(() => getApp().$svIdPagesStore.store.userInfo)
</script>

<style lang="scss">
.index-page {
  .index-row-1 {
    height: 120px;
    padding: 10px;
  }

  .index-row-2 {
    height: 280px;
    padding: 10px;
  }

  .index-row-3 {
    height: 400px;
    padding: 10px;
  }
}

.el-col {
  margin-bottom: 10px;
}

.title-image {
  height: 100%;
  margin-right: 10px;
}

.hello {
  font-size: 20px;
  font-weight: 700;
  color: $uni-color-primary;
}

.hello-sub {
  font-size: 14px;
  @include useTheme {
    color: getTheme('sv-text-sub-color');
  }
}

.link {
  color: $uni-color-primary;
}

.donate-title {
  width: 100%;
  height: 30px;
  color: #999999;
  font-size: 14px;
  @include useTheme {
    border-bottom: 1px solid #{getTheme('sv-border-color')};
  }
}
.pay-image {
  width: 300px;
  height: 300px;
}

.theme-test {
  width: 200px;
  height: 200px;
  @include useTheme {
    background: getTheme('sv-bg-color');
    color: getTheme('sv-text-color');
    border: 1px solid #{getTheme('sv-border-color')};
  }
}
</style>
