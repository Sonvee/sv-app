<template>
  <view class="page-container index-page">
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="16">
        <view class="index-row-1 flex-vc card">
          <el-avatar
            class="sv-el-avatar"
            :size="100"
            shape="square"
            :src="authInfo?.avatar_file?.url"
          />
          <view
            class="flex-col-vc"
            style="height: 100%; flex: 1; justify-content: space-evenly; padding-left: 10px"
          >
            <view class="text-line-1 hello sv-text-streamer">
              {{ authInfo?.nickname }} {{ getNowTimeName(true) }}! 欢迎回来 ~
            </view>
            <view class="text-line-3 hello-sub">
              &emsp;&emsp;本框架自2023.10.22日开始新建文件夹到现在，依然还有很多需要完善的地方，也与sv-client客户端、sv-service管理端框架，在
              <a href="https://gitee.com/Sonve/sv-app" target="_blank" class="link">Gitee</a>
              与
              <a href="https://ext.dcloud.net.cn/publisher?id=1173575" target="_blank" class="link">
                uniapp插件市场
              </a>
              同步开源，希望能够在大家的支持下不断进步完善，谢谢♪(･ω･)ﾉ
            </view>
          </view>
        </view>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="8">
        <view class="index-row-1 card flex" style="justify-content: space-evenly">
          <a class="flex-vhc" href="https://uniapp.dcloud.net.cn" target="_blank">
            <text class="text-green text-xsl sv-icons-uni-app-square"></text>
          </a>
          <a class="flex-vhc" href="https://uniapp.dcloud.net.cn/uniCloud" target="_blank">
            <text class="text-olive text-xsl sv-icons-cloud-code"></text>
          </a>
          <a class="flex-vhc" href="https://cn.vuejs.org" target="_blank">
            <text class="text-brown text-xsl sv-icons-vue"></text>
          </a>
          <a class="flex-vhc" href="https://element-plus.gitee.io/zh-CN" target="_blank">
            <text class="text-blue text-xsl sv-icons-element-ui"></text>
          </a>
        </view>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24">
        <view class="index-row-2 card flex-col">
          <view class="card-title">柱状图</view>
          <view class="flex-sub">
            <qiun-data-charts type="column" :chartData="barChartData" />
          </view>
        </view>
      </el-col>
    </el-row>
    <el-row :gutter="10">
      <el-col :xs="24" :sm="24" :md="24" :lg="10" :xl="14">
        <view class="index-row-3 card flex-col">
          <view class="card-title">饼图</view>
          <view class="flex-sub">
            <qiun-data-charts type="pie" :chartData="pieChartData"></qiun-data-charts>
          </view>
        </view>
      </el-col>
      <el-col :xs="24" :sm="24" :md="24" :lg="14" :xl="10">
        <view class="index-row-3 card flex-col">
          <view class="card-title">条状图</view>
          <view class="flex-sub">
            <qiun-data-charts type="bar" :opts="{ xAxis: { max: 40 } }" :chartData="barChartData" />
          </view>
        </view>
      </el-col>
    </el-row>
  </view>
</template>

<script setup>
import { ref, computed } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import { getNowTimeName } from '@/utils/util'

const authInfo = computed(() => getApp().$svIdPagesStore.store.userInfo)

const barChartData = ref()
const pieChartData = ref()

onLoad(() => {
  setTimeout(() => {
    barChartData.value = {
      categories: ['2016', '2017', '2018', '2019', '2020', '2021'],
      series: [
        {
          name: '目标值',
          data: [35, 36, 31, 33, 13, 34]
        },
        {
          name: '完成量',
          data: [18, 27, 21, 24, 6, 28]
        }
      ]
    }

    pieChartData.value = {
      series: [
        {
          data: [
            {
              name: '一班',
              value: 50
            },
            {
              name: '二班',
              value: 30
            },
            {
              name: '三班',
              value: 20
            },
            {
              name: '四班',
              value: 18
            },
            {
              name: '五班',
              value: 8
            }
          ]
        }
      ]
    }
  }, 2000)
})
</script>

<style lang="scss">
.index-page {
  .index-row-1 {
    height: 120px;
    padding: 10px;
  }

  .index-row-2 {
    height: 300px;
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
    color: getTheme('sv-admin-text-sub-color');
  }
}

.link {
  color: $uni-color-primary;
}

.card-title {
  width: 100%;
  height: 30px;
  color: #999999;
  font-size: 14px;
  @include useTheme {
    border-bottom: 1px solid #{getTheme('sv-admin-border-color')};
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
    background: getTheme('sv-admin-bg-color');
    color: getTheme('sv-admin-text-color');
    border: 1px solid #{getTheme('sv-admin-border-color')};
  }
}
</style>
