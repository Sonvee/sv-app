<template>
  <!-- #ifdef MP-WEIXIN -->
  <!-- 微信小程序使用page-container方式拦截返回 -->
  <page-container
    :show="showPageContainer"
    :duration="false"
    :overlay="false"
    @beforeleave="beforeBack"
  ></page-container>
  <!-- #endif -->
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: '确定返回吗？'
    },
    title: {
      type: String,
      default: '系统提示'
    },
    // 是否开启拦截
    show: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      showPageContainer: true,
      quitFlag: true
    }
  },
  watch: {
    show: {
      handler(newVal) {
        // #ifndef MP-WEIXIN
        if (newVal) {
          this.interceptBack()
        } else {
          uni.removeInterceptor('navigateBack')
        }
        // #endif

        // #ifdef MP-WEIXIN
        this.showPageContainer = newVal
        // #endif
      },
      immediate: true
    }
  },
  methods: {
    // APP、H5拦截返回
    interceptBack() {
      uni.addInterceptor('navigateBack', {
        invoke: () => {
          if (this.quitFlag) {
            uni.showModal({
              title: this.title,
              content: this.content,
              showCancel: true,
              success: ({ confirm }) => {
                if (confirm) {
                  this.quitFlag = false
                  this.$emit('backConfirm')
                  uni.navigateBack({ delta: 1 })
                  return false
                } else {
                  this.$emit('backCancel')
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
    },
    // 微信小程序拦截返回
    beforeBack() {
      if(!this.show) return
      this.showPageContainer = false // 必须先隐藏page-container

      uni.showModal({
        title: this.title,
        content: this.content,
        showCancel: true,
        success: ({ confirm }) => {
          if (confirm) {
            this.$emit('backConfirm')
            uni.navigateBack({ delta: 1 })
          } else {
            this.$emit('backCancel')
            this.showPageContainer = true
          }
        }
      })
    }
  }
}
</script>

<style></style>
