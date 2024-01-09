# sv-intercept-leave

## 前言
在部分页面，需要在用户确认退出后方能安全返回或退出。

该组件可拦截的返回方式有：

1. 原生导航栏返回
2. uni.navigateBack返回
3. 真机物理按键返回
4. 真机手势滑动返回

算是几乎涵盖了所有返回的方式

已兼容情况：

1. vue2、vue3
2. h5
3. 安卓app（ios真机未测试，如果有小伙伴使用ios测试后，还请在评论区留言）
4. 微信小程序

## 使用方式

```
<template>
  <view class="next">
    <button @click="onback">点击返回</button>
  </view>
  <sv-intercept-leave @beforeleave="beforeleave"></sv-intercept-leave>
</template>

<script setup>
function onback() {
  uni.navigateBack()
}

function beforeleave() {
  console.log('==== 确认返回 beforeleave :')
}
</script>
```

直接一键导入就行了，在需要拦截返回的页面直接使用组件