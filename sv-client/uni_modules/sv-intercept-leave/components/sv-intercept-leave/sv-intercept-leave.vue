<template>
  <!-- #ifdef MP-WEIXIN -->
  <!-- 微信小程序使用page-container方式拦截返回 -->
  <page-container
    :show="showPageContainer"
    :duration="false"
    :overlay="false"
    @beforeleave="beforeleave"
  ></page-container>
  <!-- #endif -->
</template>

<script>
export default {
  props: {
    tip: {
      type: String,
      default: '确定返回吗？'
    }
  },
  data() {
    return {
      showPageContainer: true,
      quitFlag: true
    }
  },
  created() {
    // #ifndef MP-WEIXIN
    uni.addInterceptor('navigateBack', {
      invoke: () => {
        if (this.quitFlag) {
          uni.showModal({
            title: '系统提示',
            content: this.tip,
            showCancel: true,
            success: ({ confirm }) => {
              if (confirm) {
                this.quitFlag = false
                this.$emit('beforeleave')
                uni.navigateBack({ delta: 1 })
                return false
              }
            }
          })
          return false
        }
      },
      complete: () => {
        // 删除拦截器
        uni.removeInterceptor('navigateBack')
      }
    })
    // #endif
  },
  methods: {
    beforeleave() {
      this.showPageContainer = false // 必须先隐藏page-container
      uni.showModal({
        title: '系统提示',
        content: this.tip,
        showCancel: true,
        success: ({ confirm }) => {
          if (confirm) {
            this.$emit('beforeleave')
            uni.navigateBack({ delta: 1 })
          } else {
            this.showPageContainer = true
          }
        }
      })
    }
  }
}
</script>

<style></style>
