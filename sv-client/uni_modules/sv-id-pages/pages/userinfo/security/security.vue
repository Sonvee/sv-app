<template>
  <sv-page>
    <view class="security">
      <uni-list>
        <uni-list-item title="修改密码" link @click="onChangePwd" />
        <uni-list-item title="注销账号" link @click="onDeactivate" />
      </uni-list>
    </view>
  </sv-page>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    onChangePwd() {
      uni.navigateTo({
        url: '/uni_modules/sv-id-pages/pages/userinfo/change-pwd/change-pwd'
      })
    },
    onDeactivate() {
      uni.navigateTo({
        url: '/uni_modules/sv-id-pages/pages/userinfo/deactivate/deactivate'
      })
    }
  }
}
</script>

<style lang="scss">
.security {
}
</style>
