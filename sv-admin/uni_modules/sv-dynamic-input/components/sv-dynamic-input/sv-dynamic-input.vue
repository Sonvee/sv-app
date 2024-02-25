<template>
  <view class="sv-dynamic-input" :style="{ '--dynamic-input-size': svSize }">
    <view class="row-item" v-for="(item, index) in dynamicList" :key="index">
      <view :style="{ minWidth: labelWidth, textAlign }">{{ lableText }}</view>
      <input type="text" class="input" v-model="item[lableKey]" :placeholder="keyPlaceholder" />
      <view class="divider"></view>
      <view :style="{ minWidth: labelWidth, textAlign }">{{ valueText }}</view>
      <input type="text" class="input" v-model="item[valueKey]" :placeholder="valuePlaceholder" />
      <view class="divider"></view>
      <view class="control">
        <view class="control-add" :class="{ disable: bandAdd }" @click="addRow(index)">＋</view>
        <view class="control-delete" :class="{ disable: bandDelete }" @click="deleteRow(index)">
          －
        </view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
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
  },
  // #ifdef VUE2
  model: {
    prop: 'data',
    event: 'change'
  },
  // #endif
  data() {
    return {
      dynamicList: [],
      bandAdd: false,
      bandDelete: false
    }
  },
  computed: {
    svSize() {
      return this.size == 'small' ? '12px' : this.size == 'large' ? '16px' : '14px'
    }
  },
  watch: {
    data: {
      immediate: true,
      deep: true,
      handler(newVal) {
        this.dynamicList = this.handleData(newVal)
      }
    },
    dynamicList: {
      immediate: true,
      deep: true,
      handler(newVal) {
        if (newVal.length >= this.maxRow) {
          this.bandAdd = true
          this.bandDelete = false
        } else if (newVal.length > this.minRow && newVal.length < this.maxRow) {
          this.bandAdd = false
          this.bandDelete = false
        } else {
          this.bandAdd = false
          this.bandDelete = true
        }
        this.$emit('update:data', newVal)
        this.$emit('change', newVal)
      }
    }
  },
  methods: {
    addRow(index) {
      if (this.dynamicList.length < this.maxRow) {
        const emptyObj = {}
        emptyObj[this.lableKey] = ''
        emptyObj[this.valueKey] = ''
        this.dynamicList.splice(++index, 0, emptyObj)
      }
    },
    deleteRow(index) {
      if (this.dynamicList.length > this.minRow) {
        this.dynamicList.splice(index, 1)
      }
    },
    /**
     * 将数组或对象转换为标准数组
     * @param {Object} e 对象或标准数组[{key:'a', value:'1'},{key:'b', value:'2'}...]
     * @return 标准数组[{key:'a', value:'1'},{key:'b', value:'2'}...]
     */
    handleData(e) {
      return Array.isArray(e)
        ? e
        : Object.entries(e).map(([key, value]) => {
            const newObj = {}
            newObj[this.lableKey] = key
            newObj[this.valueKey] = value
            return newObj
          })
    },
    /**
     * 将标准数组转换为对象
     * @param {Object} arr 标准数组[{key:'a', value:'1'},{key:'b', value:'2'}...]
     * @return 对象{a:'1',b:'2',...}
     */
    handleMap(arr) {
      // return arr.reduce((acc, cur) => {
      //   acc[cur.key] = cur.value
      //   return acc
      // }, {})
      return Object.fromEntries(arr.map((obj) => [obj[this.lableKey], obj[this.valueKey]]))
    }
  }
}
</script>

<style>
.sv-dynamic-input {
  font-size: var(--dynamic-input-size);
}

.row-item {
  display: flex;
  align-items: center;
  margin-bottom: calc(var(--dynamic-input-size) / 2);
}

.divider {
  min-width: 4%;
}

.control {
  height: calc(var(--dynamic-input-size) * 2);
  display: flex;
  border: 1px solid #cccccc;
  border-radius: 4px;
}

.control-add,
.control-delete {
  flex-grow: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 calc(var(--dynamic-input-size) / 2);
  font-family: 'Lucida Console', Consolas, 'Courier New', Courier, monospace;
  cursor: pointer;
  user-select: none;
}

.control-add:active,
.control-delete:active {
  opacity: 0.8;
}

.control-add {
  border-right: 1px solid #cccccc;
}

.disable {
  background-color: rgba(120, 120, 120, 0.2);
  opacity: 0.3;
  border: none;
  cursor: no-drop;
}

.input {
  border: 1px solid #cccccc;
  height: calc(var(--dynamic-input-size) * 2);
  padding: 0 calc(var(--dynamic-input-size) / 2);
  border-radius: 4px;
  font-size: inherit;
}
</style>
