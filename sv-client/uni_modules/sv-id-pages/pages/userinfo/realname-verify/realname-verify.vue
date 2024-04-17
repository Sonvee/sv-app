<template>
  <view class="sv-id-pages sv-id-realname-verify">暂未开放</view>
</template>

<script>
import mixin from '@/uni_modules/sv-id-pages/common/login-page.mixin.js'
import checkIdCard from '@/uni_modules/sv-id-pages/common/check-id-card.js'
import { store, mutations } from '@/uni_modules/sv-id-pages/common/store.js'
const uniIdCo = uniCloud.importObject('uni-id-co')

export default {
  mixins: [mixin],
  data() {
    return {}
  },
  computed: {
    userInfo() {
      return store.userInfo
    }
  },
  onLoad() {},
  methods: {}
}
</script>

<style lang="scss">
.sv-id-realname-verify {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
