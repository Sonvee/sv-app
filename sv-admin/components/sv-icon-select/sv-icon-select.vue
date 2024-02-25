<template>
  <view class="sv-icon-select">
    <el-input v-bind="$attrs" class="sv-el-input">
      <template #append>
        <el-popover placement="bottom-start" :width="popWidth" trigger="click">
          <template #reference>
            <view class="append-btn">
              <view class="admin-icons-icon"></view>
              内置图标
            </view>
          </template>
          <sv-icon-list :height="popHeight" @selected="selected" :colnum="colnum"></sv-icon-list>
        </el-popover>
      </template>
    </el-input>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import SvIconList from './sv-icon-list.vue'

const emits = defineEmits(['selected'])

const popWidth = ref(300)
const popHeight = ref(200)
const colnum = ref(3)

JudgeDeviceType()
function JudgeDeviceType() {
  const windowWidth = uni.getSystemInfoSync().windowWidth
  if (windowWidth > 600) {
    popWidth.value = 400
    popHeight.value = 400
    colnum.value = 4
  } else {
    popWidth.value = 300
    popHeight.value = 200
    colnum.value = 3
  }
}

function selected(e) {
  emits('selected', e)
}
</script>

<style lang="scss">
.sv-icon-select {
  width: 100%;

  :deep(.el-input-group__append) {
    padding: 0;
  }

  .append-btn {
    padding: 0 10px;
    cursor: pointer;
    &:active {
      color: $uni-color-primary;
    }
  }
}
</style>
