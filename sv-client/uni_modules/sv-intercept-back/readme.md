# sv-intercept-back

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
3. 安卓app（ios未测试）
4. 微信小程序

## 使用方式

```
<template>
  <view class="next">
    <button @click="onback">点击返回</button>
    <button @click="onleave">直接返回</button>
    <sv-intercept-back
      :show="interceptFlag"
      @backConfirm="backConfirm"
      @backCancel="backCancel"
    ></sv-intercept-back>
  </view>
</template>

<script>
export default {
  data() {
    return {
      interceptFlag: true
    }
  },
  methods: {
    onback() {
      uni.navigateBack()
    },
    backConfirm() {
      console.log('==== backConfirm :')
    },
    backCancel() {
      console.log('==== backCancel :')
    },
    onleave() {
      this.interceptFlag = false
      // 添加一个短暂的延时
      setTimeout(() => {
        uni.navigateBack()
      }, 100)
    }
  }
}
</script>
```

## 参数事件

```
props: {
  content: {
    type: String,
    default: '确定返回吗？'
  },
  title: {
    type: String,
    default: '系统提示？'
  },
  // 是否开启拦截
  show: {
    type: Boolean,
    default: true
  }
}

事件:
backConfirm 确认返回触发
backCancel 取消返回触发
```

## 注意
1. 很抱歉，该插件暂不能只针对某一种返回方式做单独处理，比如只想拦截uni.navigateBack而不拦截物理按键返回，暂时无法做这种区分，故该插件暂时只做统一的返回拦截。
2. 在uniapp的页面生命周期中有个[onBackPress](https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle)，若只想做页面单独处理返回来源是backbutton(按键返回)还是navigateBack的话，可以参考官方的这个[onBackPress](https://uniapp.dcloud.net.cn/tutorial/page.html#lifecycle)生命周期，但是貌似局限性会蛮大的，本人未仔细研究过，只能祝开发顺利了。

## 写在最后
若对插件有任何疑问或者优化建议，欢迎在评论区留言，在插件市场中的私信消息本人可能不经常留意，导致没能及时回复，
可以加入本人的插件问答QQ交流群: 852637893，欢迎进群交流。

<img width="200" src="https://mp-0ecede5c-a993-48bf-ba4b-45d9a8c7e79b.cdn.bspapp.com/resource/qqqun.jpg" alt="交流群:852637893"/>
