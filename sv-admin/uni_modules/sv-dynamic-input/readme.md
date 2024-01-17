# sv-dynamic-input

### props

```
props: {
  // 原数据
  data: {
    type: [Array, Object],
    default: () => []
  },
  // 自定义key键名
  lableKey: {
    type: String,
    default: 'key'
  },
  // 自定义key名称
  lableText: {
    type: String,
    default: '键'
  },
  // 自定义value键名
  valueKey: {
    type: String,
    default: 'value'
  },
  // 自定义value名称
  valueText: {
    type: String,
    default: '值'
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
  }
}

```

### 使用

```
<sv-dynamic-input v-model:data="dict_data"></sv-dynamic-input>
```