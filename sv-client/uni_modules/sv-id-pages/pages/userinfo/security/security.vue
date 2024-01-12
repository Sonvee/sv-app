<template>
  <view class="security">
    <uni-list>
      <uni-list-item
        title="绑定手机"
        :rightText="userInfo?.mobile || '去绑定'"
        link
        @click="onBindPhone"
      />
      <uni-list-item title="修改密码" link @click="onChangePwd" />
      <uni-list-item title="注销账号" link @click="onDeactivate" />
    </uni-list>
  </view>
</template>

<script>
import { store } from '../../../common/store'
export default {
  data() {
    return {}
  },
  computed: {
    userInfo() {
      return store.userInfo
    }
  },
  methods: {
    onBindPhone() {
      uni.navigateTo({
        url: '/uni_modules/sv-id-pages/pages/userinfo/bind-mobile/bind-mobile'
      })
    },
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
