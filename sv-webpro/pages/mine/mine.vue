<template>
  <view class="mine page flex-col align-center justify-center">
    我的
    <button @click="toSet">设置</button>
  </view>
</template>

<script>
export default {
  data() {
    return {}
  },
  methods: {
    toSet() {
      this.$router.push('/pages/mine/setting')
    }
  }
}
</script>

<style lang="scss">
.mine {
  width: 100%;
  height: 100%;
}
</style>
