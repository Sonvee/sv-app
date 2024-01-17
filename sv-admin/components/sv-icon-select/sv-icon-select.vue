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
          <sv-icon-list :height="popHeight" @selected="selected"></sv-icon-list>
        </el-popover>
      </template>
    </el-input>
  </view>
</template>

<script setup>
import SvIconList from './sv-icon-list.vue'

defineProps({
  popWidth: {
    type: [String, Number],
    default: 300
  },
  popHeight: {
    type: [String, Number],
    default: 400
  }
})

const emits = defineEmits(['selected'])

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
