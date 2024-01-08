<template>
  <view class="container">
    <block v-for="(strObj, index) in dataArray" :key="index">
      <view
        v-if="strObj.show"
        class="line"
        :style="`padding-left: ${strObj.indent}rpx; font-size: ${props.fontSize}rpx;`"
      >
        <text
          v-if="collapsable && strObj.hasChild"
          :data-index="index"
          @longpress="expandAll"
          @tap="doExpand"
          :class="[clsgrp[clstype][strObj.expand]]"
        ></text>
        <view style="display: flex; flex-flow: row">
          <text :class="[strObj.ktype, kidx === index ? 'active' : '', 'key']" @tap="selectk(index)">
            {{ strObj.key }}
          </text>
          <text v-if="strObj.comma">{{ `${strObj.comma}` }}</text>
          <text v-if="strObj.value" :class="[strObj.type, vidx === index ? 'active' : '', 'val']" @tap="selectv(index)">
            {{ strObj.value }}
          </text>
          <text v-if="strObj.tail" class="val">{{ strObj.tail }}</text>
          <block v-if="!!strObj.suffix">
            <text class="val">{{ '...' }}</text>
            <text :class="[strObj.ktype || strObj.type, 'val']">{{ strObj.suffix }}</text>
          </block>
        </view>
      </view>
    </block>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
const props = defineProps({
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
    default: 'arrow'
  }
})
const clstype = ref(['arrow', 'plusminus'].includes(props.icon) ? props.icon : 'plusminus')
const clsgrp = ref({
  arrow: {
    true: 'arrow-down',
    false: 'arrow-right'
  },
  plusminus: {
    true: 'minus',
    false: 'plus'
  }
})
const dataArray = ref([])
const basecode = ref('0123456789abcdefghijklmnopqrstuvwxyz')

/**
 * 判断是否是json字符串
 * @param {Object} str 要检查的字符串
 */
function isJsonString(str) {
  try {
    JSON.parse(str)
  } catch (e) {
    return false
  }
  return true
}
const dataTransform = () => {
  // let str = JSON.stringify(props.obj, null, ' ')
  // 容错判断，obj可传值为json数据，json字符串，普通数字，普通字符串
  let josnstr = isJsonString(props.obj) ? JSON.parse(props.obj) : props.obj
  let str = JSON.stringify(josnstr, null, ' ')
  let pl = 0
  let idn = 0
  // 提取 JSON 字符串中的键值对，其中键是双引号括起来的字符串，值可以是双引号括起来的字符串或其他类型的值
  let reg = /"(.+)"\s*:\s*("?.+"?),?/
  let arr = str
    .split(/\n/g)
    .reverse()
    .map((t) => {
      let res = {
        text: t
      }
      let regRes = reg.exec(t)
      if (regRes) {
        res.key = regRes[1].trim()
        res.value = regRes[2].replace(/,$/, '')
        res.tail = regRes[2] == res.value ? '' : ','
        res.comma = ':'
        if ('{' === res.value) {
          res.type = 'Object'
        } else if ('[' === res.value) {
          res.type = 'Array'
        } else {
          try {
            // 如果存在第二层双引号则字符串
            if (/".*?"/.test(res.value)) {
              res['type'] = 'String'
            } else {
              res['type'] = 'Number'
            }
          } catch (e) {
            console.warn(e)
          }
        }
      } else {
        res.key = t
        res.value = ''
        res.comma = ''
        if (!['{', '}', '[', ']'].includes(t.trim().replace(/,$/, '').replace(/\"/g, ''))) {
          try {
            // 如果存在第二层双引号则字符串
            if (/".*?"/.test(t)) {
              res['ktype'] = 'String'
            } else {
              res['ktype'] = 'Number'
            }
          } catch (e) {
            console.warn(e)
          }
        } else {
          if (t.indexOf(']') > -1 || t.indexOf('[') > -1) {
            res['ktype'] = 'Array'
          } else {
            res['ktype'] = 'Object'
          }
        }
      }
      res.indent = t.search(/[^\s]/) * props.fontSize
      res.hasChild = res.indent < pl
      res.expand = true
      res.show = true
      res.suffix = ''
      pl = res.indent
      return res
    })
  pl = -1
  let pcode = ''

  dataArray.value = arr.reverse().map((item) => {
    const cl = item.indent / props.fontSize
    if (cl > pl) {
      item.treeCode = pcode + basecode.value.charAt(0)
    } else if (cl == pl) {
      var lastIdx = basecode.value.indexOf(pcode.charAt(pcode.length - 1)) + 1
      item.treeCode = pcode.substr(0, pcode.length - 1) + basecode.value.charAt(lastIdx)
    } else {
      item.treeCode = pcode.substr(0, pcode.length - 1)
    }
    pl = cl
    pcode = item.treeCode
    return item
  })
}

dataTransform()
const expandAll = (e) => {
  let index = 0
  if (e) {
    const { index: k } = e.currentTarget.dataset
    index = parseInt(k)
  }
  const code = dataArray.value[index].treeCode
  dataArray.value = dataArray.value.map((item) => {
    if (item.treeCode.startsWith(code)) {
      item.suffix = ''
      item.show = true
      item.expand = true
    }
    return item
  })
}
const getExpandStatus = (code) => {
  return dataArray.value.find((item) => item.treeCode == code).expand
}
const isTail = (idx) => {
  let code = dataArray.value[idx].treeCode
  let index = dataArray.value.findIndex((item) => item.treeCode == code)
  return index < idx
}
const getParentsExpandStatus = (code) => {
  if (code == '0') return true
  let parents = dataArray.value.filter((item) => code.startsWith(item.treeCode) && item.treeCode != code)
  let res = true
  parents.forEach((item) => {
    if (!item.expand) {
      res = false
    }
  })
  return res
}
const print = () => {
  console.log(props.obj)
  console.log(JSON.stringify(props.obj))
}
const doExpand = (e) => {
  let index = 0
  if (e) {
    const { index: k } = e.currentTarget.dataset
    index = parseInt(k)
  }
  let suffixText = ''
  const code = dataArray.value[index].treeCode
  const expand = !dataArray.value[index].expand //点击之后的展开状态
  dataArray.value[index].expand = expand //更新展开状态
  const arr = dataArray.value.map((item, idx) => {
    if (item.treeCode.startsWith(code) && idx != index) {
      //排除本身
      if (!expand) {
        //如果折叠，子项全部隐藏
        item.show = false
      } else {
        //如果展开，子项的尾巴是否显示看他的父级展开状态
        item.show = getParentsExpandStatus(item.treeCode)
      }
      if (item.treeCode == code) {
        // last one
        suffixText = expand ? '' : `${item.text.trim()}`
      }
      // 隐藏结尾的 ] } 等
      if (isTail(idx) && !getExpandStatus(item.treeCode)) {
        item.show = false
      }
    }
    // 处理后缀
    if (item.expand) {
      item.suffix = ''
    }
    return item
  })
  dataArray.value[index].suffix = suffixText
  dataArray.value = arr
}

const vidx = ref(-1)
const kidx = ref(-1)
let vt = 0,
  kt = 0
const selectk = (idx) => {
  vidx.value = idx
  clearTimeout(vt)
  vt = setTimeout(() => {
    vidx.value = -1
  }, 600)
  if (props.collapsable)
    doExpand({
      currentTarget: {
        dataset: {
          index: idx
        }
      }
    })
}
const selectv = (idx) => {
  kidx.value = idx
  clearTimeout(kt)
  kt = setTimeout(() => {
    kidx.value = -1
  }, 600)
}
watch(
  () => props.collapsable,
  (n, o) => {
    if (!n) {
      expandAll()
    }
  }
)
watch(
  () => props.icon,
  (n, o) => {
    if (!!n) {
      clstype.value = ['arrow', 'plusminus'].includes(n) ? n : 'plusminus'
    }
  }
)
defineExpose({
  print,
  doExpand
})
</script>

<style scoped>
.container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  align-content: center;
  justify-content: flex-start;
  box-sizing: border-box;
}

.container .line {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: flex-start;
  width: inherit;
  box-sizing: border-box;
}

text {
  margin: 0 4rpx;
}

.key,
.val {
  height: min-content;
  display: inline-block;
  transition-duration: 0.3s;
  border-bottom: solid 4rpx transparent;
  font-weight: bold;
}

.key.active,
.val.active {
  transition-duration: 0.3s;
  border-bottom: solid 4rpx rgba(255, 90, 20, 0.8);
}

.key {
  color: #95afc0;
}

.val {
  color: #444;
}

.String {
  color: #718093;
}

.Number {
  color: #686de0;
}

.Array {
  color: #8c7ae6;
}

.Object {
  color: #4cd137;
}

.expand {
  display: inline-flex;
  width: 32rpx;
  height: 32rpx;
  padding: 0;
  align-items: center;
  transform: scale(0.8);
  justify-items: center;
  justify-content: center;
  border: solid 1rpx lightgray;
  box-sizing: border-box;
  color: gray;
  font-size: 24rpx;
}

.arrow-right,
.arrow-down {
  display: inline-block;
  width: 40rpx;
  height: 40rpx;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB0PSIxNjkzMTA5NDU3NDQzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE1OTQiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNjQgNTEyYzAgMjQ3LjQyNCAyMDAuNTc2IDQ0OCA0NDggNDQ4czQ0OC0yMDAuNTc2IDQ0OC00NDhTNzU5LjQyNCA2NCA1MTIgNjQgNjQgMjY0LjU3NiA2NCA1MTJ6IiBmaWxsPSIjOTRCRkZGIiBwLWlkPSIxNTk1Ij48L3BhdGg+PHBhdGggZD0iTTUxOS42NiA1MjUuNDRhMTAuNjU0IDEwLjY1NCAwIDAgMS0xNS4zMiAwYy0yMS4xNC0yMS43MTgtODIuOTItODQuOTctMTQ3LjEzNC0xNDguMzc0LTE0LjUwOC0xNC4zMzYtMzUuMTU4LTE5Ljg2LTUxLjQxNC03Ljc0NC02LjY1NiA0Ljk3Mi0xNC4xODYgMTEuNTg0LTIyLjI3MiAyMC4zNTItMTEuMDMgMTEuOTI2LTE4LjM5IDIzLjI5Ni0yMy4yNzQgMzIuNzY4LTguMDIyIDE1LjUxLTMuOTQ4IDMzLjY4NiA2LjIyOCA0Ny43NjYgNzkuNTc0IDExMC4yNSAxNjUuNDg0IDE4NS40MyAyMTEuNjA2IDIyMS44MDIgMjAuMjg4IDE1Ljk4IDQ3LjU1MiAxNS45OCA2Ny44NCAwIDQ2LjEyMi0zNi4zNzIgMTMyLjAzMi0xMTEuNTUyIDIxMS42MDYtMjIxLjgwMiAxMC4xNzYtMTQuMDggMTQuMjUtMzIuMjU2IDYuMjI4LTQ3Ljc2Ni00Ljg4NC05LjQ3Mi0xMi4yNDQtMjAuODQyLTIzLjI3NC0zMi43NjgtOC4wODYtOC43NjgtMTUuNjE2LTE1LjM4LTIyLjI3Mi0yMC4zNTItMTYuMjU2LTEyLjExNi0zNi45MDYtNi41OTItNTEuNDE0IDcuNzQ0LTY0LjIxMiA2My40MDQtMTI1Ljk5NCAxMjYuNjU2LTE0Ny4xMzYgMTQ4LjM3NHoiIGZpbGw9IiMxNjc3RkYiIHAtaWQ9IjE1OTYiPjwvcGF0aD48L3N2Zz4=');
  background-size: cover;
  transform: rotate(-90deg);
  -ms-transform: rotate(-90deg);
  -moz-transform: rotate(-90deg);
  -webkit-transform: rotate(-90deg);
  -o-transform: rotate(-90deg);
}

.arrow-down {
  transform: rotate(0deg);
  -ms-transform: rotate(0deg);
  -moz-transform: rotate(0deg);
  -webkit-transform: rotate(0deg);
  -o-transform: rotate(0deg);
}

.minus,
.plus {
  display: inline-block;
  width: 40rpx;
  height: 40rpx;
  background-size: cover;
}

.plus {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB0PSIxNjkzMTA4OTMwMzIzIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjMyNTQiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTEyIDEwMjRjLTI4MC44Njg1NzEgMC01MTItMjMxLjEzMTQyOS01MTItNTEyczIzMS4xMzE0MjktNTEyIDUxMi01MTIgNTEyIDIzMS4xMzE0MjkgNTEyIDUxMi0yMjYuNTIzNDI5IDUwNy40NjUxNDMtNTEyIDUxMnogbTI1OC4yNjc0MjktNTU3LjM0ODU3MUw1NTcuMjc1NDI5IDQ2Mi4yNjI4NTdWMjQ0LjY2Mjg1N2MwLTI3LjIwOTE0My0xOC4wNjYyODYtNDUuMzQ4NTcxLTQ1LjI3NTQyOS00NS4zNDg1NzFzLTQ1LjM0ODU3MSAxOC4xMzk0MjktNDUuMzQ4NTcxIDQ1LjM0ODU3MVY0NjIuMjYyODU3TDI1My44MDU3MTQgNDY2LjY1MTQyOWMtMjcuMjA5MTQzIDAtNDUuMzQ4NTcxIDE4LjA2NjI4Ni00NS4zNDg1NzEgNDUuMjc1NDI4czE4LjEzOTQyOSA0NS4zNDg1NzEgNDUuMzQ4NTcxIDQ1LjM0ODU3MmwyMTIuOTkyLTQuNTM0ODU4djIxNy40NTM3MTVjMCAyNy4yMDkxNDMgMTguMDY2Mjg2IDQ1LjM0ODU3MSA0NS4yNzU0MjkgNDUuMzQ4NTcxczQ1LjM0ODU3MS0xOC4xMzk0MjkgNDUuMzQ4NTcxLTQ1LjM0ODU3MVY1NTIuODEzNzE0aDIxNy40NTM3MTVjMjcuMjA5MTQzIDAgNDUuMzQ4NTcxLTE4LjEzOTQyOSA0NS4zNDg1NzEtNDUuMzQ4NTcxLTkuMTQyODU3LTI3LjIwOTE0My0yNy4yMDkxNDMtNDUuMzQ4NTcxLTQ5Ljg4MzQyOS00MC43NDA1NzJ6IiBmaWxsPSIjNEI4MUZDIiBwLWlkPSIzMjU1Ij48L3BhdGg+PC9zdmc+');
}

.minus {
  background-image: url('data:image/svg+xml;base64,PHN2ZyB0PSIxNjkzMTA5MTkyODkyIiBjbGFzcz0iaWNvbiIgdmlld0JveD0iMCAwIDEwMjQgMTAyNCIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHAtaWQ9IjE0NTgiIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIj48cGF0aCBkPSJNNTEyIDEwMjRjLTI4MC44Njg1NzEgMC01MTItMjMxLjEzMTQyOS01MTItNTEyczIzMS4xMzE0MjktNTEyIDUxMi01MTIgNTEyIDIzMS4xMzE0MjkgNTEyIDUxMi0yMjYuNTIzNDI5IDUwNy40NjUxNDMtNTEyIDUxMnogbTI1OC4yNjc0MjktNTU3LjM0ODU3MUgyNTMuNzMyNTcxYy0yNy4yMDkxNDMgMC00NS4zNDg1NzEgMTguMTM5NDI5LTQ1LjM0ODU3MSA0NS4zNDg1NzFzMTguMTM5NDI5IDQ1LjM0ODU3MSA0NS4zNDg1NzEgNDUuMzQ4NTcxbDUyMS4wNjk3MTUtNC41MzQ4NTdjMjcuMjA5MTQzIDAgNDUuMzQ4NTcxLTE4LjEzOTQyOSA0NS4zNDg1NzEtNDUuMzQ4NTcxLTkuMTQyODU3LTI3LjIwOTE0My0yNy4yMDkxNDMtNDUuMzQ4NTcxLTQ5Ljg4MzQyOC00MC43NDA1NzJ6IiBmaWxsPSIjNEI4MUZDIiBwLWlkPSIxNDU5Ij48L3BhdGg+PC9zdmc+');
}
</style>
