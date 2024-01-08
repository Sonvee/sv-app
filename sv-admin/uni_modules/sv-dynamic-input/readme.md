# sv-dynamic-input

### props

```
props: {
  // 原数据
  data: {
    type: [Array, Object],
    default: () => {
      return [{ key: '', value: '' }]
    }
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