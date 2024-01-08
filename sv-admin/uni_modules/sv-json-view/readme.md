# sv-json-view

### 写在前面
本组件用于对json格式数据进行格式化可视化展示，基于[vue3-json-view](https://ext.dcloud.net.cn/plugin?id=14247)组件改

### 改动内容
1. 优化完善其uni_modules规范，无需导入，直接使用
2. 解决部分场景下的警告报错
3. 添加容错判断，现传json数据、json字符串、普通数字、普通字符串会在内部进行自动处理，无需手动预处理

### props
```
obj: {
  // 添加容错，obj可传值为json数据，json字符串，普通数字，普通字符串
  type: [Object, String, Number],
  default() {
    return {}
  }
},
collapsable: {
  type: Boolean,
  default: true
},
fontSize: {
  type: Number,
  default: 24
},
icon: {
  type: String,
  default: 'arrow' // 可选arrow/plusminus
}
```

### 使用方式
```
<sv-json-view :obj="jsonData" :key="jsonviewKey"></sv-json-view>

// 绑定切换key值以刷新组件，用于动态切换展示的json数据
const jsonviewKey = ref(0)
jsonviewKey.value++ // 手动刷新json-view组件

```