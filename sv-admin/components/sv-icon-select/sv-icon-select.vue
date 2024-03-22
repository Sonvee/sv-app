<template>
  <view class="sv-icon-select">
    <el-input
      v-bind="$attrs"
      v-model="iconVal"
      class="sv-el-input"
      placeholder="请选择图标"
      clearable
    >
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
import { ref, computed } from 'vue'
import { useSysStore } from '@/store/sys'
import SvIconList from './sv-icon-list.vue'

const props = defineProps({
  icon: {
    type: String,
    default: ''
  }
})

const emits = defineEmits(['selected', 'update:icon'])

const iconVal = computed({
  set(newVal) {
    emits('update:icon', newVal)
  },
  get() {
    return props.icon
  }
})

const popWidth = ref(300)
const popHeight = ref(200)
const colnum = ref(3)

JudgeDeviceType()
function JudgeDeviceType() {
  if (useSysStore().platform == 'pc') {
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
  emits('update:icon', e)
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