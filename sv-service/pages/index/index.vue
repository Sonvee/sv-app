<template>
  <view class="index-page">
    <uni-easyinput v-model="url" placeholder="请输入api路径">
      <template #right>
        <button size="mini" type="primary" style="margin-right: 4px" @click="toRequest">
          请求
        </button>
      </template>
    </uni-easyinput>
    <uni-easyinput
      class="top-gap"
      type="textarea"
      v-model="params"
      maxlength="-1"
      placeholder="请输入参数"
    ></uni-easyinput>
    <view class="title">请求结果</view>
    <view class="result">
      <sv-json-view :obj="result" :key="jsonviewKey"></sv-json-view>
    </view>
  </view>
</template>

<script setup>
import request from '@/service/request/index.js'
import { ref } from 'vue'

const url = ref('')
const params = ref('')
const result = ref()
const jsonviewKey = ref(0)

function apiRun(data) {
  return request({
    url: url.value,
    method: 'POST',
    data
  })
}

async function toRequest() {
  let paramObj
  result.value = null
  if (params.value.trim() == '') {
    paramObj = {}
  } else {
    paramObj = parseStringToObject(params.value)
  }
  const runRes = await apiRun(paramObj)
  result.value = runRes
  jsonviewKey.value++
}

function parseStringToObject(str) {
  // 修正键名格式
  let fixedString = str.replace(/([{,]\s*)([a-zA-Z0-9_]+?)\s*:/g, '$1"$2":')
  // 转换为对象
  let obj = JSON.parse(fixedString)
  return obj
}
</script>

<style lang="scss">
.index-page {
  width: 100%;
  height: 100%;
  padding: 10px;

  .title {
    height: 30px;
    font-size: 14px;
    display: flex;
    align-items: center;
    color: #00cc00;
    font-weight: 700;
  }

  .result {
    height: calc(100% - 94px - 37px - 40px);
    border: 1px solid #dddddd;
    border-radius: 4px;
    overflow: auto;
    padding: 8px 6px;
  }
}

.top-gap {
  margin-top: 10px;
}
</style>
