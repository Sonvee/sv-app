<template>
  <view class="sv-dynamic-input">
    <view class="row-item" v-for="(item, index) in dynamicList" :key="index">
      <view :style="{ minWidth: labelWidth }">key</view>
      <input type="text" class="input" v-model="item.key" />
      <view class="divider"></view>
      <view :style="{ minWidth: labelWidth }">value</view>
      <input type="text" class="input" v-model="item.value" />
      <view class="divider"></view>
      <view class="control">
        <view class="control-add" :class="{ disable: bandAdd }" @click="addRow(index)">＋</view>
        <view class="control-delete" :class="{ disable: bandDelete }" @click="deleteRow(index)">－</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
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
  },
  data() {
    return {
      dynamicList: [],
      bandAdd: false,
      bandDelete: false
    }
  },
  mounted() {},
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
      }
    }
  },
  methods: {
    addRow(index) {
      if (this.dynamicList.length < this.maxRow) {
        this.dynamicList.splice(++index, 0, { key: '', value: '' })
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
      return Array.isArray(e) ? e : Object.entries(e).map(([key, value]) => ({ key, value }))
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
      return Object.fromEntries(arr.map((obj) => [obj.key, obj.value]))
    }
  }
}
</script>

<style>
.sv-dynamic-input {
}

.row-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.divider {
  min-width: 4%;
}

.control {
  height: 28px;
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
  padding: 0 10px;
  font-family: 'Lucida Console', Consolas, 'Courier New', Courier, monospace;
  cursor: pointer;
  user-select: none;
}

.control-add:active,
.control-delete:active {
  background-color: #f6f6f6;
}

.control-add {
  border-right: 1px solid #cccccc;
}

.disable {
  background-color: #f6f6f6;
  opacity: 0.3;
  border: none;
  cursor: no-drop;
}

.input {
  border: 1px solid #cccccc;
  height: 32px;
  padding: 0 10px;
  border-radius: 4px;
  font-size: inherit;
  color: #606266;
}
</style>
