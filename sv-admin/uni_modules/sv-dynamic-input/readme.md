# sv-dynamic-input

### props

```
props: {
  // 尺寸
  size: {
    type: String,
    default: 'default' // small | default | large
  },
  // 原数据
  data: {
    type: [Array, Object],
    default: () => []
  },
  // 自定义key键名字段
  lableKey: {
    type: String,
    default: 'key'
  },
  // 自定义key键名名称
  lableText: {
    type: String,
    default: '键名'
  },
  // 自定义value键值字段
  valueKey: {
    type: String,
    default: 'value'
  },
  // 自定义value键值名称
  valueText: {
    type: String,
    default: '键值'
  },
  // 对齐方式
  textAlign: {
    type: String,
    default: 'center'
  },
  // 标题宽度
  labelWidth: {
    type: String,
    default: '40px'
  },
  // 最小行数
  minRow: {
    type: Number,
    default: 1
  },
  // 最大行数
  maxRow: {
    type: Number,
    default: 999
  },
  keyPlaceholder: {
    type: String,
    default: '请输入键名'
  },
  valuePlaceholder: {
    type: String,
    default: '请输入键值'
  }
}

```

### 使用

```
<sv-dynamic-input v-model:data="dict_data" @change="changeValue"></sv-dynamic-input>

事件
changeValue(e) 在内容改变时触发
参数e：当前内容
```


## 写在最后
若对插件有任何疑问或者优化建议，欢迎在评论区留言，在插件市场中的私信消息本人可能不经常留意，导致没能及时回复，
可以加入本人的插件问答QQ交流群: 852637893，欢迎进群交流。

<img width="200" src="https://mp-0ecede5c-a993-48bf-ba4b-45d9a8c7e79b.cdn.bspapp.com/resource/qqqun.jpg" alt="交流群:852637893"/>
