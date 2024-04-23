<template>
  <z-paging
    v-model="dataList"
    ref="paging"
    :fixed="options.fixed"
    :use-virtual-list="options.useVirtualList"
    :cell-height-mode="options.cellHeightMode"
    :default-page-size="options.pageSize"
    :preload-page="options.preloadPage"
    :use-compatibility-mode="options.useCompatibilityMode"
    :auto-show-back-to-top="options.autoShowBackToTop"
    :back-to-top-threshold="options.backToTopThreshold"
    :back-to-top-img="options.backToTopImg"
    :back-to-top-bottom="options.backToTopBottom"
    @query="queryList"
    @innerCellClick="innerCellClick"
    @onRefresh="onRefresh"
  >
    <!-- 虚拟列表写法 -->
    <template v-if="options.useVirtualList" #cell="{ item, index }">
      <slot :data="{ item, index }">
        <view class="sv-list-item">
          index:{{ index }} - item:{{ item?.text }} ; {{ item?.value }}
        </view>
      </slot>
    </template>
    <!-- 普通列表写法，注意此处无法v-else，会报错 -->
    <template v-if="!options.useVirtualList">
      <view v-for="(item, index) in dataList" :key="index">
        <slot :data="{ item, index }">
          <!-- 普通列表的点击事件自行在插槽中处理 -->
          <view class="sv-list-item">
            index:{{ index }} - item:{{ item?.text }} ; {{ item?.value }}
          </view>
        </slot>
      </view>
    </template>
  </z-paging>
</template>

<script>
import { testList } from '@/api/test'
export default {
  name: 'sv-paging',
  props: {
    // z-paging部分常见的配置
    opt: {
      type: Object,
      default: () => {}
    },
    // 要请求的列表api
    apiFunc: {
      type: Function
    },
    // 要请求的列表api的筛选参数
    apiParams: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {
      defaultOpt: {
        fixed: false,
        pageSize: 20,
        preloadPage: 1, // 预加载的列表可视范围(列表高度)页数，即预加载当前页及上下各几页
        useVirtualList: false, // 默认关闭虚拟列表
        useCompatibilityMode: false, // 开启虚拟列表兼容模式
        cellHeightMode: 'fixed', // 高度模式 fixed / dynamic
        autoShowBackToTop: true,
        backToTopThreshold: '400rpx', // 滚动显示阈值
        backToTopImg: '/static/icons/top-fill.png',
        backToTopBottom: '80rpx' // 返回顶部按钮与底部的距离
      },
      dataList: []
    }
  },
  computed: {
    options() {
      // 合并处理
      return Object.assign({ ...this.defaultOpt }, this.opt)
    }
  },
  methods: {
    async queryList(pageNo, pageSize) {
      try {
        // apiFunc在props中设置default会导致Vue2版App真机中不兼容报错
        const apiRes = await (this.apiFunc ?? testList)({
          pagesize: pageSize,
          pagenum: pageNo,
          ...this.apiParams
        })
        this.$refs.paging.complete(apiRes.data)
        this.$emit('apiQuery', apiRes)
      } catch (e) {
        this.$refs.paging.complete(false)
      }
    },
    innerCellClick(e) {
      // 虚拟列表内置的item点击方法，也可自行在插槽中处理点击事件
      this.$emit('e-inner-cell-click', e)
    },
    // 列表重载 - 需要重新筛选请求列表时调用
    reload() {
      this.$refs.paging.reload()
    },
    onRefresh() {
      this.$emit('refreshOK')
    }
  }
}
</script>

<style scoped>
.sv-list-item {
  border: 1px solid #66ccff;
  padding: 24rpx;
  box-sizing: border-box;
  margin-bottom: 24rpx;
}
</style>
