<template>
  <sv-page showTabBar>
    <view class="home">
      <!-- #ifdef APP -->
      <ad-rewarded-video
        adpid="1077020713"
        :loadnext="true"
        v-slot:default="{ loading, error }"
        @load="onadload"
        @close="onadclose"
        @error="onaderror"
      >
        <!-- 可以是button  img等等 -->
        <button type="primary" :disabled="loading" :loading="loading">显示广告（组件语法）</button>
        <view v-if="error">{{ error }}</view>
      </ad-rewarded-video>
      <!-- #endif -->
    </view>
  </sv-page>
</template>

<script setup>
function onadload(e) {
  console.log('广告数据加载成功', e)
}
function onadclose(e) {
  const detail = e.detail
  // 用户点击了【关闭广告】按钮
  if (detail && detail.isEnded) {
    // 正常播放结束
    console.log('onadclose ' + detail.isEnded)
  } else {
    // 播放中途退出
    console.log('onadclose ' + detail.isEnded)
  }
}
function onaderror(e) {
  // 广告加载失败
  console.log('onaderror: ', e.detail)
}
</script>

<style lang="scss">
.home {
  min-height: var(--page-main-height);
}
</style>
